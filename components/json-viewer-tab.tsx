"use client"

import { useState } from "react"
import type { FormData } from "@/lib/types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Copy, Download, Upload } from "lucide-react"

interface JsonViewerTabProps {
  formData: FormData
  onFormUpdate?: (formData: FormData) => void
}

export function JsonViewerTab({ formData, onFormUpdate }: JsonViewerTabProps) {
  const [jsonString, setJsonString] = useState<string>(JSON.stringify(formData, null, 2))
  const [importMode, setImportMode] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [importedJson, setImportedJson] = useState<string>("")

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(jsonString)
  }

  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${formData.title.toLowerCase().replace(/\s+/g, "-")}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportJson = () => {
    try {
      const parsedJson = JSON.parse(importedJson)

      // Basic validation
      if (!parsedJson.id || !Array.isArray(parsedJson.fields)) {
        throw new Error("Invalid form structure. JSON must include 'id' and 'fields' array.")
      }

      if (onFormUpdate) {
        onFormUpdate(parsedJson)
        setImportMode(false)
        setImportError(null)
        setImportedJson("")
      }
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Invalid JSON format")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">JSON Schema</h2>
        <div className="flex gap-2">
          {!importMode ? (
            <>
              <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadJson}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={() => setImportMode(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setImportMode(false)
                setImportError(null)
                setImportedJson("")
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      {importMode ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Paste your JSON schema below to import a form.</p>

          {importError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{importError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="import-json">JSON Schema</Label>
            <Textarea
              id="import-json"
              rows={15}
              value={importedJson}
              onChange={(e) => setImportedJson(e.target.value)}
              className="font-mono text-xs"
            />
          </div>

          <Button onClick={handleImportJson}>
            <Upload className="h-4 w-4 mr-2" />
            Import Form
          </Button>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            This is the JSON representation of your form that will be used for submissions.
          </p>
          <ScrollArea className="h-[500px] rounded-md border bg-muted/50 p-4">
            <pre className="text-xs font-mono">{jsonString}</pre>
          </ScrollArea>
        </>
      )}
    </div>
  )
}
