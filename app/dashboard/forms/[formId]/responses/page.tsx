import { ResponsesDashboard } from "@/components/responses-dashboard";


export default function ResponsesPage({ params }: { params: { formId: string } }) {
    return <ResponsesDashboard formId={params.formId} />
}