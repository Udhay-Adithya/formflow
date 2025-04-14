"use client"

import { useState, useRef } from "react"
import { useDrop } from "react-dnd"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import type { FormComponent, FormData } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { renderFormComponent } from "@/lib/render-component"
import { MousePointerClick } from "lucide-react"

interface FormCanvasProps {
  formData: FormData
  selectedComponentId: string | undefined
  onSelectComponent: (component: FormComponent | null) => void
  onUpdateComponent: (component: FormComponent) => void
  onDeleteComponent: (componentId: string) => void
  onReorderComponents: (components: FormComponent[]) => void
}

export function FormCanvas({
  formData,
  selectedComponentId,
  onSelectComponent,
  onUpdateComponent,
  onDeleteComponent,
  onReorderComponents,
}: FormCanvasProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  const [, drop] = useDrop(() => ({
    accept: "FORM_COMPONENT",
    drop: () => ({ name: "FormCanvas" }),
    hover: () => setIsDraggingOver(true),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(formData.fields)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update order property
    const reorderedComponents = items.map((item, index) => ({
      ...item,
      order: index,
    }))

    onReorderComponents(reorderedComponents)
  }

  return (
    <div className="flex-1 overflow-auto p-4 bg-background">
      <div
        ref={(node) => {
          drop(node)
          if (canvasRef.current) {
            canvasRef.current = node
          }
        }}
        className={`form-canvas max-w-3xl mx-auto bg-card rounded-lg shadow-sm border p-8 ${
          isDraggingOver ? "drag-over" : ""
        }`}
      >
        {formData.fields.length > 0 ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="form-components">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                  {formData.fields
                    .sort((a, b) => a.order - b.order)
                    .map((component, index) => (
                      <Draggable key={component.id} draggableId={component.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`form-component rounded-md ${
                              selectedComponentId === component.id ? "selected" : ""
                            } ${snapshot.isDragging ? "dragging" : ""}`}
                            onClick={() => onSelectComponent(component)}
                          >
                            <Card className="p-4 hover:shadow-md transition-shadow">
                              {renderFormComponent(component, {
                                isEditing: true,
                                onUpdate: onUpdateComponent,
                                onDelete: onDeleteComponent,
                              })}
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 border-2 border-dashed border-primary/50 rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-0 flex items-center justify-center text-primary">
                <MousePointerClick size={32} />
              </div>
            </div>
            <h3 className="text-xl font-medium mb-2">Drag elements here</h3>
            <p className="text-sm">Grab an element from the left and drop it here</p>
          </div>
        )}
      </div>
    </div>
  )
}
