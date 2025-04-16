"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { renderFormComponent } from "@/lib/render-component"
import type { FormComponent, FormData } from "@/lib/types"

interface FormPreviewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  formData: FormData
}

export function FormPreview({ open, onOpenChange, formData }: FormPreviewProps) {
  const [activeTab, setActiveTab] = useState<"desktop" | "mobile">("desktop")
  const [formState, setFormState] = useState<Record<string, any>>({})
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted with data:", formState)
    setSubmitted(true)
  }

  const handleReset = () => {
    setFormState({})
    setSubmitted(false)
  }

  // Group fields by page breaks
  const pages: FormComponent[][] = []
  let currentPage: FormComponent[] = []

  if (formData.fields === undefined) {
    formData.fields = []
    currentPage = []
  }
  else {
    formData.fields.forEach((field) => {
      if (field.type === "page_break" && currentPage.length > 0) {
        pages.push([...currentPage])
        currentPage = []
      } else {
        currentPage.push(field)
      }
    })
  }


  if (currentPage.length > 0) {
    pages.push(currentPage)
  }

  // If no page breaks, use all fields as a single page
  const formPages = pages.length > 0 ? pages : [formData.fields]
  const [currentPageIndex, setCurrentPageIndex] = useState(0)

  const goToNextPage = () => {
    if (currentPageIndex < formPages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={activeTab === "mobile" ? "max-w-[400px]" : "max-w-4xl"}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Form Preview</span>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "desktop" | "mobile")}>
              <TabsList>
                <TabsTrigger value="desktop">Desktop</TabsTrigger>
                <TabsTrigger value="mobile">Mobile</TabsTrigger>
              </TabsList>
            </Tabs>
          </DialogTitle>
          <DialogDescription>
            This is how your form will appear to users. Try interacting with it to test the experience.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-background rounded-lg border p-6">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-check"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3 className="text-xl font-medium">{formData.settings.confirmationMessage}</h3>
              <p className="text-muted-foreground">Your response has been recorded.</p>
              <Button onClick={handleReset} className="mt-4">
                Submit Another Response
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                {formData.title && <h1 className="text-2xl font-bold">{formData.title}</h1>}
                {formData.description && <p className="text-muted-foreground">{formData.description}</p>}

                <div className="space-y-6">
                  {formPages[currentPageIndex].map((component) => {
                    if (component.type === "submit") {
                      return null // We'll add our own submit button
                    }

                    return (
                      <div key={component.id}>
                        {renderFormComponent(component, {
                          isEditing: false,
                          onValueChange: (value) => {
                            setFormState((prev) => ({
                              ...prev,
                              [component.id]: value,
                            }))
                          },
                          value: formState[component.id],
                        })}
                      </div>
                    )
                  })}
                </div>

                <div className="flex justify-between pt-4">
                  {currentPageIndex > 0 && (
                    <Button type="button" variant="outline" onClick={goToPreviousPage}>
                      Previous
                    </Button>
                  )}

                  {currentPageIndex < formPages.length - 1 ? (
                    <Button type="button" className="ml-auto" onClick={goToNextPage}>
                      Next
                    </Button>
                  ) : (
                    <Button type="submit" className="ml-auto">
                      Submit
                    </Button>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
