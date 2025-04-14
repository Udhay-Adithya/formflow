"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Loader2, Wand2 } from "lucide-react"
import type { FormData } from "@/lib/types"
import { generateId } from "@/lib/utils"

interface AiFormGeneratorProps {
  onFormGenerated: (formData: FormData) => void
}

export function AiFormGenerator({ onFormGenerated }: AiFormGeneratorProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"text" | "image">("text")
  const [prompt, setPrompt] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      // This is a mock implementation - in a real app, you would call your AI service
      // For demo purposes, we'll simulate a delay and return a mock form
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock form data based on the prompt
      const mockFormData: FormData = {
        id: generateId(),
        title: activeTab === "text" ? prompt.split(" ").slice(0, 3).join(" ") + " Form" : "Generated Form from Image",
        description: activeTab === "text" ? prompt : "Form generated from uploaded image",
        settings: {
          requiresLogin: false,
          confirmationMessage: "Thank you for your submission!",
          allowMultipleSubmissions: true,
        },
        fields: generateMockFields(prompt),
      }

      onFormGenerated(mockFormData)
      setOpen(false)
      resetForm()
    } catch (err) {
      setError("Failed to generate form. Please try again.")
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  const resetForm = () => {
    setPrompt("")
    setImageFile(null)
    setImagePreview(null)
    setError(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Wand2 className="h-4 w-4" />
          AI Generate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Generate Form with AI</DialogTitle>
          <DialogDescription>
            Describe the form you want to create or upload an image, and our AI will generate it for you.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "text" | "image")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Text Prompt</TabsTrigger>
            <TabsTrigger value="image">Image Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">Describe the form you want to create</Label>
              <Textarea
                id="prompt"
                placeholder="E.g., Create a feedback form for a hackathon event with fields for name, email, team name, project description, and rating scales for different aspects of the event."
                rows={6}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="image" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="image-upload">Upload an image</Label>
              <div className="flex items-center gap-4">
                <Input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="flex-1" />
              </div>

              {imagePreview && (
                <Card>
                  <CardHeader>
                    <CardTitle>Image Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="max-h-[200px] w-full object-contain"
                    />
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                <Label htmlFor="image-prompt">Additional context (optional)</Label>
                <Textarea
                  id="image-prompt"
                  placeholder="Add any additional details about the form you want to generate from this image."
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {error && <div className="text-sm text-destructive">{error}</div>}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || (activeTab === "text" && !prompt) || (activeTab === "image" && !imageFile)}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Form
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Helper function to generate mock fields based on the prompt
function generateMockFields(prompt: string) {
  const lowercasePrompt = prompt.toLowerCase()
  const fields = []

  // Add form heading
  fields.push({
    id: generateId(),
    type: "form_heading",
    order: 0,
    label: "Form Heading",
    config: {
      text: "AI Generated Form",
      size: "xl",
    },
  })

  // Add description
  fields.push({
    id: generateId(),
    type: "description",
    order: 1,
    label: "Description",
    config: {
      text: "This form was automatically generated based on your prompt.",
    },
  })

  // Add name field
  if (lowercasePrompt.includes("name") || lowercasePrompt.includes("contact")) {
    fields.push({
      id: generateId(),
      type: "text",
      order: fields.length,
      label: "Name",
      required: true,
      placeholder: "Enter your full name",
    })
  }

  // Add email field
  if (lowercasePrompt.includes("email") || lowercasePrompt.includes("contact")) {
    fields.push({
      id: generateId(),
      type: "email",
      order: fields.length,
      label: "Email",
      required: true,
      placeholder: "Enter your email address",
    })
  }

  // Add phone field
  if (lowercasePrompt.includes("phone") || lowercasePrompt.includes("contact")) {
    fields.push({
      id: generateId(),
      type: "phone",
      order: fields.length,
      label: "Phone Number",
      required: false,
      placeholder: "Enter your phone number",
    })
  }

  // Add feedback or comments field
  if (lowercasePrompt.includes("feedback") || lowercasePrompt.includes("comment")) {
    fields.push({
      id: generateId(),
      type: "paragraph",
      order: fields.length,
      label: "Feedback",
      required: true,
      placeholder: "Please provide your feedback",
    })
  }

  // Add rating field
  if (lowercasePrompt.includes("rating") || lowercasePrompt.includes("score")) {
    fields.push({
      id: generateId(),
      type: "multiple_choice",
      order: fields.length,
      label: "Rating",
      required: true,
      config: {
        options: [
          { label: "Excellent", value: "excellent" },
          { label: "Good", value: "good" },
          { label: "Average", value: "average" },
          { label: "Poor", value: "poor" },
          { label: "Very Poor", value: "very_poor" },
        ],
      },
    })
  }

  // Add date field
  if (lowercasePrompt.includes("date") || lowercasePrompt.includes("when")) {
    fields.push({
      id: generateId(),
      type: "date_time",
      order: fields.length,
      label: "Date",
      required: false,
      config: {
        enableDate: true,
        enableTime: false,
      },
    })
  }

  // Add submit button
  fields.push({
    id: generateId(),
    type: "submit",
    order: fields.length,
    label: "Submit Button",
    config: {
      text: "Submit",
      style: "primary",
    },
  })

  return fields
}
