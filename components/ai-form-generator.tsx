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
      let response;
      
      if (activeTab === "text") {
        // Text-based form generation
        response = await fetch('/api/generate-form', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        });
      } else {
        // Image-based form generation
        if (!imageFile) {
          throw new Error('No image selected');
        }
        
        const formData = new FormData();
        formData.append('image', imageFile);
        if (prompt) {
          formData.append('prompt', prompt);
        }
        
        response = await fetch('/api/generate-form-from-image', {
          method: 'POST',
          body: formData,
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate form');
      }

      const data = await response.json();
      onFormGenerated(data.formData);
      setOpen(false);
      resetForm();
    } catch (err: any) {
      setError(err.message || "Failed to generate form. Please try again.");
      console.error(err);
    } finally {
      setIsGenerating(false);
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