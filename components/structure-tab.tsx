"use client"

import type { FormData } from "@/lib/types"
import {
  ChevronDown,
  GripVertical,
  Type,
  AlignLeft,
  Hash,
  Mail,
  Phone,
  Edit3,
  ImageIcon,
  LinkIcon,
  CheckSquare,
  List,
  FileText,
} from "lucide-react"

interface StructureTabProps {
  formData: FormData
  selectedComponentId?: string
  onSelectComponent: (componentId: string) => any
}

export function StructureTab({ formData, selectedComponentId, onSelectComponent }: StructureTabProps) {
  const getComponentIcon = (type: string) => {
    switch (type) {
      case "text":
        return <Type className="h-4 w-4" />
      case "paragraph":
        return <AlignLeft className="h-4 w-4" />
      case "number":
        return <Hash className="h-4 w-4" />
      case "email":
        return <Mail className="h-4 w-4" />
      case "phone":
        return <Phone className="h-4 w-4" />
      case "text_editor":
        return <Edit3 className="h-4 w-4" />
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "link":
        return <LinkIcon className="h-4 w-4" />
      case "multiple_choice":
        return <List className="h-4 w-4" />
      case "checkboxes":
        return <CheckSquare className="h-4 w-4" />
      case "dropdown":
        return <List className="h-4 w-4" />
      case "description":
        return <FileText className="h-4 w-4" />
      default:
        return <Type className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 p-2 rounded-md hover:bg-secondary cursor-pointer">
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
        <div className="font-medium">{formData.title || "Untitled Form"}</div>
      </div>

      <div className="pl-6 space-y-1">
        {formData.fields
          .sort((a, b) => a.order - b.order)
          .map((component) => (
            <div
              key={component.id}
              className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${
                selectedComponentId === component.id ? "bg-secondary" : "hover:bg-secondary/50"
              }`}
              onClick={() => onSelectComponent(component.id)}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              {getComponentIcon(component.type)}
              <div className="text-sm truncate">{component.label}</div>
            </div>
          ))}

        {formData.fields.length === 0 && (
          <div className="text-sm text-muted-foreground p-2">No components added yet</div>
        )}
      </div>
    </div>
  )
}
