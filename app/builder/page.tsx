"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api, ApiError, DEFAULT_SETTINGS } from "@/lib/api"
import { generateId } from "@/lib/utils"
import { loginPath, useRequireAuth } from "@/hooks/use-require-auth"

// Creates a blank form on the backend, then opens it in the builder at /builder/[formId]
export default function NewFormPage() {
  const router = useRouter()
  const isAuthed = useRequireAuth()
  const [error, setError] = useState<string | null>(null)
  // React Strict Mode runs effects twice in development; this ref keeps it to one POST
  const hasCreated = useRef(false)

  useEffect(() => {
    if (!isAuthed || hasCreated.current) return
    hasCreated.current = true

    api
      .createForm({
        id: generateId(),
        title: "Untitled Form",
        description: "Here goes a nice description about your form",
        settings: DEFAULT_SETTINGS,
        fields: [],
      })
      .then((form) => router.replace(`/builder/${form.id}`))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          router.replace(loginPath("/builder"))
          return
        }
        setError(err instanceof Error ? err.message : "Failed to create form")
      })
  }, [isAuthed, router])

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      {error ? (
        <div className="text-center space-y-4">
          <p className="text-destructive">Could not create a new form: {error}</p>
          <Button asChild variant="outline">
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Creating your form...
        </div>
      )}
    </main>
  )
}
