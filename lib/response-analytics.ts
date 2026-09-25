import { format, startOfDay, subDays } from "date-fns"
import type { ApiResponse } from "@/lib/api"
import type { FormComponent } from "@/lib/types"

// Components that only display content and never collect an answer
export const DISPLAY_ONLY_TYPES = new Set([
  "description", "image", "link", "form_heading", "section_heading",
  "sub_heading", "divider", "spacer", "submit", "page_break",
])

export const CHOICE_TYPES = new Set(["multiple_choice", "dropdown", "choice", "checkboxes", "checkbox"])
export const TEXT_TYPES = new Set(["text", "paragraph", "text_editor", "email", "phone", "signature"])

export function getInputFields(fields: FormComponent[]) {
  return [...fields].filter((field) => !DISPLAY_ONLY_TYPES.has(field.type)).sort((a, b) => a.order - b.order)
}

export function isAnswered(value: unknown) {
  return !(
    value === undefined ||
    value === null ||
    value === false ||
    (typeof value === "string" && value.trim() === "") ||
    (Array.isArray(value) && value.length === 0)
  )
}

function optionLabel(field: FormComponent, value: unknown) {
  if (value === "other") return "Other"
  return field.config?.options?.find((option) => option.value === value)?.label ?? String(value)
}

// Human-readable answer: option labels instead of stored values, Yes/No for booleans, formatted dates
export function formatAnswer(field: FormComponent, value: unknown): string {
  if (!isAnswered(value)) return field.type === "checkbox" && value === false ? "No" : ""
  if (Array.isArray(value)) return value.map((item) => optionLabel(field, item)).join(", ")
  if (typeof value === "boolean") return value ? "Yes" : "No"
  if (field.type === "date_time" && typeof value === "string") {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? value : format(date, "PP")
  }
  if (CHOICE_TYPES.has(field.type)) return optionLabel(field, value)
  return String(value)
}

// Average share of questions answered per response, as a 0-100 percentage
export function completionRate(responses: ApiResponse[], inputFields: FormComponent[]) {
  if (responses.length === 0 || inputFields.length === 0) return 0
  const total = responses.reduce((sum, response) => {
    const answered = inputFields.filter((field) => isAnswered(response.data[field.id])).length
    return sum + answered / inputFields.length
  }, 0)
  return Math.round((total / responses.length) * 100)
}

// Responses per day for the last `days` days, including days with zero responses
export function dailyCounts(responses: ApiResponse[], days = 14) {
  const today = startOfDay(new Date())
  const buckets = Array.from({ length: days }, (_, i) => {
    const day = subDays(today, days - 1 - i)
    return { key: format(day, "yyyy-MM-dd"), date: format(day, "MMM d"), count: 0 }
  })
  const byKey = new Map(buckets.map((bucket) => [bucket.key, bucket]))
  responses.forEach((response) => {
    const bucket = byKey.get(format(new Date(response.created_at), "yyyy-MM-dd"))
    if (bucket) bucket.count += 1
  })
  return buckets
}

// How many responses picked each option (multi-select answers count once per option)
export function optionCounts(field: FormComponent, responses: ApiResponse[]) {
  if (field.type === "checkbox") {
    const yes = responses.filter((response) => response.data[field.id] === true).length
    return [
      { name: "Yes", value: yes },
      { name: "No", value: responses.length - yes },
    ]
  }

  const counts = new Map<string, number>((field.config?.options ?? []).map((option) => [option.value, 0]))
  responses.forEach((response) => {
    const value = response.data[field.id]
    const values = Array.isArray(value) ? value : isAnswered(value) ? [value] : []
    values.forEach((item) => counts.set(String(item), (counts.get(String(item)) ?? 0) + 1))
  })
  return [...counts.entries()].map(([value, count]) => ({ name: optionLabel(field, value), value: count }))
}

export function numberStats(field: FormComponent, responses: ApiResponse[]) {
  const values = responses
    .map((response) => response.data[field.id])
    .filter((value): value is number => typeof value === "number" && !Number.isNaN(value))
  if (values.length === 0) return null
  const sum = values.reduce((total, value) => total + value, 0)
  return {
    count: values.length,
    average: sum / values.length,
    min: Math.min(...values),
    max: Math.max(...values),
  }
}

// Spreadsheet apps execute cells starting with these characters as formulas (CSV injection)
const FORMULA_PREFIX = /^[=+\-@\t\r]/

function csvCell(text: string) {
  const safe = FORMULA_PREFIX.test(text) ? `'${text}` : text
  return `"${safe.replace(/"/g, '""')}"`
}

export function responsesToCsv(responses: ApiResponse[], inputFields: FormComponent[]) {
  const header = ["Submitted at", ...inputFields.map((field) => field.label || field.type)]
  const rows = responses.map((response) => [
    format(new Date(response.created_at), "yyyy-MM-dd HH:mm:ss"),
    ...inputFields.map((field) => formatAnswer(field, response.data[field.id])),
  ])
  // Leading BOM so Excel opens UTF-8 correctly
  return "﻿" + [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n")
}

export function downloadFile(content: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
