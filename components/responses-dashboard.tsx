"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import {
    ArrowLeft,
    Download,
    Loader2,
    Search,
    AlertCircle,
    FileSpreadsheet,
    FileSpreadsheetIcon as FileCsv,
    FileJson,
    Printer,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import type { FormData } from "@/lib/types"

interface ResponsesDashboardProps {
    formId: string
}

// Define response type
interface FormResponse {
    id: string
    formId: string
    submittedAt: string
    data: Record<string, any>
}

// Define chart colors
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

export function ResponsesDashboard({ formId }: ResponsesDashboardProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState<FormData | null>(null)
    const [responses, setResponses] = useState<FormResponse[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all")
    const [activeTab, setActiveTab] = useState<"overview" | "responses" | "analytics">("overview")

    // Fetch form data and responses
    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            setError(null)

            try {
                // In a real app, these would be actual API calls
                // const formResponse = await fetch(`/api/forms/${formId}`);
                // const responseData = await fetch(`/api/forms/${formId}/responses`);
                // if (!formResponse.ok || !responseData.ok) throw new Error('Failed to load data');
                // const formData = await formResponse.json();
                // const responses = await responseData.json();

                // Mock data for demonstration
                await new Promise((resolve) => setTimeout(resolve, 1000))

                const mockFormData: FormData = {
                    id: formId,
                    title: "Customer Feedback Form",
                    description: "Collect feedback from customers about our services",
                    settings: {
                        requiresLogin: false,
                        confirmationMessage: "Thank you for your feedback!",
                        allowMultipleSubmissions: true,
                    },
                    fields: [
                        {
                            id: "name",
                            type: "text",
                            order: 0,
                            label: "Full Name",
                            required: true,
                        },
                        {
                            id: "email",
                            type: "email",
                            order: 1,
                            label: "Email Address",
                            required: true,
                        },
                        {
                            id: "rating",
                            type: "multiple_choice",
                            order: 2,
                            label: "How would you rate our service?",
                            required: true,
                            config: {
                                options: [
                                    { label: "Excellent", value: "excellent" },
                                    { label: "Good", value: "good" },
                                    { label: "Average", value: "average" },
                                    { label: "Poor", value: "poor" },
                                ],
                            },
                        },
                        {
                            id: "feedback",
                            type: "paragraph",
                            order: 3,
                            label: "Additional Feedback",
                            required: false,
                        },
                        {
                            id: "recommend",
                            type: "checkbox",
                            order: 4,
                            label: "Would you recommend us?",
                            config: {
                                text: "Yes, I would recommend your services to others",
                            },
                        },
                    ],
                }

                const mockResponses: FormResponse[] = Array.from({ length: 35 }, (_, i) => {
                    const date = new Date()
                    date.setDate(date.getDate() - Math.floor(Math.random() * 30))

                    const ratings = ["excellent", "good", "average", "poor"]
                    const rating = ratings[Math.floor(Math.random() * ratings.length)]

                    return {
                        id: `response-${i + 1}`,
                        formId,
                        submittedAt: date.toISOString(),
                        data: {
                            name: `User ${i + 1}`,
                            email: `user${i + 1}@example.com`,
                            rating,
                            feedback:
                                i % 5 === 0
                                    ? "I had a great experience overall!"
                                    : i % 5 === 1
                                        ? "The service was good but could be improved."
                                        : i % 5 === 2
                                            ? "Average experience, nothing special."
                                            : i % 5 === 3
                                                ? "I encountered some issues that need to be addressed."
                                                : "Very satisfied with the service provided.",
                            recommend: Math.random() > 0.3, // 70% recommend
                        },
                    }
                })

                setFormData(mockFormData)
                setResponses(mockResponses)
            } catch (err) {
                console.error("Error fetching data:", err)
                setError("Failed to load form data and responses. Please try again.")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [formId])

    // Filter responses based on search query and date filter
    const filteredResponses = useMemo(() => {
        if (!responses) return []

        let filtered = [...responses]

        // Apply date filter
        if (dateFilter !== "all") {
            const now = new Date()
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

            filtered = filtered.filter((response) => {
                const submittedDate = new Date(response.submittedAt)

                if (dateFilter === "today") {
                    return submittedDate >= today
                } else if (dateFilter === "week") {
                    const weekAgo = new Date(today)
                    weekAgo.setDate(weekAgo.getDate() - 7)
                    return submittedDate >= weekAgo
                } else if (dateFilter === "month") {
                    const monthAgo = new Date(today)
                    monthAgo.setMonth(monthAgo.getMonth() - 1)
                    return submittedDate >= monthAgo
                }

                return true
            })
        }

        // Apply search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter((response) => {
                // Search in all fields
                return Object.values(response.data).some((value) => value && value.toString().toLowerCase().includes(query))
            })
        }

        return filtered
    }, [responses, searchQuery, dateFilter])

    // Generate chart data for ratings
    const ratingChartData = useMemo(() => {
        if (!filteredResponses || !formData) return []

        const ratingField = formData.fields.find((field) => field.id === "rating")
        if (!ratingField || !ratingField.config?.options) return []

        const counts: Record<string, number> = {}

        // Initialize counts for all options
        ratingField.config.options.forEach((option) => {
            counts[option.value] = 0
        })

        // Count responses for each rating
        filteredResponses.forEach((response) => {
            const rating = response.data.rating
            if (rating) {
                counts[rating] = (counts[rating] || 0) + 1
            }
        })

        // Convert to chart data format
        return Object.entries(counts).map(([name, value]) => {
            const option = ratingField.config?.options?.find((opt) => opt.value === name)
            return {
                name: option?.label || name,
                value,
            }
        })
    }, [filteredResponses, formData])

    // Generate chart data for recommendations
    const recommendChartData = useMemo(() => {
        if (!filteredResponses) return []

        const recommendCount = filteredResponses.filter((r) => r.data.recommend).length
        const notRecommendCount = filteredResponses.length - recommendCount

        return [
            { name: "Would Recommend", value: recommendCount },
            { name: "Would Not Recommend", value: notRecommendCount },
        ]
    }, [filteredResponses])

    // Generate chart data for submissions over time
    const submissionTimeChartData = useMemo(() => {
        if (!filteredResponses) return []

        const dateGroups: Record<string, number> = {}

        filteredResponses.forEach((response) => {
            const date = new Date(response.submittedAt)
            const dateKey = format(date, "MMM d")
            dateGroups[dateKey] = (dateGroups[dateKey] || 0) + 1
        })

        // Get the last 10 days with submissions
        return Object.entries(dateGroups)
            .map(([date, count]) => ({ date, count }))
            .slice(-10)
    }, [filteredResponses])

    // Handle export functions
    const exportToCSV = () => {
        if (!formData || !filteredResponses.length) return

        // Get field headers
        const headers = formData.fields.map((field) => field.label)
        const fieldIds = formData.fields.map((field) => field.id)

        // Create CSV content
        let csvContent = headers.join(",") + "\n"

        filteredResponses.forEach((response) => {
            const row = fieldIds
                .map((id) => {
                    const value = response.data[id]
                    // Handle special cases like arrays, booleans, etc.
                    if (Array.isArray(value)) {
                        return `"${value.join(", ")}"`
                    } else if (typeof value === "boolean") {
                        return value ? "Yes" : "No"
                    } else if (value === null || value === undefined) {
                        return ""
                    } else {
                        // Escape quotes in strings
                        return `"${String(value).replace(/"/g, '""')}"`
                    }
                })
                .join(",")

            csvContent += row + "\n"
        })

        // Create and download the file
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `${formData.title.replace(/\s+/g, "_")}_responses.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const exportToJSON = () => {
        if (!formData || !filteredResponses.length) return

        const dataToExport = {
            form: {
                id: formData.id,
                title: formData.title,
                description: formData.description,
            },
            responses: filteredResponses,
        }

        const jsonString = JSON.stringify(dataToExport, null, 2)
        const blob = new Blob([jsonString], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `${formData.title.replace(/\s+/g, "_")}_responses.json`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const exportToExcel = () => {
        // In a real app, you would use a library like xlsx to generate Excel files
        alert("Excel export would be implemented with a library like xlsx")
    }

    const printResponses = () => {
        window.print()
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <main className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
                        <h2 className="text-2xl font-medium mb-2">Loading responses...</h2>
                        <p className="text-muted-foreground">Please wait while we fetch the data.</p>
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
                        <h2 className="text-2xl font-medium mb-2">Error Loading Data</h2>
                        <p className="text-muted-foreground mb-6">{error}</p>
                        <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
                    </div>
                </main>
            </div>
        )
    }

    if (!formData) {
        return null
    }

    return (
        <div className="min-h-screen flex flex-col">
            <header className="border-b bg-card py-4">
                <div className="container">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
                            <ArrowLeft className="h-5 w-5" />
                            <span className="sr-only">Back to Dashboard</span>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">{formData.title}</h1>
                            <p className="text-muted-foreground">{formData.description}</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 container py-8">
                <div className="flex flex-col gap-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Total Responses</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{filteredResponses.length}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {responses.length !== filteredResponses.length && `Filtered from ${responses.length} total`}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {filteredResponses.length > 0
                                        ? `${Math.round(
                                            (filteredResponses.filter((r) => Object.keys(r.data).length >= formData.fields.length * 0.8)
                                                .length /
                                                filteredResponses.length) *
                                            100,
                                        )}%`
                                        : "0%"}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Based on 80% field completion</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Average Rating</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {filteredResponses.length > 0
                                        ? (() => {
                                            const ratings = {
                                                excellent: 5,
                                                good: 4,
                                                average: 3,
                                                poor: 2,
                                                very_poor: 1,
                                            }
                                            const validRatings = filteredResponses
                                                .filter((r) => r.data.rating && ratings[r.data.rating as keyof typeof ratings])
                                                .map((r) => ratings[r.data.rating as keyof typeof ratings])

                                            if (validRatings.length === 0) return "N/A"

                                            const avg = validRatings.reduce((sum, val) => sum + val, 0) / validRatings.length
                                            return avg.toFixed(1)
                                        })()
                                        : "N/A"}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Out of 5.0</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Recommendation Rate</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {filteredResponses.length > 0
                                        ? `${Math.round((filteredResponses.filter((r) => r.data.recommend).length / filteredResponses.length) * 100)}%`
                                        : "0%"}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Would recommend to others</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters and Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search responses..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <Select
                                value={dateFilter}
                                onValueChange={(value: "all" | "today" | "week" | "month") => setDateFilter(value)}
                            >
                                <SelectTrigger className="w-full sm:w-40">
                                    <SelectValue placeholder="Filter by date" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All time</SelectItem>
                                    <SelectItem value="today">Today</SelectItem>
                                    <SelectItem value="week">Last 7 days</SelectItem>
                                    <SelectItem value="month">Last 30 days</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="gap-2">
                                    <Download className="h-4 w-4" />
                                    Export
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={exportToCSV}>
                                    <FileCsv className="h-4 w-4 mr-2" />
                                    Export to CSV
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={exportToExcel}>
                                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                                    Export to Excel
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={exportToJSON}>
                                    <FileJson className="h-4 w-4 mr-2" />
                                    Export to JSON
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={printResponses}>
                                    <Printer className="h-4 w-4 mr-2" />
                                    Print Responses
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Tabs */}
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="responses">Responses</TabsTrigger>
                            <TabsTrigger value="analytics">Analytics</TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Ratings Chart */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Rating Distribution</CardTitle>
                                        <CardDescription>How users rated your service</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-80">
                                        {ratingChartData.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={ratingChartData}>
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Bar dataKey="value" name="Responses" fill="#0088FE" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-muted-foreground">
                                                No rating data available
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Recommendation Chart */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Recommendation Rate</CardTitle>
                                        <CardDescription>Would users recommend your service?</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-80">
                                        {recommendChartData.some((item) => item.value > 0) ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={recommendChartData}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        outerRadius={80}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                    >
                                                        {recommendChartData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                    <Legend />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-muted-foreground">
                                                No recommendation data available
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Submissions Over Time */}
                                <Card className="lg:col-span-2">
                                    <CardHeader>
                                        <CardTitle>Submissions Over Time</CardTitle>
                                        <CardDescription>Number of responses received per day</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-80">
                                        {submissionTimeChartData.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={submissionTimeChartData}>
                                                    <XAxis dataKey="date" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Bar dataKey="count" name="Submissions" fill="#82ca9d" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-muted-foreground">
                                                No submission timeline data available
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Recent Responses */}
                                <Card className="lg:col-span-2">
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <div>
                                            <CardTitle>Recent Responses</CardTitle>
                                            <CardDescription>The latest 5 form submissions</CardDescription>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => setActiveTab("responses")}>
                                            View All
                                        </Button>
                                    </CardHeader>
                                    <CardContent>
                                        {filteredResponses.length > 0 ? (
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Submitted</TableHead>
                                                        <TableHead>Name</TableHead>
                                                        <TableHead>Rating</TableHead>
                                                        <TableHead>Recommend</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredResponses.slice(0, 5).map((response) => (
                                                        <TableRow key={response.id}>
                                                            <TableCell>{format(new Date(response.submittedAt), "MMM d, yyyy")}</TableCell>
                                                            <TableCell>{response.data.name}</TableCell>
                                                            <TableCell>
                                                                <Badge
                                                                    variant={
                                                                        response.data.rating === "excellent"
                                                                            ? "default"
                                                                            : response.data.rating === "good"
                                                                                ? "secondary"
                                                                                : response.data.rating === "average"
                                                                                    ? "outline"
                                                                                    : "destructive"
                                                                    }
                                                                >
                                                                    {response.data.rating}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>{response.data.recommend ? "Yes" : "No"}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        ) : (
                                            <div className="text-center py-6 text-muted-foreground">No responses found</div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Responses Tab */}
                        <TabsContent value="responses">
                            <Card>
                                <CardHeader>
                                    <CardTitle>All Responses</CardTitle>
                                    <CardDescription>
                                        {filteredResponses.length} {filteredResponses.length === 1 ? "response" : "responses"} found
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {filteredResponses.length > 0 ? (
                                        <div className="rounded-md border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Submitted</TableHead>
                                                        {formData.fields.map((field) => (
                                                            <TableHead key={field.id}>{field.label}</TableHead>
                                                        ))}
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredResponses.map((response) => (
                                                        <TableRow key={response.id}>
                                                            <TableCell>{format(new Date(response.submittedAt), "MMM d, yyyy h:mm a")}</TableCell>
                                                            {formData.fields.map((field) => (
                                                                <TableCell key={field.id}>
                                                                    {field.type === "multiple_choice" && field.id === "rating" ? (
                                                                        <Badge
                                                                            variant={
                                                                                response.data[field.id] === "excellent"
                                                                                    ? "default"
                                                                                    : response.data[field.id] === "good"
                                                                                        ? "secondary"
                                                                                        : response.data[field.id] === "average"
                                                                                            ? "outline"
                                                                                            : "destructive"
                                                                            }
                                                                        >
                                                                            {response.data[field.id]}
                                                                        </Badge>
                                                                    ) : field.type === "checkbox" ? (
                                                                        response.data[field.id] ? (
                                                                            "Yes"
                                                                        ) : (
                                                                            "No"
                                                                        )
                                                                    ) : field.type === "paragraph" ? (
                                                                        <div className="max-w-xs truncate">{response.data[field.id]}</div>
                                                                    ) : (
                                                                        response.data[field.id]
                                                                    )}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 text-muted-foreground">
                                            No responses found matching your filters
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Analytics Tab */}
                        <TabsContent value="analytics">
                            <div className="grid grid-cols-1 gap-6">
                                {formData.fields.map((field) => {
                                    if (field.type === "multiple_choice" || field.type === "checkbox") {
                                        // Create analytics for choice-based fields
                                        const fieldData = filteredResponses.map((r) => r.data[field.id])

                                        // Count occurrences of each value
                                        const valueCounts: Record<string, number> = {}

                                        if (field.type === "multiple_choice" && field.config?.options) {
                                            // Initialize all options with zero
                                            field.config.options.forEach((opt) => {
                                                valueCounts[opt.value] = 0
                                            })
                                        }

                                        // Count actual values
                                        fieldData.forEach((value) => {
                                            if (value === undefined || value === null) return

                                            if (typeof value === "boolean") {
                                                const key = value ? "Yes" : "No"
                                                valueCounts[key] = (valueCounts[key] || 0) + 1
                                            } else {
                                                valueCounts[value] = (valueCounts[value] || 0) + 1
                                            }
                                        })

                                        // Convert to chart data
                                        const chartData = Object.entries(valueCounts).map(([name, value]) => {
                                            // For multiple choice, get the label from options
                                            if (field.type === "multiple_choice" && field.config?.options) {
                                                const option = field.config.options.find((opt) => opt.value === name)
                                                if (option) {
                                                    return { name: option.label, value }
                                                }
                                            }
                                            return { name, value }
                                        })

                                        return (
                                            <Card key={field.id} className="mb-6">
                                                <CardHeader>
                                                    <CardTitle>{field.label}</CardTitle>
                                                    <CardDescription>Response distribution</CardDescription>
                                                </CardHeader>
                                                <CardContent className="h-80">
                                                    {chartData.length > 0 ? (
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <BarChart data={chartData}>
                                                                <XAxis dataKey="name" />
                                                                <YAxis />
                                                                <Tooltip />
                                                                <Legend />
                                                                <Bar dataKey="value" name="Responses" fill="#8884d8" />
                                                            </BarChart>
                                                        </ResponsiveContainer>
                                                    ) : (
                                                        <div className="h-full flex items-center justify-center text-muted-foreground">
                                                            No data available for this field
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        )
                                    }
                                    return null
                                })}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    )
}
