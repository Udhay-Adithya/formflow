"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { renderFormComponent } from "@/lib/render-component"
import type { FormData } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ShareableFormProps {
    formId: string
}

export function ShareableForm({ formId }: ShareableFormProps) {
    const router = useRouter()
    const [formData, setFormData] = useState<FormData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [formState, setFormState] = useState<Record<string, any>>({})
    const [currentPage, setCurrentPage] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

    // Fetch form data
    useEffect(() => {
        async function fetchFormData() {
            setLoading(true)
            setError(null)

            try {
                console.log('Form ID:', formId)
                const token = localStorage.getItem("token");
                if (!token) throw new Error("No authentication token found");

                const response = await fetch(`http://127.0.0.1:8000/api/v1/forms/${formId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) throw new Error("Failed to load form data");
                console.log(response.body)
                const result = await response.json();
                const apiForm = result;

                const formattedData: FormData = {
                    id: apiForm.id,
                    title: apiForm.data.title,
                    description: apiForm.data.description,
                    settings: apiForm.data.settings,
                    fields: apiForm.data.fields.map((field: any) => ({
                        id: field.id,
                        type: field.type,
                        order: field.order,
                        label: field.label,
                        required: field.required,
                        placeholder: field.placeholder,
                        config: field.config || {},
                        ...field,
                    })),
                };

                setFormData(formattedData);
            } catch (err) {
                console.error("Error fetching form:", err);
                setError("Failed to load the form. Please try again later.");
            } finally {
                setLoading(false);
            }
        }

        fetchFormData();
    }, [formId]);



    // Group fields by page breaks
    const pages = formData
        ? (() => {
            const result: Array<Array<(typeof formData.fields)[0]>> = []
            let currentPageFields: Array<(typeof formData.fields)[0]> = []

            formData.fields.forEach((field) => {
                if (field.type === "page_break" && currentPageFields.length > 0) {
                    result.push([...currentPageFields])
                    currentPageFields = []
                } else {
                    currentPageFields.push(field)
                }
            })

            if (currentPageFields.length > 0) {
                result.push(currentPageFields)
            }

            return result.length > 0 ? result : [formData.fields]
        })()
        : []

    const handleValueChange = (fieldId: string, value: any) => {
        setFormState((prev) => ({
            ...prev,
            [fieldId]: value,
        }))

        // Clear validation error when field is filled
        if (validationErrors[fieldId]) {
            setValidationErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[fieldId]
                return newErrors
            })
        }
    }

    const validateCurrentPage = () => {
        if (!formData || !pages[currentPage]) return true

        const errors: Record<string, string> = {}
        const currentFields = pages[currentPage]

        currentFields.forEach((field) => {
            if (field.required && !formState[field.id]) {
                errors[field.id] = "This field is required"
            }

            // Email validation
            if (field.type === "email" && formState[field.id]) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if (!emailRegex.test(formState[field.id])) {
                    errors[field.id] = "Please enter a valid email address"
                }
            }

            // Number validation
            if (field.type === "number" && formState[field.id] !== undefined) {
                if (field.validation?.min !== undefined && formState[field.id] < field.validation.min) {
                    errors[field.id] = `Value must be at least ${field.validation.min}`
                }
                if (field.validation?.max !== undefined && formState[field.id] > field.validation.max) {
                    errors[field.id] = `Value must be at most ${field.validation.max}`
                }
            }
        })

        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    const goToNextPage = () => {
        if (validateCurrentPage() && currentPage < pages.length - 1) {
            setCurrentPage(currentPage + 1)
            window.scrollTo(0, 0)
        }
    }

    const goToPreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1)
            window.scrollTo(0, 0)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateCurrentPage()) return

        setIsSubmitting(true)

        try {
            // In a real app, this would be a fetch call to your API
            // For now, we'll simulate a delay
            await new Promise((resolve) => setTimeout(resolve, 1500))

            // This is where you would submit the form data to your backend
            // const response = await fetch(`/api/forms/${formId}/submissions`, {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(formState),
            // });
            // if (!response.ok) throw new Error('Failed to submit form');

            console.log("Form submitted with data:", formState)
            setSubmitted(true)
        } catch (err) {
            console.error("Error submitting form:", err)
            setError("Failed to submit the form. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleRestart = () => {
        setFormState({})
        setCurrentPage(0)
        setSubmitted(false)
        setValidationErrors({})
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <main className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
                        <h2 className="text-2xl font-medium mb-2">Loading form...</h2>
                        <p className="text-muted-foreground">Please wait while we load your form.</p>
                    </div>
                </main>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col">
                <main className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center max-w-md">
                        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/20 text-destructive flex items-center justify-center mb-4">
                            <AlertCircle className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-medium mb-2">Form Not Found</h2>
                        <p className="text-muted-foreground mb-6">{error}</p>
                        <Button onClick={() => router.push("/")}>Return to Home</Button>
                    </div>
                </main>
            </div>
        )
    }

    if (!formData) {
        return null
    }

    if (submitted) {
        return (
            <div className="min-h-screen flex flex-col">
                <main className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center max-w-md">
                        <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4">
                            <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-medium mb-2">Form Submitted</h2>
                        <p className="text-muted-foreground mb-6">{formData.settings.confirmationMessage}</p>
                        {formData.settings.allowMultipleSubmissions && (
                            <Button onClick={handleRestart}>Submit Another Response</Button>
                        )}
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
            <header className="border-b bg-card py-4">
                <div className="container">
                    <h1 className="text-2xl font-bold">{formData.title}</h1>
                </div>
            </header>

            <main className="flex-1 container py-8">
                <Card className="max-w-3xl mx-auto p-6">
                    {pages.length > 1 && (
                        <div className="mb-6">
                            <div className="flex justify-between text-sm mb-2">
                                <span>
                                    Page {currentPage + 1} of {pages.length}
                                </span>
                                <span>{Math.round(((currentPage + 1) / pages.length) * 100)}% completed</span>
                            </div>
                            <Progress value={((currentPage + 1) / pages.length) * 100} className="h-2" />
                        </div>
                    )}

                    {formData.description && <p className="text-muted-foreground mb-6">{formData.description}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            {pages[currentPage].map((field) => {
                                if (field.type === "submit") return null // We'll add our own submit button

                                return (
                                    <div key={field.id} className="relative">
                                        {renderFormComponent(field, {
                                            isEditing: false,
                                            onValueChange: (value) => handleValueChange(field.id, value),
                                            value: formState[field.id],
                                        })}
                                        {validationErrors[field.id] && (
                                            <p className="text-destructive text-sm mt-1">{validationErrors[field.id]}</p>
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        <div className="flex justify-between mt-8">
                            {currentPage > 0 ? (
                                <Button type="button" variant="outline" onClick={goToPreviousPage}>
                                    Previous
                                </Button>
                            ) : (
                                <div></div>
                            )}

                            {currentPage < pages.length - 1 ? (
                                <Button type="button" onClick={goToNextPage}>
                                    Next
                                </Button>
                            ) : (
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit"
                                    )}
                                </Button>
                            )}
                        </div>
                    </form>
                </Card>
            </main>

            <footer className="border-t py-6">
                <div className="container text-center text-sm text-muted-foreground">
                    <p>© 2025 FormFlow. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
