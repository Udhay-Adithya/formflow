"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save, Eye, Sun, Moon, Home, MoreHorizontal, BarChart3, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { FormData } from "@/lib/types"
import { AiFormGenerator } from "@/components/ai-form-generator"
import { FormPreview } from "@/components/form-preview"
import { ShareFormDialog } from "./share-form-dialogue"
import type { SaveState } from "@/components/form-builder"
import { api } from "@/lib/api"

interface FormHeaderProps {
  formData: FormData
  onFormUpdate: (updates: Partial<FormData>) => void
  saveState: SaveState
  onSave: () => Promise<void>
}

const SAVE_STATE_LABEL: Record<SaveState, string> = {
  saved: "All changes saved",
  unsaved: "Unsaved changes",
  saving: "Saving...",
  error: "Save failed",
}

export function FormHeader({ formData, onFormUpdate, saveState, onSave }: FormHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const handleTitleClick = () => {
    setIsEditing(true)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFormUpdate({ title: e.target.value })
  }

  const handleTitleBlur = () => {
    setIsEditing(false)
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false)
    }
  }

  const handleSave = () => {
    onSave()
  }

  // Save pending edits first so the copy includes them
  const handleDuplicate = async () => {
    await onSave()
    try {
      const copy = await api.duplicateForm(formData)
      router.push(`/builder/${copy.id}`)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to duplicate form")
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Delete "${formData.title}" and all of its responses? This cannot be undone.`)) return
    try {
      await api.deleteForm(formData.id)
      router.push("/dashboard")
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete form")
    }
  }

  const handlePreview = () => {
    setPreviewOpen(true)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleFormGenerated = (generatedForm: FormData) => {
    // Preserve the original ID
    onFormUpdate({
      ...generatedForm,
      id: formData.id,
    })
  }

  return (
    <>
      <header className="border-b bg-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
            <Home className="h-5 w-5" />
            <span className="sr-only">Dashboard</span>
          </Button>

          {isEditing ? (
            <Input
              value={formData.title}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              className="text-lg font-medium h-9 w-64"
              autoFocus
            />
          ) : (
            <h1 className="text-lg font-medium cursor-pointer hover:text-primary" onClick={handleTitleClick}>
              {formData.title || "Untitled Form"}
            </h1>
          )}

          <span
            className={`hidden md:inline text-xs ${saveState === "error" ? "text-destructive" : "text-muted-foreground"}`}
            aria-live="polite"
          >
            {SAVE_STATE_LABEL[saveState]}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <AiFormGenerator onFormGenerated={handleFormGenerated} />

          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={handleSave}
            disabled={saveState === "saved" || saveState === "saving"}
          >
            {saveState === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span className="hidden sm:inline">Save</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => router.push(`/dashboard/forms/${formData.id}/responses`)}
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Responses</span>
          </Button>

          <Button variant="outline" size="sm" className="gap-1" onClick={handlePreview}>
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Preview</span>
          </Button>

          <ShareFormDialog formData={formData} />

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDuplicate}>Duplicate</DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <FormPreview open={previewOpen} onOpenChange={setPreviewOpen} formData={formData} />
    </>
  )
}
