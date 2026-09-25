import type { NextRequest } from "next/server"
import { API_URL } from "@/lib/api"
import { AiError } from "@/lib/ai/form-generator"

/**
 * AI calls cost money, so only signed-in users may trigger them.
 * The browser forwards its JWT and we ask the FastAPI backend (the auth authority) to verify it.
 */
export async function requireUser(request: NextRequest) {
  const authorization = request.headers.get("authorization")
  if (!authorization?.startsWith("Bearer ")) {
    throw new AiError(401, "Sign in to use AI generation.")
  }

  let res: Response
  try {
    res = await fetch(`${API_URL}/users/me`, { headers: { Authorization: authorization }, cache: "no-store" })
  } catch {
    throw new AiError(503, "Cannot reach the backend to verify your session.")
  }
  if (!res.ok) {
    throw new AiError(401, "Your session has expired. Please sign in again.")
  }
}
