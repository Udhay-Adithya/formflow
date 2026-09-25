import { ShareableForm } from "@/components/sharable-form";

// Next.js 15 passes route params as a Promise
export default async function ShareableFormPage({ params }: { params: Promise<{ formId: string }> }) {
    const { formId } = await params
    return <ShareableForm formId={formId} />
}
