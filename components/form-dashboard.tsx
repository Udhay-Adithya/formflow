"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, MoreHorizontal, FileText, Calendar, Grid3x3, ListIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { generateId } from "@/lib/utils"

// Mock data for forms
const mockForms = [
  {
    id: generateId(),
    title: "Customer Feedback Survey",
    lastModified: "2023-04-10T14:30:00Z",
    responses: 24,
    status: "published",
  },
  {
    id: generateId(),
    title: "Event Registration Form",
    lastModified: "2023-04-08T09:15:00Z",
    responses: 56,
    status: "published",
  },
  {
    id: generateId(),
    title: "Product Order Form",
    lastModified: "2023-04-05T16:45:00Z",
    responses: 12,
    status: "published",
  },
  {
    id: generateId(),
    title: "Job Application Form",
    lastModified: "2023-04-03T11:20:00Z",
    responses: 8,
    status: "draft",
  },
  {
    id: generateId(),
    title: "Newsletter Signup",
    lastModified: "2023-04-01T13:10:00Z",
    responses: 103,
    status: "published",
  },
  {
    id: generateId(),
    title: "Website Feedback",
    lastModified: "2023-03-28T10:05:00Z",
    responses: 17,
    status: "draft",
  },
]

// Mock data for templates
const mockTemplates = [
  {
    id: generateId(),
    title: "Contact Form",
    category: "Business",
    fields: 5,
  },
  {
    id: generateId(),
    title: "Customer Survey",
    category: "Feedback",
    fields: 10,
  },
  {
    id: generateId(),
    title: "Event Registration",
    category: "Events",
    fields: 8,
  },
  {
    id: generateId(),
    title: "Job Application",
    category: "HR",
    fields: 12,
  },
]

export function FormDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [forms, setForms] = useState(mockForms)
  const router = useRouter()

  const filteredForms = mockForms.filter((form) => form.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const handleCreateForm = () => {
    router.push("/builder")
  }

  const handleOpenForm = (formId: string) => {
    router.push("/builder")
  }

  const handleRemoveForm = (formId: string) => {
    const updatedForms = forms.filter((form) => form.id !== formId)
    setForms(updatedForms)
  }

  return (
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
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="shared">Shared with me</TabsTrigger>
        </TabsList>

        <TabsContent value="recent">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredForms.map((form) => (
                <Card key={form.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg truncate">{form.title}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="-mt-1">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenForm(form.id)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem>Share</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRemoveForm(form.id)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
                      {formatDate(form.lastModified)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={form.status === "draft" ? "outline" : "default"}>
                        {form.status === "draft" ? "Draft" : "Published"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{form.responses} responses</span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredForms.map((form) => (
                <div
                  key={form.id}
                  className="flex items-center justify-between p-4 rounded-md border hover:bg-secondary/20 cursor-pointer"
                  onClick={() => handleOpenForm(form.id)}
                >
                  <div className="flex items-center gap-4">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">{form.title}</h3>
                      <div className="text-xs text-muted-foreground">
                        Last modified: {formatDate(form.lastModified)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={form.status === "draft" ? "outline" : "default"}>
                      {form.status === "draft" ? "Draft" : "Published"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{form.responses} responses</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenForm(form.id)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRemoveForm(form.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredForms.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No forms found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "Try a different search term" : "Create your first form to get started"}
              </p>
              <Button onClick={handleCreateForm}>
                <Plus className="h-4 w-4 mr-2" />
                Create Form
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTemplates.map((template) => (
              <Card key={template.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg truncate">{template.title}</CardTitle>
                    <Badge variant="outline">{template.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent
                  className="h-32 flex items-center justify-center bg-secondary/30 cursor-pointer"
                  onClick={() => handleCreateForm()}
                >
                  <FileText className="h-12 w-12 text-muted-foreground/50" />
                </CardContent>
                <CardFooter className="flex items-center justify-between pt-4">
                  <div className="text-xs text-muted-foreground">{template.fields} fields</div>
                  <Button size="sm" variant="outline" onClick={() => handleCreateForm()}>
                    Use Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="shared">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No shared forms</h3>
            <p className="text-muted-foreground">Forms shared with you will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
