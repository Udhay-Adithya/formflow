"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import type { ComponentConfigProps } from "@/lib/types"

export function getComponentConfig(type: string) {
  switch (type) {
    case "text":
      return TextConfig
    case "paragraph":
      return ParagraphConfig
    case "text_editor":
      return TextEditorConfig
    case "email":
      return EmailConfig
    case "number":
      return NumberConfig
    case "phone":
      return PhoneConfig
    case "signature":
      return SignatureConfig
    case "date_time":
      return DateTimeConfig
    case "choice":
      return ChoiceConfig
    case "checkbox":
      return SingleCheckboxConfig
    case "multiple_choice":
      return MultipleChoiceConfig
    case "checkboxes":
      return CheckboxesConfig
    case "dropdown":
      return DropdownConfig
    case "description":
      return DescriptionConfig
    case "image":
      return ImageConfig
    case "link":
      return LinkConfig
    case "form_heading":
      return FormHeadingConfig
    case "section_heading":
      return SectionHeadingConfig
    case "sub_heading":
      return SubHeadingConfig
    case "divider":
      return DividerConfig
    case "spacer":
      return SpacerConfig
    case "submit":
      return SubmitConfig
    case "page_break":
      return PageBreakConfig
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

function TextEditorConfig({ component, onUpdate }: ComponentConfigProps) {
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

function PhoneConfig({ component, onUpdate }: ComponentConfigProps) {
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

function SignatureConfig({ component, onUpdate }: ComponentConfigProps) {
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

function DateTimeConfig({ component, onUpdate }: ComponentConfigProps) {
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

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="enable-date">Enable Date</Label>
          <Switch
            id="enable-date"
            checked={component.config?.enableDate !== false}
            onCheckedChange={(checked) =>
              onUpdate({
                ...component,
                config: {
                  ...component.config,
                  enableDate: checked,
                },
              })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="enable-time">Enable Time</Label>
          <Switch
            id="enable-time"
            checked={component.config?.enableTime || false}
            onCheckedChange={(checked) =>
              onUpdate({
                ...component,
                config: {
                  ...component.config,
                  enableTime: checked,
                },
              })
            }
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
    </div>
  )
}

function ChoiceConfig({ component, onUpdate }: ComponentConfigProps) {
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
        <Label htmlFor="multiple">Allow multiple selection</Label>
        <Switch
          id="multiple"
          checked={component.config?.multiple || false}
          onCheckedChange={(checked) =>
            onUpdate({
              ...component,
              config: {
                ...component.config,
                multiple: checked,
              },
            })
          }
        />
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

function SingleCheckboxConfig({ component, onUpdate }: ComponentConfigProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input id="label" value={component.label} onChange={(e) => onUpdate({ ...component, label: e.target.value })} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="text">Checkbox Text</Label>
        <Input
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
        />
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
            Add Optionn
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

function ImageConfig({ component, onUpdate }: ComponentConfigProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input id="label" value={component.label} onChange={(e) => onUpdate({ ...component, label: e.target.value })} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">Image URL</Label>
        <Input
          id="url"
          value={component.config?.url || ""}
          onChange={(e) =>
            onUpdate({
              ...component,
              config: {
                ...component.config,
                url: e.target.value,
              },
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="text">Image Caption</Label>
        <Input
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
        />
      </div>
    </div>
  )
}

function LinkConfig({ component, onUpdate }: ComponentConfigProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input id="label" value={component.label} onChange={(e) => onUpdate({ ...component, label: e.target.value })} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="text">Link Text</Label>
        <Input
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
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          value={component.config?.url || ""}
          onChange={(e) =>
            onUpdate({
              ...component,
              config: {
                ...component.config,
                url: e.target.value,
              },
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Input
          id="description"
          value={component.description || ""}
          onChange={(e) => onUpdate({ ...component, description: e.target.value })}
        />
      </div>
    </div>
  )
}

function FormHeadingConfig({ component, onUpdate }: ComponentConfigProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="text">Heading Text</Label>
        <Input
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
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="size">Size</Label>
        <Select
          value={component.config?.size || "xl"}
          onValueChange={(value) =>
            onUpdate({
              ...component,
              config: {
                ...component.config,
                size: value,
              },
            })
          }
        >
          <SelectTrigger id="size">
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="xl">Extra Large</SelectItem>
            <SelectItem value="lg">Large</SelectItem>
            <SelectItem value="md">Medium</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function SectionHeadingConfig({ component, onUpdate }: ComponentConfigProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="text">Heading Text</Label>
        <Input
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
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="size">Size</Label>
        <Select
          value={component.config?.size || "lg"}
          onValueChange={(value) =>
            onUpdate({
              ...component,
              config: {
                ...component.config,
                size: value,
              },
            })
          }
        >
          <SelectTrigger id="size">
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lg">Large</SelectItem>
            <SelectItem value="md">Medium</SelectItem>
            <SelectItem value="sm">Small</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function SubHeadingConfig({ component, onUpdate }: ComponentConfigProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="text">Heading Text</Label>
        <Input
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
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="size">Size</Label>
        <Select
          value={component.config?.size || "md"}
          onValueChange={(value) =>
            onUpdate({
              ...component,
              config: {
                ...component.config,
                size: value,
              },
            })
          }
        >
          <SelectTrigger id="size">
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="md">Medium</SelectItem>
            <SelectItem value="sm">Small</SelectItem>
            <SelectItem value="xs">Extra Small</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function DividerConfig({ component, onUpdate }: ComponentConfigProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="style">Style</Label>
        <Select
          value={component.config?.style || "solid"}
          onValueChange={(value) =>
            onUpdate({
              ...component,
              config: {
                ...component.config,
                style: value,
              },
            })
          }
        >
          <SelectTrigger id="style">
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Solid</SelectItem>
            <SelectItem value="dashed">Dashed</SelectItem>
            <SelectItem value="dotted">Dotted</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function SpacerConfig({ component, onUpdate }: ComponentConfigProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="height">Height</Label>
        <Select
          value={component.config?.height || "md"}
          onValueChange={(value) =>
            onUpdate({
              ...component,
              config: {
                ...component.config,
                height: value,
              },
            })
          }
        >
          <SelectTrigger id="height">
            <SelectValue placeholder="Select height" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="xs">Extra Small</SelectItem>
            <SelectItem value="sm">Small</SelectItem>
            <SelectItem value="md">Medium</SelectItem>
            <SelectItem value="lg">Large</SelectItem>
            <SelectItem value="xl">Extra Large</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function SubmitConfig({ component, onUpdate }: ComponentConfigProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="text">Button Text</Label>
        <Input
          id="text"
          value={component.config?.text || "Submit"}
          onChange={(e) =>
            onUpdate({
              ...component,
              config: {
                ...component.config,
                text: e.target.value,
              },
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="style">Style</Label>
        <Select
          value={component.config?.style || "primary"}
          onValueChange={(value) =>
            onUpdate({
              ...component,
              config: {
                ...component.config,
                style: value,
              },
            })
          }
        >
          <SelectTrigger id="style">
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="primary">Primary</SelectItem>
            <SelectItem value="outline">Outline</SelectItem>
            <SelectItem value="secondary">Secondary</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function PageBreakConfig({ component, onUpdate }: ComponentConfigProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nextButtonText">Next Button Text</Label>
        <Input
          id="nextButtonText"
          value={component.config?.nextButtonText || "Next"}
          onChange={(e) =>
            onUpdate({
              ...component,
              config: {
                ...component.config,
                nextButtonText: e.target.value,
              },
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="prevButtonText">Previous Button Text</Label>
        <Input
          id="prevButtonText"
          value={component.config?.prevButtonText || "Previous"}
          onChange={(e) =>
            onUpdate({
              ...component,
              config: {
                ...component.config,
                prevButtonText: e.target.value,
              },
            })
          }
        />
      </div>
    </div>
  )
}
