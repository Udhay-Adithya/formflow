import { ShareableForm } from "@/components/sharable-form";

export default function ShareableFormPage({ params }: { params: { formId: string } }) {
    return <ShareableForm formId={params.formId} />
}