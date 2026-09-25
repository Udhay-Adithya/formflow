"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { FormBuilder } from "@/components/form-builder"
import { Button } from "@/components/ui/button"
import type { FormData } from "@/lib/types"
import { api, ApiError, toFormData } from "@/lib/api"
import { loginPath, useRequireAuth } from "@/hooks/use-require-auth"

export default function FormBuilderPage() {
  const params = useParams()
  const router = useRouter()
  const formId = params.formId as string
  const isAuthed = useRequireAuth()
  const [formData, setFormData] = useState<FormData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthed || !formId) return

    const fetchForm = async () => {
      try {
        // Reading a form is public, so check ownership before allowing edits
        const [form, me] = await Promise.all([api.getForm(formId), api.me()])
        if (form.owner_id !== me.id) {
          setError("You don't have permission to edit this form.")
          return
        }
        setFormData(toFormData(form))
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          router.replace(loginPath(`/builder/${formId}`))
          return
        }
        if (err instanceof ApiError && err.status === 404) {
          setError("This form doesn't exist or was deleted.")
          return
        }
        setError(err instanceof Error ? err.message : "Failed to load form")
      }
    }

    fetchForm()
  }, [formId, isAuthed, router])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="text-destructive p-4 border border-destructive/30 rounded-lg">{error}</div>
        <Button asChild variant="outline">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="flex items-center justify-center h-screen gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading form...
      </div>
    )
  }

  return <FormBuilder initialFormData={formData} />
}
