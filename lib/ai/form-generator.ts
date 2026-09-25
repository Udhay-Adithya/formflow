// Server-only: imported by the /api/generate-form* route handlers, never by client components,
// so the Gemini API key stays on the server.
import { randomUUID } from "crypto"
import { ApiError as GeminiApiError, GoogleGenAI, HarmBlockThreshold, HarmCategory, type Part } from "@google/genai"
import type { FormComponent, FormData } from "@/lib/types"

const DEFAULT_MODEL = "gemini-3.8-flash"

// Field types the builder knows how to render (see lib/render-component.tsx)
const FIELD_TYPES = [
  "text", "paragraph", "number", "email", "phone", "date_time", "multiple_choice", "checkboxes",
  "dropdown", "checkbox", "description", "form_heading", "section_heading", "sub_heading", "divider", "page_break",
]
const OPTION_TYPES = new Set(["multiple_choice", "checkboxes", "dropdown"])

const DEFAULT_SETTINGS = {
  requiresLogin: false,
  confirmationMessage: "Thank you for your submission!",
  allowMultipleSubmissions: true,
}

/* ---------- errors, mapped to HTTP responses by the route handlers ---------- */

export class AiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

/* ---------- prompt and structured-output schema ---------- */

const SYSTEM_INSTRUCTION = `You design web forms. Given a description (and optionally an image of an existing form),
produce a complete, well-structured form definition.

Rules:
- Use only these field types: ${FIELD_TYPES.join(", ")}.
- multiple_choice = pick one, checkboxes = pick many, dropdown = pick one from a long list,
  checkbox = a single yes/no agreement. These choice fields must include config.options.
- Use email/phone/number/date_time when the question asks for that kind of value.
- Use section_heading to group long forms; use description for explanatory text (put the text in config.text).
- Mark only essential questions as required. Write short, clear labels and helpful placeholders.
- For number fields, set validation.min / validation.max when a sensible range exists.
- Do not add a submit button; one is added automatically.
- When given an image, reproduce the form's questions faithfully in order.`

// JSON Schema passed to Gemini so the response is guaranteed to match this shape
const FORM_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    settings: {
      type: "object",
      properties: {
        confirmationMessage: { type: "string" },
        allowMultipleSubmissions: { type: "boolean" },
      },
    },
    fields: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: { type: "string", enum: FIELD_TYPES },
          label: { type: "string" },
          description: { type: "string" },
          required: { type: "boolean" },
          placeholder: { type: "string" },
          validation: {
            type: "object",
            properties: {
              min: { type: "number" },
              max: { type: "number" },
              minLength: { type: "integer" },
              maxLength: { type: "integer" },
            },
          },
          config: {
            type: "object",
            properties: {
              options: {
                type: "array",
                items: {
                  type: "object",
                  properties: { label: { type: "string" }, value: { type: "string" } },
                  required: ["label", "value"],
                },
              },
              allowOther: { type: "boolean" },
              text: { type: "string" },
            },
          },
        },
        required: ["type", "label"],
      },
    },
  },
  required: ["title", "fields"],
}

const SAFETY_SETTINGS = [
  HarmCategory.HARM_CATEGORY_HARASSMENT,
  HarmCategory.HARM_CATEGORY_HATE_SPEECH,
  HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
  HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
].map((category) => ({ category, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE }))

/* ---------- client ---------- */

let client: GoogleGenAI | null = null

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new AiError(503, "AI generation is not configured. Add GEMINI_API_KEY to .env.local and restart the server.")
  }
  client ??= new GoogleGenAI({ apiKey })
  return client
}

/* ---------- output normalization ---------- */

const slugify = (text: string) =>
  text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || "option"

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {}
}

function normalizeOptions(raw: unknown) {
  const seen = new Set<string>()
  const options: { label: string; value: string }[] = []
  for (const item of Array.isArray(raw) ? raw : []) {
    const option = asRecord(item)
    const label = String(option.label ?? option.value ?? "").trim()
    if (!label) continue
    let value = slugify(String(option.value || label))
    while (seen.has(value)) value = `${value}_${seen.size}`
    seen.add(value)
    options.push({ label, value })
  }
  return options
}

// Never trust model output blindly: keep only known field types and fill in ids, order and options
export function normalizeGeneratedForm(raw: unknown): Omit<FormData, "id"> {
  const form = asRecord(raw)
  const fields: FormComponent[] = []

  for (const item of Array.isArray(form.fields) ? form.fields : []) {
    const field = asRecord(item)
    const type = String(field.type ?? "")
    if (!FIELD_TYPES.includes(type)) continue

    const config = asRecord(field.config)
    const normalized: FormComponent = {
      id: randomUUID(),
      type,
      order: fields.length,
      label: String(field.label ?? "").trim() || type.replace(/_/g, " "),
      required: field.required === true,
    }
    if (typeof field.description === "string" && field.description) normalized.description = field.description
    if (typeof field.placeholder === "string" && field.placeholder) normalized.placeholder = field.placeholder
    if (Object.keys(asRecord(field.validation)).length) normalized.validation = asRecord(field.validation)

    if (OPTION_TYPES.has(type)) {
      const options = normalizeOptions(config.options)
      normalized.config = {
        options: options.length ? options : normalizeOptions([{ label: "Option 1" }, { label: "Option 2" }]),
        allowOther: config.allowOther === true,
      }
    } else if (typeof config.text === "string" && config.text) {
      normalized.config = { text: config.text }
    }

    fields.push(normalized)
  }

  if (fields.length === 0) {
    throw new AiError(502, "The AI response did not contain any usable fields. Try rephrasing your request.")
  }

  const settings = asRecord(form.settings)
  return {
    title: String(form.title ?? "").trim() || "Generated Form",
    description: typeof form.description === "string" ? form.description : "",
    settings: {
      ...DEFAULT_SETTINGS,
      ...(typeof settings.confirmationMessage === "string" && { confirmationMessage: settings.confirmationMessage }),
      ...(typeof settings.allowMultipleSubmissions === "boolean" && {
        allowMultipleSubmissions: settings.allowMultipleSubmissions,
      }),
    },
    fields,
  }
}

/* ---------- generation ---------- */

export async function generateForm({
  prompt,
  image,
}: {
  prompt: string
  image?: { data: string; mimeType: string }
}): Promise<Omit<FormData, "id">> {
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL
  const parts: Part[] = []
  if (image) parts.push({ inlineData: { mimeType: image.mimeType, data: image.data } })
  parts.push({
    text: image
      ? `Recreate the form shown in this image.${prompt ? ` Additional instructions: ${prompt}` : ""}`
      : `Create a form for: ${prompt}`,
  })

  let text: string | undefined
  try {
    const response = await getClient().models.generateContent({
      model,
      contents: [{ role: "user", parts }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2,
        responseMimeType: "application/json",
        responseJsonSchema: FORM_SCHEMA,
        safetySettings: SAFETY_SETTINGS,
      },
    })
    text = response.text
  } catch (err) {
    if (err instanceof AiError) throw err
    if (err instanceof GeminiApiError) {
      if (err.status === 400 || err.status === 401 || err.status === 403) {
        throw new AiError(502, "Gemini rejected the request. Check that GEMINI_API_KEY is valid.")
      }
      if (err.status === 404) {
        throw new AiError(502, `Gemini model "${model}" is not available. Set GEMINI_MODEL to a supported model.`)
      }
      if (err.status === 429) {
        throw new AiError(429, "Gemini rate limit reached. Please wait a moment and try again.")
      }
    }
    console.error("Gemini request failed:", err)
    throw new AiError(502, "The AI service is unavailable right now. Please try again.")
  }

  if (!text) {
    throw new AiError(502, "The AI returned an empty response (it may have been blocked by safety filters).")
  }

  try {
    return normalizeGeneratedForm(JSON.parse(text))
  } catch (err) {
    if (err instanceof AiError) throw err
    throw new AiError(502, "The AI returned an invalid form. Please try again.")
  }
}
