"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import {
    ArrowLeft,
    Download,
    Loader2,
    Search,
    AlertCircle,
    FileSpreadsheet,
    FileJson,
    Printer,
    RefreshCw,
    Link2,
    Inbox,
} from "lucide-react"
import { formatDistanceToNow, format, subDays } from "date-fns"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FormComponent, FormData } from "@/lib/types"
import { api, ApiError, toFormData, type ApiResponse } from "@/lib/api"
import { loginPath, useRequireAuth } from "@/hooks/use-require-auth"
import { copyToClipboard } from "@/lib/utils"
import {
    CHOICE_TYPES,
    completionRate,
    dailyCounts,
    downloadFile,
    formatAnswer,
    getInputFields,
    isAnswered,
    numberStats,
    optionCounts,
    responsesToCsv,
} from "@/lib/response-analytics"

interface ResponsesDashboardProps {
    formId: string
}

type DateFilter = "all" | "today" | "week" | "month"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]
// Poll for new submissions so the dashboard stays live without websockets
const REFRESH_INTERVAL_MS = 15000

export function ResponsesDashboard({ formId }: ResponsesDashboardProps) {
    const router = useRouter()
    const isAuthed = useRequireAuth()
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState<FormData | null>(null)
    const [responses, setResponses] = useState<ApiResponse[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [dateFilter, setDateFilter] = useState<DateFilter>("all")
    const [activeTab, setActiveTab] = useState<"overview" | "responses" | "analytics">("overview")

    const fetchData = useCallback(
        async (isBackground = false) => {
            if (isBackground) setRefreshing(true)
            try {
                const [form, formResponses] = await Promise.all([api.getForm(formId), api.listResponses(formId)])
                setFormData(toFormData(form))
                setResponses(formResponses)
                setError(null)
            } catch (err) {
                if (err instanceof ApiError && err.status === 401) {
                    router.replace(loginPath(`/dashboard/forms/${formId}/responses`))
                    return
                }
                // Keep showing existing data if a background refresh fails
                if (isBackground) return
                if (err instanceof ApiError && err.status === 403) {
                    setError("You don't have access to this form's responses.")
                } else if (err instanceof ApiError && err.status === 404) {
                    setError("This form doesn't exist or was deleted.")
                } else {
                    setError(err instanceof Error ? err.message : "Failed to load responses")
                }
            } finally {
                setLoading(false)
                setRefreshing(false)
            }
        },
        [formId, router],
    )

    useEffect(() => {
        if (!isAuthed) return
        fetchData()
        const interval = setInterval(() => {
            if (document.visibilityState === "visible") fetchData(true)
        }, REFRESH_INTERVAL_MS)
        return () => clearInterval(interval)
    }, [isAuthed, fetchData])

    const inputFields = useMemo(() => (formData ? getInputFields(formData.fields) : []), [formData])

    // Newest first, then apply the date filter and free-text search
    const filteredResponses = useMemo(() => {
        const cutoff = {
            all: null,
            today: new Date(new Date().setHours(0, 0, 0, 0)),
            week: subDays(new Date(), 7),
            month: subDays(new Date(), 30),
        }[dateFilter]
        const query = searchQuery.trim().toLowerCase()

        return [...responses]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .filter((response) => !cutoff || new Date(response.created_at) >= cutoff)
            .filter(
                (response) =>
                    !query ||
                    inputFields.some((field) =>
                        formatAnswer(field, response.data[field.id]).toLowerCase().includes(query),
                    ),
            )
    }, [responses, dateFilter, searchQuery, inputFields])

    const submissionsOverTime = useMemo(() => dailyCounts(filteredResponses), [filteredResponses])
    const lastWeekCount = useMemo(
        () => responses.filter((response) => new Date(response.created_at) >= subDays(new Date(), 7)).length,
        [responses],
    )
    const latestResponse = useMemo(
        () =>
            responses.reduce<ApiResponse | null>(
                (latest, response) => (!latest || response.created_at > latest.created_at ? response : latest),
                null,
            ),
        [responses],
    )

    const fileBaseName = (formData?.title || "form").replace(/[^\w-]+/g, "_")

    const exportToCSV = () => {
        downloadFile(responsesToCsv(filteredResponses, inputFields), `${fileBaseName}_responses.csv`, "text/csv;charset=utf-8")
    }

    const exportToJSON = () => {
        const payload = {
            form: { id: formData?.id, title: formData?.title, description: formData?.description },
            exported_at: new Date().toISOString(),
            responses: filteredResponses.map((response) => ({
                id: response.id,
                submitted_at: response.created_at,
                answers: Object.fromEntries(
                    inputFields.map((field) => [field.label || field.id, formatAnswer(field, response.data[field.id])]),
                ),
            })),
        }
        downloadFile(JSON.stringify(payload, null, 2), `${fileBaseName}_responses.json`, "application/json")
    }

    const copyShareLink = async () => {
        const link = `${window.location.origin}/form/${formId}`
        if (await copyToClipboard(link)) {
            toast.success("Share link copied to clipboard")
        } else {
            toast.error(`Could not copy automatically. Share this link: ${link}`)
        }
    }

    if (!isAuthed || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
                    <h2 className="text-2xl font-medium mb-2">Loading responses...</h2>
                    <p className="text-muted-foreground">Please wait while we fetch the data.</p>
                </div>
            </div>
        )
    }

    if (error || !formData) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="mx-auto w-16 h-16 rounded-full bg-destructive/20 text-destructive flex items-center justify-center mb-4">
                        <AlertCircle className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-medium mb-2">Error Loading Data</h2>
                    <p className="text-muted-foreground mb-6">{error}</p>
                    <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
                </div>
            </div>
        )
    }

    const renderAnswerCell = (field: FormComponent, response: ApiResponse) => {
        const text = formatAnswer(field, response.data[field.id])
        return text ? <span className="line-clamp-2">{text}</span> : <span className="text-muted-foreground">—</span>
    }

    const renderResponsesTable = (rows: ApiResponse[], fields: FormComponent[]) => (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="whitespace-nowrap">Submitted</TableHead>
                        {fields.map((field) => (
                            <TableHead key={field.id} className="min-w-[140px]">
                                {field.label || field.type}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((response) => (
                        <TableRow key={response.id}>
                            <TableCell className="whitespace-nowrap">
                                {format(new Date(response.created_at), "MMM d, yyyy h:mm a")}
                            </TableCell>
                            {fields.map((field) => (
                                <TableCell key={field.id} className="max-w-[240px]">
                                    {renderAnswerCell(field, response)}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )

    const renderFieldAnalytics = (field: FormComponent) => {
        const answeredCount = filteredResponses.filter((response) => isAnswered(response.data[field.id])).length

        if (CHOICE_TYPES.has(field.type)) {
            const data = optionCounts(field, filteredResponses)
            const usePie = field.type === "checkbox" || (field.type !== "checkboxes" && data.length <= 4)
            return (
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        {usePie ? (
                            <PieChart>
                                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                    {data.map((entry, index) => (
                                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        ) : (
                            <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
                                <XAxis type="number" allowDecimals={false} />
                                <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Bar dataKey="value" name="Responses" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </div>
            )
        }

        if (field.type === "number") {
            const stats = numberStats(field, filteredResponses)
            if (!stats) return <p className="text-sm text-muted-foreground">No answers yet.</p>
            return (
                <div className="grid grid-cols-4 gap-4 text-center">
                    {[
                        ["Average", stats.average.toFixed(1)],
                        ["Min", stats.min],
                        ["Max", stats.max],
                        ["Answers", stats.count],
                    ].map(([label, value]) => (
                        <div key={label} className="rounded-md bg-secondary/40 p-3">
                            <div className="text-2xl font-bold">{value}</div>
                            <div className="text-xs text-muted-foreground">{label}</div>
                        </div>
                    ))}
                </div>
            )
        }

        const latest = filteredResponses
            .map((response) => formatAnswer(field, response.data[field.id]))
            .filter(Boolean)
            .slice(0, 5)
        return latest.length === 0 ? (
            <p className="text-sm text-muted-foreground">No answers yet.</p>
        ) : (
            <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Latest {latest.length} of {answeredCount} answers</p>
                {latest.map((answer, index) => (
                    <div key={index} className="rounded-md border px-3 py-2 text-sm line-clamp-2">
                        {answer}
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
            <header className="border-b bg-card py-4">
                <div className="container flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                        <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
                            <ArrowLeft className="h-5 w-5" />
                            <span className="sr-only">Back to Dashboard</span>
                        </Button>
                        <div className="min-w-0">
                            <h1 className="text-2xl font-bold truncate">{formData.title}</h1>
                            {formData.description && <p className="text-muted-foreground truncate">{formData.description}</p>}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline" className="hidden sm:inline-flex gap-1">
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                            Live
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => fetchData(true)} disabled={refreshing}>
                            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                            Refresh
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => router.push(`/builder/${formId}`)}>
                            Edit form
                        </Button>
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
                                    {responses.length !== filteredResponses.length
                                        ? `Filtered from ${responses.length} total`
                                        : "All time"}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{completionRate(filteredResponses, inputFields)}%</div>
                                <p className="text-xs text-muted-foreground mt-1">Average share of questions answered</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Last 7 Days</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{lastWeekCount}</div>
                                <p className="text-xs text-muted-foreground mt-1">New responses this week</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Latest Response</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xl font-bold leading-9">
                                    {latestResponse
                                        ? formatDistanceToNow(new Date(latestResponse.created_at), { addSuffix: true })
                                        : "—"}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {latestResponse ? format(new Date(latestResponse.created_at), "PPp") : "No responses yet"}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {responses.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center gap-4">
                                <Inbox className="h-12 w-12 text-muted-foreground" />
                                <div>
                                    <h3 className="text-lg font-medium">No responses yet</h3>
                                    <p className="text-muted-foreground">
                                        Share your form to start collecting responses. New submissions appear here automatically.
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={copyShareLink}>
                                        <Link2 className="h-4 w-4 mr-2" />
                                        Copy share link
                                    </Button>
                                    <Button variant="outline" onClick={() => window.open(`/form/${formId}`, "_blank")}>
                                        Open form
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
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

                                    <Select value={dateFilter} onValueChange={(value: DateFilter) => setDateFilter(value)}>
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
                                        <Button variant="outline" className="gap-2" disabled={filteredResponses.length === 0}>
                                            <Download className="h-4 w-4" />
                                            Export
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={exportToCSV}>
                                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                                            Export to CSV
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={exportToJSON}>
                                            <FileJson className="h-4 w-4 mr-2" />
                                            Export to JSON
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => window.print()}>
                                            <Printer className="h-4 w-4 mr-2" />
                                            Print Responses
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
                                <TabsList>
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="responses">Responses ({filteredResponses.length})</TabsTrigger>
                                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Submissions Over Time</CardTitle>
                                            <CardDescription>Responses received per day over the last 14 days</CardDescription>
                                        </CardHeader>
                                        <CardContent className="h-72">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={submissionsOverTime}>
                                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                                    <YAxis allowDecimals={false} />
                                                    <Tooltip />
                                                    <Bar dataKey="count" name="Submissions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between">
                                            <div>
                                                <CardTitle>Recent Responses</CardTitle>
                                                <CardDescription>The latest 5 submissions</CardDescription>
                                            </div>
                                            <Button variant="outline" size="sm" onClick={() => setActiveTab("responses")}>
                                                View All
                                            </Button>
                                        </CardHeader>
                                        <CardContent>
                                            {renderResponsesTable(filteredResponses.slice(0, 5), inputFields.slice(0, 4))}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="responses">
                                    <Card>
                                        <CardContent className="pt-6">
                                            {filteredResponses.length === 0 ? (
                                                <p className="text-center text-muted-foreground py-8">No responses match your filters.</p>
                                            ) : (
                                                renderResponsesTable(filteredResponses, inputFields)
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="analytics">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {inputFields.map((field) => (
                                            <Card key={field.id}>
                                                <CardHeader>
                                                    <CardTitle className="text-base">{field.label || field.type}</CardTitle>
                                                    <CardDescription>
                                                        {filteredResponses.filter((response) => isAnswered(response.data[field.id])).length} of{" "}
                                                        {filteredResponses.length} answered
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent>{renderFieldAnalytics(field)}</CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}
