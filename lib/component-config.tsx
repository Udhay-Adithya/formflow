"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2 } from "lucide-react"
import type { ComponentConfigProps } from "@/lib/types"

export function getComponentConfig(type: string) {
  switch (type) {
    case "text":
      return TextConfig
    case "paragraph":
      return ParagraphConfig
    case "email":
      return EmailConfig
    case "number":
      return NumberConfig
    case "multiple_choice":
      return MultipleChoiceConfig
    case "checkboxes":
      return CheckboxesConfig
    case "dropdown":
      return DropdownConfig
    case "description":
      return DescriptionConfig
    default:
      return BasicConfig
  }
}

function BasicConfig({ component, onUpdate }: ComponentConfigProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input id="label" value={component.label} onChange={(e) => onUpdate({ ...component, label: e.target.value })} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Input
          id="description"
          value={component.description || ""}
          onChange={(e) => onUpdate({ ...component, description: e.target.value })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="required">Required</Label>
        <Switch
          id="required"
          checked={component.required || false}
          onCheckedChange={(checked) => onUpdate({ ...component, required: checked })}
        />
      </div>
    </div>
  )
}

function TextConfig({ component, onUpdate }: ComponentConfigProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input id="label" value={component.label} onChange={(e) => onUpdate({ ...component, label: e.target.value })} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Input
          id="description"
          value={component.description || ""}
          onChange={(e) => onUpdate({ ...component, description: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="placeholder">Placeholder</Label>
        <Input
          id="placeholder"
          value={component.placeholder || ""}
          onChange={(e) => onUpdate({ ...component, placeholder: e.target.value })}
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="required">Required</Label>
          <Switch
            id="required"
            checked={component.required || false}
            onCheckedChange={(checked) => onUpdate({ ...component, required: checked })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="min-length">Minimum Length</Label>
          <Input
            id="min-length"
            type="number"
            value={component.validation?.minLength || ""}
            onChange={(e) => {
              const value = e.target.value ? Number.parseInt(e.target.value) : undefined
              onUpdate({
                ...component,
                validation: {
                  ...component.validation,
                  minLength: value,
                },
              })
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="max-length">Maximum Length</Label>
          <Input
            id="max-length"
            type="number"
            value={component.validation?.maxLength || ""}
            onChange={(e) => {
              const value = e.target.value ? Number.parseInt(e.target.value) : undefined
              onUpdate({
                ...component,
                validation: {
                  ...component.validation,
                  maxLength: value,
                },
              })
            }}
          />
        </div>
      </div>
    </div>
  )
}

function ParagraphConfig({ component, onUpdate }: ComponentConfigProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input id="label" value={component.label} onChange={(e) => onUpdate({ ...component, label: e.target.value })} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Input
          id="description"
          value={component.description || ""}
          onChange={(e) => onUpdate({ ...component, description: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="placeholder">Placeholder</Label>
        <Input
          id="placeholder"
          value={component.placeholder || ""}
          onChange={(e) => onUpdate({ ...component, placeholder: e.target.value })}
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="required">Required</Label>
          <Switch
            id="required"
            checked={component.required || false}
            onCheckedChange={(checked) => onUpdate({ ...component, required: checked })}
          />
        </div>
      </div>
    </div>
  )
}

function EmailConfig({ component, onUpdate }: ComponentConfigProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input id="label" value={component.label} onChange={(e) => onUpdate({ ...component, label: e.target.value })} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Input
          id="description"
          value={component.description || ""}
          onChange={(e) => onUpdate({ ...component, description: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="placeholder">Placeholder</Label>
        <Input
          id="placeholder"
          value={component.placeholder || ""}
          onChange={(e) => onUpdate({ ...component, placeholder: e.target.value })}
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="required">Required</Label>
          <Switch
            id="required"
            checked={component.required || false}
            onCheckedChange={(checked) => onUpdate({ ...component, required: checked })}
          />
        </div>
      </div>
    </div>
  )
}

function NumberConfig({ component, onUpdate }: ComponentConfigProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input id="label" value={component.label} onChange={(e) => onUpdate({ ...component, label: e.target.value })} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Input
          id="description"
          value={component.description || ""}
          onChange={(e) => onUpdate({ ...component, description: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="placeholder">Placeholder</Label>
        <Input
          id="placeholder"
          value={component.placeholder || ""}
          onChange={(e) => onUpdate({ ...component, placeholder: e.target.value })}
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="required">Required</Label>
          <Switch
            id="required"
            checked={component.required || false}
            onCheckedChange={(checked) => onUpdate({ ...component, required: checked })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="min-value">Minimum Value</Label>
          <Input
            id="min-value"
            type="number"
            value={component.validation?.min || ""}
            onChange={(e) => {
              const value = e.target.value ? Number.parseInt(e.target.value) : undefined
              onUpdate({
                ...component,
                validation: {
                  ...component.validation,
                  min: value,
                },
              })
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="max-value">Maximum Value</Label>
          <Input
            id="max-value"
            type="number"
            value={component.validation?.max || ""}
            onChange={(e) => {
              const value = e.target.value ? Number.parseInt(e.target.value) : undefined
              onUpdate({
                ...component,
                validation: {
                  ...component.validation,
                  max: value,
                },
              })
            }}
          />
        </div>
      </div>
    </div>
  )
}

function MultipleChoiceConfig({ component, onUpdate }: ComponentConfigProps) {
  const options = component.config?.options || []

  const handleAddOption = () => {
    const newOption = { label: `Option ${options.length + 1}`, value: `option_${options.length + 1}` }
    onUpdate({
      ...component,
      config: {
        ...component.config,
        options: [...options, newOption],
      },
    })
  }

  const handleRemoveOption = (index: number) => {
    const newOptions = [...options]
    newOptions.splice(index, 1)
    onUpdate({
      ...component,
      config: {
        ...component.config,
        options: newOptions,
      },
    })
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = { ...newOptions[index], label: value, value: value.toLowerCase().replace(/\s+/g, "_") }
    onUpdate({
      ...component,
      config: {
        ...component.config,
        options: newOptions,
      },
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input id="label" value={component.label} onChange={(e) => onUpdate({ ...component, label: e.target.value })} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Input
          id="description"
          value={component.description || ""}
          onChange={(e) => onUpdate({ ...component, description: e.target.value })}
        />
      </div>

      <Separator />

      <div className="space-y-2">
        <Label>Options</Label>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input value={option.label} onChange={(e) => handleOptionChange(index, e.target.value)} />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveOption(index)}
                disabled={options.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove option</span>
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="mt-2" onClick={handleAddOption}>
            <Plus className="h-4 w-4 mr-2" />
            Add Option
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="allow-other">Allow "Other" option</Label>
        <Switch
          id="allow-other"
          checked={component.config?.allowOther || false}
          onCheckedChange={(checked) =>
            onUpdate({
              ...component,
              config: {
                ...component.config,
                allowOther: checked,
              },
            })
          }
        />
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <Label htmlFor="required">Required</Label>
        <Switch
          id="required"
          checked={component.required || false}
          onCheckedChange={(checked) => onUpdate({ ...component, required: checked })}
        />
      </div>
    </div>
  )
}

function CheckboxesConfig({ component, onUpdate }: ComponentConfigProps) {
  const options = component.config?.options || []

  const handleAddOption = () => {
    const newOption = { label: `Option ${options.length + 1}`, value: `option_${options.length + 1}` }
    onUpdate({
      ...component,
      config: {
        ...component.config,
        options: [...options, newOption],
      },
    })
  }

  const handleRemoveOption = (index: number) => {
    const newOptions = [...options]
    newOptions.splice(index, 1)
    onUpdate({
      ...component,
      config: {
        ...component.config,
        options: newOptions,
      },
    })
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = { ...newOptions[index], label: value, value: value.toLowerCase().replace(/\s+/g, "_") }
    onUpdate({
      ...component,
      config: {
        ...component.config,
        options: newOptions,
      },
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input id="label" value={component.label} onChange={(e) => onUpdate({ ...component, label: e.target.value })} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Input
          id="description"
          value={component.description || ""}
          onChange={(e) => onUpdate({ ...component, description: e.target.value })}
        />
      </div>

      <Separator />

      <div className="space-y-2">
        <Label>Options</Label>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input value={option.label} onChange={(e) => handleOptionChange(index, e.target.value)} />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveOption(index)}
                disabled={options.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove option</span>
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="mt-2" onClick={handleAddOption}>
            <Plus className="h-4 w-4 mr-2" />
            Add Option
          </Button>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <Label htmlFor="required">Required</Label>
        <Switch
          id="required"
          checked={component.required || false}
          onCheckedChange={(checked) => onUpdate({ ...component, required: checked })}
        />
      </div>
    </div>
  )
}

function DropdownConfig({ component, onUpdate }: ComponentConfigProps) {
  const options = component.config?.options || []

  const handleAddOption = () => {
    const newOption = { label: `Option ${options.length + 1}`, value: `option_${options.length + 1}` }
    onUpdate({
      ...component,
      config: {
        ...component.config,
        options: [...options, newOption],
      },
    })
  }

  const handleRemoveOption = (index: number) => {
    const newOptions = [...options]
    newOptions.splice(index, 1)
    onUpdate({
      ...component,
      config: {
        ...component.config,
        options: newOptions,
      },
    })
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = { ...newOptions[index], label: value, value: value.toLowerCase().replace(/\s+/g, "_") }
    onUpdate({
      ...component,
      config: {
        ...component.config,
        options: newOptions,
      },
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input id="label" value={component.label} onChange={(e) => onUpdate({ ...component, label: e.target.value })} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Input
          id="description"
          value={component.description || ""}
          onChange={(e) => onUpdate({ ...component, description: e.target.value })}
        />
      </div>

      <Separator />

      <div className="space-y-2">
        <Label>Options</Label>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input value={option.label} onChange={(e) => handleOptionChange(index, e.target.value)} />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveOption(index)}
                disabled={options.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove option</span>
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="mt-2" onClick={handleAddOption}>
            <Plus className="h-4 w-4 mr-2" />
            Add Option
          </Button>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <Label htmlFor="required">Required</Label>
        <Switch
          id="required"
          checked={component.required || false}
          onCheckedChange={(checked) => onUpdate({ ...component, required: checked })}
        />
      </div>
    </div>
  )
}

function DescriptionConfig({ component, onUpdate }: ComponentConfigProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input id="label" value={component.label} onChange={(e) => onUpdate({ ...component, label: e.target.value })} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="text">Text Content</Label>
        <Textarea
          id="text"
          value={component.config?.text || ""}
          onChange={(e) =>
            onUpdate({
              ...component,
              config: {
                ...component.config,
                text: e.target.value,
              },
            })
          }
          rows={5}
        />
      </div>
    </div>
  )
}
