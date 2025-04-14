"use client"

import { useState } from "react"
import { useDrag } from "react-dnd"
import {
  Search,
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
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { componentTypes } from "@/lib/component-types"
import type { FormComponent } from "@/lib/types"

interface ComponentLibraryProps {
  onAddComponent: (component: FormComponent) => void
}

export function ComponentLibrary({ onAddComponent }: ComponentLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredComponents = componentTypes.filter(
    (component) =>
      component.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="w-80 border-r bg-secondary/20 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search elements"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="fields" className="flex-1 overflow-hidden">
        <TabsList className="grid grid-cols-2 mx-4 mt-2">
          <TabsTrigger value="fields">Fields</TabsTrigger>
          <TabsTrigger value="page">Page</TabsTrigger>
        </TabsList>

        <TabsContent value="fields" className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {filteredComponents.map((component) => (
              <ComponentItem key={component.type} component={component} onAddComponent={onAddComponent} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="page" className="flex-1 overflow-y-auto p-2">
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Page components coming soon
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ComponentItemProps {
  component: FormComponent
  onAddComponent: (component: FormComponent) => void
}

function ComponentItem({ component, onAddComponent }: ComponentItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "FORM_COMPONENT",
    item: component,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult()
      if (item && dropResult) {
        onAddComponent(component)
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  const getComponentIcon = (type: string) => {
    switch (type) {
      case "text":
        return <Type className="h-5 w-5" />
      case "paragraph":
        return <AlignLeft className="h-5 w-5" />
      case "number":
        return <Hash className="h-5 w-5" />
      case "email":
        return <Mail className="h-5 w-5" />
      case "phone":
        return <Phone className="h-5 w-5" />
      case "text_editor":
        return <Edit3 className="h-5 w-5" />
      case "image":
        return <ImageIcon className="h-5 w-5" />
      case "link":
        return <LinkIcon className="h-5 w-5" />
      case "multiple_choice":
        return <List className="h-5 w-5" />
      case "checkboxes":
        return <CheckSquare className="h-5 w-5" />
      case "dropdown":
        return <List className="h-5 w-5" />
      case "description":
        return <FileText className="h-5 w-5" />
      default:
        return <Type className="h-5 w-5" />
    }
  }

  return (
    <div
      ref={drag}
      className={`component-library-item flex items-center p-3 rounded-md cursor-grab hover:bg-secondary ${
        isDragging ? "opacity-50" : ""
      }`}
      onClick={() => onAddComponent(component)}
    >
      <div className="flex items-center justify-center h-10 w-10 rounded-md bg-background text-foreground mr-3">
        {getComponentIcon(component.type)}
      </div>
      <div className="flex-1">
        <div className="font-medium">{component.label}</div>
        <div className="text-xs text-muted-foreground">{component.description}</div>
      </div>
      {component.isNew && (
        <Badge variant="outline" className="bg-primary text-primary-foreground ml-2">
          NEW
        </Badge>
      )}
    </div>
  )
}
