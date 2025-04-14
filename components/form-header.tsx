"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save, Eye, Share2, Sun, Moon, Home, MoreHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { FormData } from "@/lib/types"
import { AiFormGenerator } from "@/components/ai-form-generator"
import { FormPreview } from "@/components/form-preview"

interface FormHeaderProps {
  formData: FormData
  onFormUpdate: (updates: Partial<FormData>) => void
}

export function FormHeader({ formData, onFormUpdate }: FormHeaderProps) {
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
    // Save form logic would go here
    console.log("Saving form:", formData)
  }

  const handlePreview = () => {
    setPreviewOpen(true)
  }

  const handleShare = () => {
    // Share form logic would go here
    console.log("Sharing form:", formData)
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
        </div>

        <div className="flex items-center gap-2">
          <AiFormGenerator onFormGenerated={handleFormGenerated} />

          <Button variant="outline" size="sm" className="gap-1" onClick={handleSave}>
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">Save</span>
          </Button>

          <Button variant="outline" size="sm" className="gap-1" onClick={handlePreview}>
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Preview</span>
          </Button>

          <Button variant="outline" size="sm" className="gap-1" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>

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
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem>Export</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <FormPreview open={previewOpen} onOpenChange={setPreviewOpen} formData={formData} />
    </>
  )
}
