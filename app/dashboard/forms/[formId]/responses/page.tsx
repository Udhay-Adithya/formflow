import { ResponsesDashboard } from "@/components/responses-dashboard";

// Next.js 15 passes route params as a Promise
export default async function ResponsesPage({ params }: { params: Promise<{ formId: string }> }) {
    const { formId } = await params
    return <ResponsesDashboard formId={formId} />
}
