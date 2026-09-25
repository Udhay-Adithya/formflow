// app/api/generate-form-from-image/route.ts
import { NextRequest, NextResponse } from "next/server"
import { AiError, generateForm } from "@/lib/ai/form-generator"
import { requireUser } from "@/lib/ai/require-user"

const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const MAX_PROMPT_LENGTH = 1000
// Image formats Gemini accepts as inline data
const SUPPORTED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/heic", "image/heif"])

export async function POST(request: NextRequest) {
  try {
    await requireUser(request)

    const formData = await request.formData()
    const imageFile = formData.get("image")
    const prompt = String(formData.get("prompt") ?? "").trim()

    if (!(imageFile instanceof File)) {
      return NextResponse.json({ error: "Image file is required" }, { status: 400 })
    }
    if (!SUPPORTED_IMAGE_TYPES.has(imageFile.type)) {
      return NextResponse.json({ error: "Upload a PNG, JPEG, WEBP or HEIC image" }, { status: 400 })
    }
    if (imageFile.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "Image must be 5 MB or smaller" }, { status: 413 })
    }
    if (prompt.length > MAX_PROMPT_LENGTH) {
      return NextResponse.json({ error: `Instructions must be at most ${MAX_PROMPT_LENGTH} characters` }, { status: 400 })
    }

    const data = Buffer.from(await imageFile.arrayBuffer()).toString("base64")
    const generated = await generateForm({ prompt, image: { data, mimeType: imageFile.type } })
    return NextResponse.json({ formData: generated })
  } catch (error) {
    if (error instanceof AiError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error("Error generating form from image:", error)
    return NextResponse.json({ error: "Failed to generate form from image" }, { status: 500 })
  }
}
