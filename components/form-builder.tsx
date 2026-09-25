"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { ComponentLibrary } from "@/components/component-library"
import { FormCanvas } from "@/components/form-canvas"
import { ConfigPanel } from "@/components/config-panel"
import { FormHeader } from "@/components/form-header"
import type { FormComponent, FormData } from "@/lib/types"
import { generateId } from "@/lib/utils"
import { api, ApiError, DEFAULT_SETTINGS } from "@/lib/api"
import { loginPath } from "@/hooks/use-require-auth"

export type SaveState = "saved" | "unsaved" | "saving" | "error"

const AUTOSAVE_DELAY_MS = 1000

export function FormBuilder({ initialFormData }: { initialFormData: FormData }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [saveState, setSaveState] = useState<SaveState>("saved")
  const [selectedComponent, setSelectedComponent] = useState<FormComponent | null>(null)
  const [activeTab, setActiveTab] = useState<"properties" | "structure" | "json">("properties")
  const [formData, setFormData] = useState<FormData>(initialFormData)

  // Snapshot of what the server has, so unchanged state (e.g. right after loading) is never re-saved
  const lastSavedSnapshot = useRef(JSON.stringify(initialFormData))
  const latestSnapshot = useRef(lastSavedSnapshot.current)
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  // Saves run one after another so an older save can never overwrite a newer one on the server
  const saveQueue = useRef<Promise<void>>(Promise.resolve())

  latestSnapshot.current = JSON.stringify(formData)

  const persist = useCallback(
    (data: FormData) => {
      const snapshot = JSON.stringify(data)
      saveQueue.current = saveQueue.current.then(async () => {
        if (snapshot === lastSavedSnapshot.current) return
        setSaveState("saving")
        try {
          await api.updateForm(data)
          lastSavedSnapshot.current = snapshot
          setError(null)
          setSaveState(latestSnapshot.current === snapshot ? "saved" : "unsaved")
        } catch (err) {
          if (err instanceof ApiError && err.status === 401) {
            router.replace(loginPath(`/builder/${data.id}`))
            return
          }
          setSaveState("error")
          setError(err instanceof Error ? err.message : "Failed to save form")
        }
      })
      return saveQueue.current
    },
    [router],
  )

  // Debounced autosave: wait for a pause in editing, then save
  useEffect(() => {
    if (latestSnapshot.current === lastSavedSnapshot.current) return
    setSaveState("unsaved")
    clearTimeout(autosaveTimer.current)
    autosaveTimer.current = setTimeout(() => persist(formData), AUTOSAVE_DELAY_MS)
    return () => clearTimeout(autosaveTimer.current)
  }, [formData, persist])

  // Warn before closing the tab while changes are still pending
  useEffect(() => {
    if (saveState === "saved") return
    const handleBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [saveState])

  const handleSaveNow = () => {
    clearTimeout(autosaveTimer.current)
    return persist(formData)
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
      // Updates (e.g. AI-generated forms) must never change which form is being edited
      id: prev.id,
      settings: { ...prev.settings, ...updates.settings },
    }))
  }

  // JSON import replaces the whole definition but keeps this form's id; autosave persists it
  const handleFormDataReplace = (newFormData: FormData) => {
    setFormData(prev => ({
      ...newFormData,
      id: prev.id,
      description: newFormData.description ?? "",
      settings: { ...DEFAULT_SETTINGS, ...newFormData.settings },
    }))
    setSelectedComponent(null)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen relative">
        {error && (
          <div className="absolute top-20 right-4 z-10 p-3 bg-destructive/10 text-destructive border border-destructive/30 rounded-lg shadow-md">
            Could not save: {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 hover:opacity-70"
            >
              ×
            </button>
          </div>
        )}

        <FormHeader
          formData={formData}
          onFormUpdate={handleFormUpdate}
          saveState={saveState}
          onSave={handleSaveNow}
        />

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
