"use client"

import { useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { ComponentLibrary } from "@/components/component-library"
import { FormCanvas } from "@/components/form-canvas"
import { ConfigPanel } from "@/components/config-panel"
import { FormHeader } from "@/components/form-header"
import type { FormComponent, FormData } from "@/lib/types"
import { generateId } from "@/lib/utils"

export function FormBuilder() {
  const [formData, setFormData] = useState<FormData>({
    id: generateId(),
    title: "Untitled Form",
    description: "",
    settings: {
      requiresLogin: false,
      confirmationMessage: "Thank you for your submission!",
      allowMultipleSubmissions: true,
    },
    fields: [],
  })

  const [selectedComponent, setSelectedComponent] = useState<FormComponent | null>(null)
  const [activeTab, setActiveTab] = useState<"properties" | "structure" | "json">("properties")

  const handleAddComponent = (component: FormComponent) => {
    const newComponent = {
      ...component,
      id: generateId(),
      order: formData.fields.length,
    }

    setFormData((prev) => ({
      ...prev,
      fields: [...prev.fields, newComponent],
    }))

    setSelectedComponent(newComponent)
  }

  const handleUpdateComponent = (updatedComponent: FormComponent) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.map((field) => (field.id === updatedComponent.id ? updatedComponent : field)),
    }))

    if (selectedComponent?.id === updatedComponent.id) {
      setSelectedComponent(updatedComponent)
    }
  }

  const handleDeleteComponent = (componentId: string) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields
        .filter((field) => field.id !== componentId)
        .map((field, index) => ({ ...field, order: index })),
    }))

    if (selectedComponent?.id === componentId) {
      setSelectedComponent(null)
    }
  }

  const handleReorderComponents = (reorderedComponents: FormComponent[]) => {
    setFormData((prev) => ({
      ...prev,
      fields: reorderedComponents,
    }))
  }

  const handleFormUpdate = (updates: Partial<FormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
    }))
  }

  const handleFormDataReplace = (newFormData: FormData) => {
    setFormData(newFormData)
    setSelectedComponent(null)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen">
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
