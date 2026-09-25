import type { FormComponent, FormData } from "@/lib/types"
import { DEFAULT_SETTINGS } from "@/lib/api"
import { generateId } from "@/lib/utils"

type TemplateField = Omit<FormComponent, "id" | "order">

export interface FormTemplate {
  key: string
  title: string
  category: string
  description: string
  fields: TemplateField[]
}

const options = (...labels: string[]) => ({
  options: labels.map((label) => ({ label, value: label.toLowerCase().replace(/\s+/g, "_") })),
})

export const FORM_TEMPLATES: FormTemplate[] = [
  {
    key: "contact",
    title: "Contact Form",
    category: "Business",
    description: "Let visitors get in touch with you.",
    fields: [
      { type: "text", label: "Name", required: true, placeholder: "Your name" },
      { type: "email", label: "Email", required: true, placeholder: "you@example.com" },
      { type: "phone", label: "Phone", placeholder: "Phone number" },
      { type: "dropdown", label: "Topic", required: true, config: options("General question", "Support", "Sales", "Partnership") },
      { type: "paragraph", label: "Message", required: true, placeholder: "How can we help?" },
    ],
  },
  {
    key: "survey",
    title: "Customer Survey",
    category: "Feedback",
    description: "Measure satisfaction and collect suggestions.",
    fields: [
      { type: "multiple_choice", label: "How satisfied are you overall?", required: true, config: options("Very satisfied", "Satisfied", "Neutral", "Dissatisfied") },
      { type: "number", label: "How likely are you to recommend us? (0-10)", validation: { min: 0, max: 10 } },
      { type: "checkboxes", label: "What do you value most?", config: options("Price", "Quality", "Support", "Speed") },
      { type: "dropdown", label: "How often do you use our product?", config: options("Daily", "Weekly", "Monthly", "Rarely") },
      { type: "paragraph", label: "What could we improve?" },
    ],
  },
  {
    key: "event",
    title: "Event Registration",
    category: "Events",
    description: "Register attendees for your next event.",
    fields: [
      { type: "text", label: "Full name", required: true },
      { type: "email", label: "Email", required: true },
      { type: "text", label: "Organization" },
      { type: "multiple_choice", label: "Ticket type", required: true, config: options("General", "VIP", "Student") },
      { type: "checkboxes", label: "Sessions you plan to attend", config: options("Keynote", "Workshops", "Networking") },
      { type: "dropdown", label: "Dietary preference", config: options("None", "Vegetarian", "Vegan", "Gluten free") },
      { type: "checkbox", label: "I agree to the event terms", required: true },
    ],
  },
  {
    key: "job",
    title: "Job Application",
    category: "HR",
    description: "Collect applications for an open role.",
    fields: [
      { type: "text", label: "Full name", required: true },
      { type: "email", label: "Email", required: true },
      { type: "phone", label: "Phone", required: true },
      { type: "dropdown", label: "Position", required: true, config: options("Backend Engineer", "Frontend Engineer", "Designer", "Product Manager") },
      { type: "number", label: "Years of experience", required: true, validation: { min: 0, max: 50 } },
      { type: "text", label: "LinkedIn or portfolio URL" },
      { type: "paragraph", label: "Why do you want to join us?", required: true },
    ],
  },
]

// Build a new form from a template, with fresh ids for the form and every field
export function buildFormFromTemplate(template: FormTemplate): FormData {
  return {
    id: generateId(),
    title: template.title,
    description: template.description,
    settings: DEFAULT_SETTINGS,
    fields: template.fields.map((field, index) => ({ ...field, id: generateId(), order: index }) as FormComponent),
  }
}
