"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { ComponentLibrary } from "@/components/component-library"
import { FormCanvas } from "@/components/form-canvas"
import { ConfigPanel } from "@/components/config-panel"
import { FormHeader } from "@/components/form-header"
import type { FormComponent, FormData } from "@/lib/types"
import { generateId } from "@/lib/utils"

export function FormBuilder({ initialFormData }: { initialFormData?: FormData }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedComponent, setSelectedComponent] = useState<FormComponent | null>(null)
  const [activeTab, setActiveTab] = useState<"properties" | "structure" | "json">("properties")

  const [formData, setFormData] = useState<FormData>(initialFormData || {
    id: generateId(),
    title: "Untitled Form",
    description: "Here goes a nice description about your form",
    settings: {
      requiresLogin: false,
      confirmationMessage: "Thank you for your submission!",
      allowMultipleSubmissions: true,
    },
    fields: [],
  })

  // Create form on mount if it's new
  useEffect(() => {
    if (!initialFormData) {
      createForm()
    }
  }, [])

  // Debounced save effect
  useEffect(() => {
    if (!formData.id) return

    const timeoutId = setTimeout(() => {
      saveForm()
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [formData])

  const createForm = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('http://127.0.0.1:8000/api/v1/forms/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          id: formData.id,
          data: formData
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const newForm = await response.json()
      setFormData(newForm)
      router.replace(`/builder/${newForm.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create form')
    } finally {
      setIsLoading(false)
    }
  }

  const saveForm = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`http://127.0.0.1:8000/api/v1/forms/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          id: formData.id,
          data: formData
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const updatedForm = await response.json()
      setFormData(updatedForm)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save form')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddComponent = (component: FormComponent) => {
    const newComponent = {
      ...component,
      id: generateId(),
      order: formData.fields.length,
    }

    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newComponent],
    }))

    setSelectedComponent(newComponent)
  }

  const handleUpdateComponent = (updatedComponent: FormComponent) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === updatedComponent.id ? updatedComponent : field
      ),
    }))

    if (selectedComponent?.id === updatedComponent.id) {
      setSelectedComponent(updatedComponent)
    }
  }

  const handleDeleteComponent = (componentId: string) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields
        .filter(field => field.id !== componentId)
        .map((field, index) => ({ ...field, order: index })),
    }))

    if (selectedComponent?.id === componentId) {
      setSelectedComponent(null)
    }
  }

  const handleReorderComponents = (reorderedComponents: FormComponent[]) => {
    setFormData(prev => ({
      ...prev,
      fields: reorderedComponents,
    }))
  }

  const handleFormUpdate = (updates: Partial<FormData>) => {
    setFormData(prev => ({
      ...prev,
      ...updates,
    }))
  }

  const handleFormDataReplace = async (newFormData: FormData) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/v1/forms/${newFormData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(newFormData)
      })

      if (!response.ok) throw new Error('Failed to replace form')

      const updatedForm = await response.json()
      setFormData(updatedForm)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to replace form')
    } finally {
      setIsLoading(false)
    }
  }

  const getAuthToken = () => {
    // Retrieve your authentication token from wherever it's stored
    return localStorage.getItem('token')
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen relative">
        {/* Loading and error indicators */}
        {isLoading && (
          <div className="absolute top-2 right-2 p-3 bg-blue-100 text-blue-800 rounded-lg shadow-md">
            ⏳ Saving changes...
          </div>
        )}

        {error && (
          <div className="absolute top-2 right-2 p-3 bg-red-100 text-red-800 rounded-lg shadow-md">
            ❗ Error: {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        )}

        <FormHeader formData={formData} onFormUpdate={handleFormUpdate} />

        <div className="flex flex-1 overflow-hidden">
          <ComponentLibrary onAddComponent={handleAddComponent} />

          <FormCanvas
            formData={formData}
            selectedComponentId={selectedComponent?.id}
            onSelectComponent={setSelectedComponent}
            onUpdateComponent={handleUpdateComponent}
            onDeleteComponent={handleDeleteComponent}
            onReorderComponents={handleReorderComponents}
          />

          <ConfigPanel
            formData={formData}
            selectedComponent={selectedComponent}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onUpdateComponent={handleUpdateComponent}
            onFormUpdate={handleFormUpdate}
            onFormDataReplace={handleFormDataReplace}
          />
        </div>
      </div>
    </DndProvider>
  )
}