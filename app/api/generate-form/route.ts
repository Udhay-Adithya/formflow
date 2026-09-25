// app/api/generate-form/route.ts
import { NextRequest, NextResponse } from "next/server"
import { AiError, generateForm } from "@/lib/ai/form-generator"
import { requireUser } from "@/lib/ai/require-user"

const MAX_PROMPT_LENGTH = 2000

export async function POST(request: NextRequest) {
  try {
    await requireUser(request)

    const body = await request.json().catch(() => null)
    const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : ""

    if (!prompt) {
      return NextResponse.json({ error: "Text prompt is required" }, { status: 400 })
    }
    if (prompt.length > MAX_PROMPT_LENGTH) {
      return NextResponse.json({ error: `Prompt must be at most ${MAX_PROMPT_LENGTH} characters` }, { status: 400 })
    }

    const formData = await generateForm({ prompt })
    return NextResponse.json({ formData })
  } catch (error) {
    if (error instanceof AiError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error("Error generating form:", error)
    return NextResponse.json({ error: "Failed to generate form" }, { status: 500 })
  }
}
