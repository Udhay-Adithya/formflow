import type { FormComponent, RenderComponentProps } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function renderFormComponent(
  component: FormComponent,
  props: {
    isEditing?: boolean
    onUpdate?: (component: FormComponent) => void
    onDelete?: (componentId: string) => void
  },
) {
  const { isEditing = false } = props

  switch (component.type) {
    case "text":
      return <TextComponent component={component} {...props} />
    case "paragraph":
      return <ParagraphComponent component={component} {...props} />
    case "email":
      return <EmailComponent component={component} {...props} />
    case "number":
      return <NumberComponent component={component} {...props} />
    case "multiple_choice":
      return <MultipleChoiceComponent component={component} {...props} />
    case "checkboxes":
      return <CheckboxesComponent component={component} {...props} />
    case "dropdown":
      return <DropdownComponent component={component} {...props} />
    case "description":
      return <DescriptionComponent component={component} {...props} />
    default:
      return <div>Unknown component type: {component.type}</div>
  }
}

function TextComponent({ component, isEditing }: RenderComponentProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={component.id}>
        {component.label}
        {component.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {component.description && <p className="text-sm text-muted-foreground">{component.description}</p>}
      <Input id={component.id} placeholder={component.placeholder} disabled={isEditing} />
    </div>
  )
}

function ParagraphComponent({ component, isEditing }: RenderComponentProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={component.id}>
        {component.label}
        {component.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {component.description && <p className="text-sm text-muted-foreground">{component.description}</p>}
      <Textarea id={component.id} placeholder={component.placeholder} disabled={isEditing} />
    </div>
  )
}

function EmailComponent({ component, isEditing }: RenderComponentProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={component.id}>
        {component.label}
        {component.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {component.description && <p className="text-sm text-muted-foreground">{component.description}</p>}
      <Input id={component.id} type="email" placeholder={component.placeholder} disabled={isEditing} />
    </div>
  )
}

function NumberComponent({ component, isEditing }: RenderComponentProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={component.id}>
        {component.label}
        {component.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {component.description && <p className="text-sm text-muted-foreground">{component.description}</p>}
      <Input
        id={component.id}
        type="number"
        placeholder={component.placeholder}
        min={component.validation?.min}
        max={component.validation?.max}
        disabled={isEditing}
      />
    </div>
  )
}

function MultipleChoiceComponent({ component, isEditing }: RenderComponentProps) {
  const options = component.config?.options || []

  return (
    <div className="space-y-3">
      <Label>
        {component.label}
        {component.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {component.description && <p className="text-sm text-muted-foreground">{component.description}</p>}
      <RadioGroup disabled={isEditing}>
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`${component.id}-${option.value}`} />
            <Label htmlFor={`${component.id}-${option.value}`}>{option.label}</Label>
          </div>
        ))}
        {component.config?.allowOther && (
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id={`${component.id}-other`} />
            <Label htmlFor={`${component.id}-other`}>Other</Label>
          </div>
        )}
      </RadioGroup>
    </div>
  )
}

function CheckboxesComponent({ component, isEditing }: RenderComponentProps) {
  const options = component.config?.options || []

  return (
    <div className="space-y-3">
      <Label>
        {component.label}
        {component.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {component.description && <p className="text-sm text-muted-foreground">{component.description}</p>}
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox id={`${component.id}-${option.value}`} disabled={isEditing} />
            <Label htmlFor={`${component.id}-${option.value}`}>{option.label}</Label>
          </div>
        ))}
      </div>
    </div>
  )
}

function DropdownComponent({ component, isEditing }: RenderComponentProps) {
  const options = component.config?.options || []

  return (
    <div className="space-y-2">
      <Label htmlFor={component.id}>
        {component.label}
        {component.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {component.description && <p className="text-sm text-muted-foreground">{component.description}</p>}
      <Select disabled={isEditing}>
        <SelectTrigger id={component.id}>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function DescriptionComponent({ component }: RenderComponentProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">{component.label}</h3>
      <div className="text-sm">{component.config?.text}</div>
    </div>
  )
}
