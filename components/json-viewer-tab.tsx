"use client"

import type { FormData } from "@/lib/types"
import { ScrollArea } from "@/components/ui/scroll-area"

interface JsonViewerTabProps {
  formData: FormData
}

export function JsonViewerTab({ formData }: JsonViewerTabProps) {
  const jsonString = JSON.stringify(formData, null, 2)

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">JSON Schema</h2>
      <p className="text-sm text-muted-foreground">
        This is the JSON representation of your form that will be used for submissions.
      </p>
      <ScrollArea className="h-[500px] rounded-md border bg-muted/50 p-4">
        <pre className="text-xs font-mono">{jsonString}</pre>
      </ScrollArea>
    </div>
  )
}
