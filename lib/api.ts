import type { FormComponent, FormData } from "@/lib/types"
import { generateId } from "@/lib/utils"

// Base URL of the FastAPI backend, configurable per environment
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1").replace(/\/$/, "")

const TOKEN_KEY = "token"

export const DEFAULT_SETTINGS: FormData["settings"] = {
  requiresLogin: false,
  confirmationMessage: "Thank you for your submission!",
  allowMultipleSubmissions: true,
}

/* ---------- API shapes (mirror the backend Pydantic schemas) ---------- */

export interface ApiUser {
  id: string
  email: string
  is_active: boolean
  created_at: string
  updated_at: string | null
}

export interface ApiForm {
  id: string
  owner_id: string
  data: Omit<FormData, "id">
  created_at: string
  updated_at: string | null
  owner: ApiUser
  response_count?: number
}

export interface ApiResponse {
  id: string
  form_id: string
  data: Record<string, unknown>
  created_at: string
  updated_at: string | null
}

/* ---------- auth token storage ---------- */

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem("email")
}

/* ---------- errors ---------- */

export class ApiError extends Error {
  status: number
  // Per-field messages from server-side validation (field id -> message)
  fieldErrors: Record<string, string>

  constructor(status: number, message: string, fieldErrors: Record<string, string> = {}) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

// FastAPI returns `detail` as a string, a list of validation errors, or our {message, errors} object
function parseErrorDetail(detail: unknown, fallback: string): { message: string; fieldErrors: Record<string, string> } {
  if (typeof detail === "string") return { message: detail, fieldErrors: {} }
  if (Array.isArray(detail)) {
    return { message: detail.map((item) => item?.msg).filter(Boolean).join(", ") || fallback, fieldErrors: {} }
  }
  if (detail && typeof detail === "object") {
    const { message, errors } = detail as { message?: string; errors?: Record<string, string> }
    return { message: message || fallback, fieldErrors: errors || {} }
  }
  return { message: fallback, fieldErrors: {} }
}

/* ---------- request helper ---------- */

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  json?: unknown
  form?: Record<string, string>
  auth?: boolean
}

async function request<T>(path: string, { method = "GET", json, form, auth = true }: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {}
  let body: BodyInit | undefined

  if (json !== undefined) {
    headers["Content-Type"] = "application/json"
    body = JSON.stringify(json)
  } else if (form) {
    headers["Content-Type"] = "application/x-www-form-urlencoded"
    body = new URLSearchParams(form)
  }

  if (auth) {
    const token = getAuthToken()
    if (token) headers["Authorization"] = `Bearer ${token}`
  }

  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, { method, headers, body })
  } catch {
    throw new ApiError(0, "Cannot reach the server. Is the backend running?")
  }

  if (!res.ok) {
    const payload = await res.json().catch(() => null)
    const { message, fieldErrors } = parseErrorDetail(payload?.detail, res.statusText || "Request failed")
    // An expired or invalid token is useless; drop it so the user is sent back to sign in
    if (res.status === 401 && auth) clearAuthToken()
    throw new ApiError(res.status, message, fieldErrors)
  }

  return (res.status === 204 ? undefined : await res.json()) as T
}

/* ---------- shape conversion between the API and the builder ---------- */

// The backend stores every optional field; drop nulls so React inputs stay controlled
function withoutNulls<T extends object>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== null)) as T
}

// The form id lives on the API object, not inside `data`, so merge it back in
export function toFormData(form: ApiForm): FormData {
  const { data } = form
  return {
    ...data,
    id: form.id,
    title: data.title || "Untitled Form",
    description: data.description ?? "",
    settings: { ...DEFAULT_SETTINGS, ...(data.settings ?? {}) },
    fields: (data.fields ?? []).map((field) => withoutNulls(field) as FormComponent),
  }
}

function toPayload(formData: FormData): Omit<FormData, "id"> {
  const { id: _id, ...data } = formData
  return data
}

/* ---------- endpoints ---------- */

export const api = {
  login: (email: string, password: string) =>
    // OAuth2 password flow: form-encoded body, email goes in `username`
    request<{ access_token: string; token_type: string }>("/auth/token", {
      method: "POST",
      form: { username: email, password },
      auth: false,
    }),

  register: (email: string, password: string) =>
    request<ApiUser>("/auth/register", { method: "POST", json: { email, password }, auth: false }),

  me: () => request<ApiUser>("/users/me"),

  listForms: () => request<ApiForm[]>("/forms/"),

  // Public: anyone with the link can load a form to fill it in
  getForm: (formId: string) => request<ApiForm>(`/forms/${formId}`, { auth: false }),

  createForm: (formData: FormData) =>
    request<ApiForm>("/forms/", { method: "POST", json: { id: formData.id, data: toPayload(formData) } }),

  updateForm: (formData: FormData) =>
    request<ApiForm>(`/forms/${formData.id}`, { method: "PUT", json: { data: toPayload(formData) } }),

  deleteForm: (formId: string) => request<ApiForm>(`/forms/${formId}`, { method: "DELETE" }),

  duplicateForm: (formData: FormData) =>
    api.createForm({ ...formData, id: generateId(), title: `${formData.title} (copy)` }),

  // Public: respondents don't need an account
  submitResponse: (formId: string, answers: Record<string, unknown>) =>
    request<ApiResponse>(`/forms/${formId}/responses/`, { method: "POST", json: { data: answers }, auth: false }),

  listResponses: (formId: string) => request<ApiResponse[]>(`/forms/${formId}/responses/?limit=5000`),
}
