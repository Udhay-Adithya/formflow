"use client"

import { useState } from "react"
import { Search, FileJson, List, Settings2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { FormComponent, FormData } from "@/lib/types"
import { PropertiesTab } from "@/components/properties-tab"
import { StructureTab } from "@/components/structure-tab"
import { JsonViewerTab } from "@/components/json-viewer-tab"

interface ConfigPanelProps {
  formData: FormData
  selectedComponent: FormComponent | null
  activeTab: "properties" | "structure" | "json"
  onTabChange: (tab: "properties" | "structure" | "json") => void
  onUpdateComponent: (component: FormComponent) => void
  onFormUpdate: (updates: Partial<FormData>) => void
}

export function ConfigPanel({
  formData,
  selectedComponent,
  activeTab,
  onTabChange,
  onUpdateComponent,
  onFormUpdate,
}: ConfigPanelProps) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="w-80 border-l bg-secondary/20 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tree"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as any)} className="flex-1 overflow-hidden">
        <TabsList className="grid grid-cols-3 mx-4 mt-2">
          <TabsTrigger value="properties" className="flex items-center gap-1">
            <Settings2 className="h-4 w-4" />
            <span className="hidden sm:inline">Properties</span>
          </TabsTrigger>
          <TabsTrigger value="structure" className="flex items-center gap-1">
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Structure</span>
          </TabsTrigger>
          <TabsTrigger value="json" className="flex items-center gap-1">
            <FileJson className="h-4 w-4" />
            <span className="hidden sm:inline">JSON</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="flex-1 overflow-y-auto p-4">
          <PropertiesTab
            selectedComponent={selectedComponent}
            formData={formData}
            onUpdateComponent={onUpdateComponent}
            onFormUpdate={onFormUpdate}
          />
        </TabsContent>

        <TabsContent value="structure" className="flex-1 overflow-y-auto p-4">
          <StructureTab
            formData={formData}
            selectedComponentId={selectedComponent?.id}
            onSelectComponent={(componentId) => {
              const component = formData.fields.find((field) => field.id === componentId) || null
              onTabChange("properties")
              return component
            }}
          />
        </TabsContent>

        <TabsContent value="json" className="flex-1 overflow-y-auto p-4">
          <JsonViewerTab formData={formData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
