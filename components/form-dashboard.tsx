"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Plus,
  Search,
  MoreHorizontal,
  FileText,
  Calendar,
  Grid3x3,
  ListIcon,
  Layers,
  LogOut,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ModeToggle } from "@/components/mode-toggle"
import { api, ApiError, clearAuthToken, toFormData, type ApiForm } from "@/lib/api"
import { buildFormFromTemplate, FORM_TEMPLATES, type FormTemplate } from "@/lib/form-templates"
import { loginPath, useRequireAuth } from "@/hooks/use-require-auth"
import { copyToClipboard } from "@/lib/utils"

// Display-only components (headings, dividers, ...) don't count as questions
const NON_INPUT_TYPES = new Set([
  "description", "image", "link", "form_heading", "section_heading",
  "sub_heading", "divider", "spacer", "submit", "page_break",
])

const countQuestions = (form: ApiForm) =>
  (form.data.fields ?? []).filter((field) => !NON_INPUT_TYPES.has(field.type)).length

const formatDate = (dateString: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(dateString))

export function FormDashboard() {
  const router = useRouter()
  const isAuthed = useRequireAuth()
  const [forms, setForms] = useState<ApiForm[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [email, setEmail] = useState<string | null>(null)
  const [creatingTemplate, setCreatingTemplate] = useState<string | null>(null)

  // Any 401 means the session expired: go back to sign-in, then return here
  const handleError = useCallback(
    (err: unknown, fallback: string) => {
      if (err instanceof ApiError && err.status === 401) {
        router.replace(loginPath("/dashboard"))
        return
      }
      toast.error(err instanceof Error ? err.message : fallback)
    },
    [router],
  )

  const loadForms = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      setForms(await api.listForms())
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        router.replace(loginPath("/dashboard"))
        return
      }
      setLoadError(err instanceof Error ? err.message : "Failed to load forms")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    if (!isAuthed) return
    setEmail(localStorage.getItem("email"))
    loadForms()
  }, [isAuthed, loadForms])

  const filteredForms = forms.filter((form) => form.data.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleCreateForm = () => router.push("/builder")

  const handleOpenForm = (formId: string) => router.push(`/builder/${formId}`)

  const handleViewResponses = (formId: string) => router.push(`/dashboard/forms/${formId}/responses`)

  const handleCopyLink = async (formId: string) => {
    const link = `${window.location.origin}/form/${formId}`
    if (await copyToClipboard(link)) {
      toast.success("Share link copied to clipboard")
    } else {
      toast.error(`Could not copy automatically. Share this link: ${link}`)
    }
  }

  const handleDuplicate = async (form: ApiForm) => {
    try {
      const copy = await api.duplicateForm(toFormData(form))
      setForms((prev) => [{ ...copy, response_count: 0 }, ...prev])
      toast.success(`Created "${copy.data.title}"`)
    } catch (err) {
      handleError(err, "Failed to duplicate form")
    }
  }

  const handleDelete = async (form: ApiForm) => {
    if (!confirm(`Delete "${form.data.title}" and all of its responses? This cannot be undone.`)) return
    try {
      await api.deleteForm(form.id)
      setForms((prev) => prev.filter((item) => item.id !== form.id))
      toast.success("Form deleted")
    } catch (err) {
      handleError(err, "Failed to delete form")
    }
  }

  const handleUseTemplate = async (template: FormTemplate) => {
    setCreatingTemplate(template.key)
    try {
      const form = await api.createForm(buildFormFromTemplate(template))
      router.push(`/builder/${form.id}`)
    } catch (err) {
      handleError(err, "Failed to create form from template")
      setCreatingTemplate(null)
    }
  }

  const handleSignOut = () => {
    clearAuthToken()
    router.push("/auth")
  }

  const formMenu = (form: ApiForm) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="-mt-1" onClick={(e) => e.stopPropagation()}>
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onClick={() => handleOpenForm(form.id)}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleViewResponses(form.id)}>View responses</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleCopyLink(form.id)}>Copy share link</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDuplicate(form)}>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleDelete(form)} className="text-destructive focus:text-destructive">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const responsesLabel = (form: ApiForm) => {
    const count = form.response_count ?? 0
    return `${count} ${count === 1 ? "response" : "responses"}`
  }

  const renderForms = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading your forms...
        </div>
      )
    }

    if (loadError) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <p className="text-muted-foreground">{loadError}</p>
          <Button variant="outline" onClick={loadForms}>
            Try again
          </Button>
        </div>
      )
    }

    if (filteredForms.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No forms found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "Try a different search term" : "Create your first form or start from a template"}
          </p>
          <Button onClick={handleCreateForm}>
            <Plus className="h-4 w-4 mr-2" />
            Create Form
          </Button>
        </div>
      )
    }

    if (viewMode === "grid") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForms.map((form) => (
            <Card key={form.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg truncate" title={form.data.title}>
                    {form.data.title}
                  </CardTitle>
                  {formMenu(form)}
                </div>
              </CardHeader>
              <CardContent
                className="h-32 flex items-center justify-center bg-secondary/30 cursor-pointer"
                onClick={() => handleOpenForm(form.id)}
              >
                <FileText className="h-12 w-12 text-muted-foreground/50" />
              </CardContent>
              <CardFooter className="flex items-center justify-between pt-4">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(form.updated_at ?? form.created_at)}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{countQuestions(form)} fields</Badge>
                  <button
                    className="text-xs text-muted-foreground hover:text-primary hover:underline"
                    onClick={() => handleViewResponses(form.id)}
                  >
                    {responsesLabel(form)}
                  </button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )
    }

    return (
      <div className="space-y-2">
        {filteredForms.map((form) => (
          <div
            key={form.id}
            className="flex items-center justify-between p-4 rounded-md border hover:bg-secondary/20 cursor-pointer"
            onClick={() => handleOpenForm(form.id)}
          >
            <div className="flex items-center gap-4 min-w-0">
              <FileText className="h-6 w-6 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <h3 className="font-medium truncate">{form.data.title}</h3>
                <div className="text-xs text-muted-foreground">
                  Last modified: {formatDate(form.updated_at ?? form.created_at)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline">{countQuestions(form)} fields</Badge>
              <span className="text-sm text-muted-foreground">{responsesLabel(form)}</span>
              {formMenu(form)}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!isAuthed) return null

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary rounded-md p-1">
              <Layers className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">FormFlow</span>
          </Link>
          <div className="flex items-center gap-2">
            {email && <span className="hidden sm:inline text-sm text-muted-foreground">{email}</span>}
            <ModeToggle />
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Forms</h1>
            <p className="text-muted-foreground">Create, manage, and share your forms</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search forms"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-r-none ${viewMode === "grid" ? "bg-secondary" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="h-4 w-4" />
                <span className="sr-only">Grid view</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-l-none ${viewMode === "list" ? "bg-secondary" : ""}`}
                onClick={() => setViewMode("list")}
              >
                <ListIcon className="h-4 w-4" />
                <span className="sr-only">List view</span>
              </Button>
            </div>

            <Button onClick={handleCreateForm}>
              <Plus className="h-4 w-4 mr-2" />
              New Form
            </Button>
          </div>
        </div>

        <Tabs defaultValue="recent">
          <TabsList className="mb-6">
            <TabsTrigger value="recent">My Forms</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="recent">{renderForms()}</TabsContent>

          <TabsContent value="templates">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FORM_TEMPLATES.map((template) => (
                <Card key={template.key} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg truncate">{template.title}</CardTitle>
                      <Badge variant="outline">{template.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="h-32 flex items-center justify-center bg-secondary/30 text-center px-6">
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between pt-4">
                    <div className="text-xs text-muted-foreground">{template.fields.length} fields</div>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={creatingTemplate !== null}
                      onClick={() => handleUseTemplate(template)}
                    >
                      {creatingTemplate === template.key && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Use Template
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
