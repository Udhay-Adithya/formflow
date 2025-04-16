"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { FormBuilder } from "@/components/form-builder"
import type { FormData } from "@/lib/types"
import { Progress } from "@/components/ui/progress"
import { generateId, getAuthToken } from "@/lib/utils"

export default function FormBuilderPage() {
  const params = useParams()
  const formId = params.formId as string
  const [formData, setFormData] = useState<FormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/v1/forms/${formId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          },
        })
        console.log(response.body)
        if (response.status === 404) {
          const f1: FormData = {
            id: generateId(),
            title: "Untitled Form",
            description: "Here goes a nice description about your form",
            settings: {
              requiresLogin: false,
              confirmationMessage: "Thank you for your submission!",
              allowMultipleSubmissions: true,
            },
            fields: [],
          }
          setFormData(f1)
        }
        if (!response.ok && !(response.status === 404)) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setFormData(data["data"])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load form')
      } finally {
        setLoading(false)
      }
    }

    if (formId) {
      fetchForm()
    }
  }, [formId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Progress className="h-12 w-12 text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-600 p-4 border border-red-200 rounded-lg">
          Error loading form: {error}
        </div>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Form not found</div>
      </div>
    )
  }

  return <FormBuilder initialFormData={formData} />
}