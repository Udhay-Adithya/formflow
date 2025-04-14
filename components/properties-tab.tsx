"use client"

import type { FormComponent, FormData } from "@/lib/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { getComponentConfig } from "@/lib/component-config"

interface PropertiesTabProps {
  selectedComponent: FormComponent | null
  formData: FormData
  onUpdateComponent: (component: FormComponent) => void
  onFormUpdate: (updates: Partial<FormData>) => void
}

export function PropertiesTab({ selectedComponent, formData, onUpdateComponent, onFormUpdate }: PropertiesTabProps) {
  if (!selectedComponent) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-medium mb-4">Form Settings</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="form-title">Form Title</Label>
              <Input id="form-title" value={formData.title} onChange={(e) => onFormUpdate({ title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="form-description">Description</Label>
              <Textarea
                id="form-description"
                value={formData.description}
                onChange={(e) => onFormUpdate({ description: e.target.value })}
                rows={3}
              />
            </div>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="requires-login">Requires Login</Label>
                <Switch
                  id="requires-login"
                  checked={formData.settings.requiresLogin}
                  onCheckedChange={(checked) =>
                    onFormUpdate({
                      settings: { ...formData.settings, requiresLogin: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="multiple-submissions">Allow Multiple Submissions</Label>
                <Switch
                  id="multiple-submissions"
                  checked={formData.settings.allowMultipleSubmissions}
                  onCheckedChange={(checked) =>
                    onFormUpdate({
                      settings: { ...formData.settings, allowMultipleSubmissions: checked },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmation-message">Confirmation Message</Label>
                <Textarea
                  id="confirmation-message"
                  value={formData.settings.confirmationMessage}
                  onChange={(e) =>
                    onFormUpdate({
                      settings: { ...formData.settings, confirmationMessage: e.target.value },
                    })
                  }
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const ComponentConfig = getComponentConfig(selectedComponent.type)

  if (!ComponentConfig) {
    return <div>No configuration available for this component type.</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium mb-4">{selectedComponent.label} Properties</h2>
      <ComponentConfig component={selectedComponent} onUpdate={onUpdateComponent} />
    </div>
  )
}
