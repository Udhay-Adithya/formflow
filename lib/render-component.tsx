"use client"

import type React from "react"

import { useState } from "react"
import type { FormComponent, RenderComponentProps } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

interface ExtendedRenderComponentProps extends RenderComponentProps {
  onValueChange?: (value: any) => void
  value?: any
}

export function renderFormComponent(
  component: FormComponent,
  props: {
    isEditing?: boolean
    onUpdate?: (component: FormComponent) => void
    onDelete?: (componentId: string) => void
    onValueChange?: (value: any) => void
    value?: any
  },
) {
  const { isEditing = false } = props

  switch (component.type) {
    case "text":
      return <TextComponent component={component} {...props} />
    case "paragraph":
      return <ParagraphComponent component={component} {...props} />
    case "text_editor":
      return <TextEditorComponent component={component} {...props} />
    case "email":
      return <EmailComponent component={component} {...props} />
    case "number":
      return <NumberComponent component={component} {...props} />
    case "phone":
      return <PhoneComponent component={component} {...props} />
    case "signature":
      return <SignatureComponent component={component} {...props} />
    case "date_time":
      return <DateTimeComponent component={component} {...props} />
    case "choice":
      return <ChoiceComponent component={component} {...props} />
    case "checkbox":
      return <SingleCheckboxComponent component={component} {...props} />
    case "multiple_choice":
      return <MultipleChoiceComponent component={component} {...props} />
    case "checkboxes":
      return <CheckboxesComponent component={component} {...props} />
    case "dropdown":
      return <DropdownComponent component={component} {...props} />
    case "description":
      return <DescriptionComponent component={component} {...props} />
    case "image":
      return <ImageComponent component={component} {...props} />
    case "link":
      return <LinkComponent component={component} {...props} />
    case "form_heading":
      return <FormHeadingComponent component={component} {...props} />
    case "section_heading":
      return <SectionHeadingComponent component={component} {...props} />
    case "sub_heading":
      return <SubHeadingComponent component={component} {...props} />
    case "divider":
      return <DividerComponent component={component} {...props} />
    case "spacer":
      return <SpacerComponent component={component} {...props} />
    case "submit":
      return <SubmitComponent component={component} {...props} />
    case "page_break":
      return <PageBreakComponent component={component} {...props} />
    default:
      return <div>Unknown component type: {component.type}</div>
  }
}

function ComponentWrapper({
  component,
  children,
  onDelete,
}: {
  component: FormComponent
  children: React.ReactNode
  onDelete?: (componentId: string) => void
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="relative group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {children}
      {isHovered && onDelete && (
        <Button
          variant="destructive"
          size="icon"
          className="absolute -top-3 -right-3 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(component.id)
          }}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete component</span>
        </Button>
      )}
    </div>
  )
}

function TextComponent({ component, isEditing, onDelete, onValueChange, value }: ExtendedRenderComponentProps) {
  return (
    <ComponentWrapper component={component} onDelete={onDelete}>
      <div className="space-y-2">
        <Label htmlFor={component.id}>
          {component.label}
          {component.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {component.description && <p className="text-sm text-muted-foreground">{component.description}</p>}
        <Input
          id={component.id}
          placeholder={component.placeholder}
          disabled={isEditing}
          value={value || ""}
          onChange={(e) => onValueChange?.(e.target.value)}
        />
      </div>
    </ComponentWrapper>
  )
}

function ParagraphComponent({ component, isEditing, onDelete, onValueChange, value }: ExtendedRenderComponentProps) {
  return (
    <ComponentWrapper component={component} onDelete={onDelete}>
      <div className="space-y-2">
        <Label htmlFor={component.id}>
          {component.label}
          {component.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {component.description && <p className="text-sm text-muted-foreground">{component.description}</p>}
        <Textarea
          id={component.id}
          placeholder={component.placeholder}
          disabled={isEditing}
          value={value || ""}
          onChange={(e) => onValueChange?.(e.target.value)}
        />
      </div>
    </ComponentWrapper>
  )
}

function TextEditorComponent({ component, isEditing, onDelete, onValueChange, value }: ExtendedRenderComponentProps) {
  return (
    <ComponentWrapper component={component} onDelete={onDelete}>
      <div className="space-y-2">
        <Label htmlFor={component.id}>
          {component.label}
          {component.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {component.description && <p className="text-sm text-muted-foreground">{component.description}</p>}
        <div className="border rounded-md p-2 min-h-[100px] bg-background">
          <div className="flex gap-2 border-b pb-2 mb-2">
            <Button variant="outline" size="sm" disabled={isEditing}>
              B
            </Button>
            <Button variant="outline" size="sm" disabled={isEditing}>
              I
            </Button>
            <Button variant="outline" size="sm" disabled={isEditing}>
              U
            </Button>
          </div>
          <div className="min-h-[60px] p-2">
            {isEditing ? (
              "Rich text editor content will appear here"
            ) : (
              <Textarea
                id={component.id}
                placeholder="Enter formatted text here"
                className="border-none p-0 focus-visible:ring-0 resize-none"
                value={value || ""}
                onChange={(e) => onValueChange?.(e.target.value)}
              />
            )}
          </div>
        </div>
      </div>
    </ComponentWrapper>
  )
}

function EmailComponent({ component, isEditing, onDelete, onValueChange, value }: ExtendedRenderComponentProps) {
  return (
    <ComponentWrapper component={component} onDelete={onDelete}>
      <div className="space-y-2">
        <Label htmlFor={component.id}>
          {component.label}
          {component.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {component.description && <p className="text-sm text-muted-foreground">{component.description}</p>}
        <Input
          id={component.id}
          type="email"
          placeholder={component.placeholder}
          disabled={isEditing}
          value={value || ""}
          onChange={(e) => onValueChange?.(e.target.value)}
        />
      </div>
    </ComponentWrapper>
  )
}

function NumberComponent({ component, isEditing, onDelete, onValueChange, value }: ExtendedRenderComponentProps) {
  return (
    <ComponentWrapper component={component} onDelete={onDelete}>
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
          value={value || ""}
          onChange={(e) => onValueChange?.(e.target.valueAsNumber)}
        />
      </div>
    </ComponentWrapper>
  )
}

function PhoneComponent({ component, isEditing, onDelete, onValueChange, value }: ExtendedRenderComponentProps) {
  const [countryCode, phoneNumber] = (value || "+1 ").split(" ", 2)

  const handleCountryChange = (code: string) => {
    onValueChange?.(`${code} ${phoneNumber || ""}`)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange?.(`${countryCode || "+1"} ${e.target.value}`)
  }

  return (
    <ComponentWrapper component={component} onDelete={onDelete}>
      <div className="space-y-2">
        <Label htmlFor={component.id}>
          {component.label}
          {component.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {component.description && <p className="text-sm text-muted-foreground">{component.description}</p>}
        <div className="flex">
          <Select disabled={isEditing} value={countryCode || "+1"} onValueChange={handleCountryChange}>
            <SelectTrigger className="w-[110px] rounded-r-none">
              <SelectValue placeholder="+1" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="+1">+1 (US)</SelectItem>
              <SelectItem value="+44">+44 (UK)</SelectItem>
              <SelectItem value="+91">+91 (IN)</SelectItem>
            </SelectContent>
          </Select>
          <Input
            id={component.id}
            type="tel"
            className="rounded-l-none"
            placeholder={component.placeholder || "Phone number"}
            disabled={isEditing}
            value={phoneNumber || ""}
            onChange={handlePhoneChange}
          />
        </div>
      </div>
    </ComponentWrapper>
  )
}

function SignatureComponent({ component, isEditing, onDelete, onValueChange, value }: ExtendedRenderComponentProps) {
  return (
    <ComponentWrapper component={component} onDelete={onDelete}>
      <div className="space-y-2">
        <Label htmlFor={component.id}>
          {component.label}
          {component.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {component.description && <p className="text-sm text-muted-foreground">{component.description}</p>}
        <div className="border rounded-md p-4 bg-background min-h-[150px] flex items-center justify-center">
          {value ? (
            <div className="text-center font-signature text-2xl">{value}</div>
          ) : (
            <div className="text-center text-muted-foreground">
              <p>Click to sign</p>
              <p className="text-xs">Draw, type, or upload your signature</p>
            </div>
          )}
        </div>
        {!isEditing && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="w-full" onClick={() => onValueChange?.("John Doe")}>
              Type
            </Button>
            <Button variant="outline" size="sm" className="w-full" onClick={() => onValueChange?.("")}>
              Clear
            </Button>
          </div>
        )}
      </div>
    </ComponentWrapper>
  )
}

function DateTimeComponent({ component, isEditing, onDelete, onValueChange, value }: ExtendedRenderComponentProps) {
  const [date, setDate] = useState<Date | undefined>(value ? new Date(value) : undefined)

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate)
    onValueChange?.(newDate?.toISOString())
  }

  return (
    <ComponentWrapper component={component} onDelete={onDelete}>
      <div className="space-y-2">
        <Label htmlFor={component.id}>
          {component.label}
          {component.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {component.description && <p className="text-sm text-muted-foreground">{component.description}</p>}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
              disabled={isEditing}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
          </PopoverContent>
        </Popover>
        {component.config?.enableTime && !isEditing && (
          <div className="flex gap-2">
            <Select disabled={isEditing}>
              <SelectTrigger>
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i} value={`${i + 1}`}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select disabled={isEditing}>
              <SelectTrigger>
                <SelectValue placeholder="Minute" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 4 }, (_, i) => (
                  <SelectItem key={i} value={`${i * 15}`}>
                    {i * 15 === 0 ? "00" : i * 15}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select disabled={isEditing}>
              <SelectTrigger>
                <SelectValue placeholder="AM/PM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="am">AM</SelectItem>
                <SelectItem value="pm">PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </ComponentWrapper>
  )
}

function ChoiceComponent({ component, isEditing, onDelete, onValueChange, value }: ExtendedRenderComponentProps) {
  const options = component.config?.options || []
  const isMultiple = component.config?.multiple || false

  if (isMultiple) {
    const selectedValues = Array.isArray(value) ? value : []

    const handleCheckboxChange = (optionValue: string, checked: boolean) => {
      if (checked) {
        onValueChange?.([...selectedValues, optionValue])
      } else {
        onValueChange?.(selectedValues.filter((v) => v !== optionValue))
      }
    }

    return (
      <ComponentWrapper component={component} onDelete={onDelete}>
        <div className="space-y-3">
          <Label>
            {component.label}
            {component.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {component.description && <p className="text-sm text-muted-foreground">{component.description}</p>}
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${component.id}-${option.value}`}
                  disabled={isEditing}
                  checked={selectedValues.includes(option.value)}
                  onCheckedChange={(checked) => handleCheckboxChange(option.value, !!checked)}
                />
                <Label htmlFor={`${component.id}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        </div>
      </ComponentWrapper>
    )
  }

  return (
    <ComponentWrapper component={component} onDelete={onDelete}>
      <div className="space-y-3">
        <Label>
          {component.label}
          {component.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {component.description && <p className="text-sm text-muted-foreground">{component.description}</p>}
        <RadioGroup disabled={isEditing} value={value} onValueChange={onValueChange}>
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
    </ComponentWrapper>
  )
}

function SingleCheckboxComponent({
  component,
  isEditing,
  onDelete,
  onValueChange,
  value,
}: ExtendedRenderComponentProps) {
  return (
    <ComponentWrapper component={component} onDelete={onDelete}>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox id={component.id} disabled={isEditing} checked={!!value} onCheckedChange={onValueChange} />
          <Label htmlFor={component.id}>
            {component.config?.text || component.label}
            {component.required && <span className="text-destructive ml-1">*</span>}
          </Label>
        </div>
        {component.description && <p className="text-sm text-muted-foreground">{component.description}</p>}
      </div>
    </ComponentWrapper>
  )
}

function MultipleChoiceComponent({
  component,
  isEditing,
  onDelete,
  onValueChange,
  value,
}: ExtendedRenderComponentProps) {
  const options = component.config?.options || []

  return (
    <ComponentWrapper component={component} onDelete={onDelete}>
      <div className="space-y-3">
        <Label>
          {component.label}
          {component.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {component.description && <p className="text-sm text-muted-foreground">{component.description}</p>}
        <RadioGroup disabled={isEditing} value={value} onValueChange={onValueChange}>
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
    </ComponentWrapper>
  )
}

function CheckboxesComponent({ component, isEditing, onDelete, onValueChange, value }: ExtendedRenderComponentProps) {
  const options = component.config?.options || []
  const selectedValues = Array.isArray(value) ? value : []

  const handleCheckboxChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onValueChange?.([...selectedValues, optionValue])
    } else {
      onValueChange?.(selectedValues.filter((v) => v !== optionValue))
    }
  }

  return (
    <ComponentWrapper component={component} onDelete={onDelete}>
      <div className="space-y-3">
        <Label>
          {component.label}
          {component.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {component.description && <p className="text-sm text-muted-foreground">{component.description}</p>}
        <div className="space-y-2">
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`${component.id}-${option.value}`}
                disabled={isEditing}
                checked={selectedValues.includes(option.value)}
                onCheckedChange={(checked) => handleCheckboxChange(option.value, !!checked)}
              />
              <Label htmlFor={`${component.id}-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </div>
      </div>
    </ComponentWrapper>
  )
}

function DropdownComponent({ component, isEditing, onDelete, onValueChange, value }: ExtendedRenderComponentProps) {
  const options = component.config?.options || []

  return (
    <ComponentWrapper component={component} onDelete={onDelete}>
      <div className="space-y-2">
        <Label htmlFor={component.id}>
          {component.label}
          {component.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {component.description && <p className="text-sm text-muted-foreground">{component.description}</p>}
        <Select disabled={isEditing} value={value} onValueChange={onValueChange}>
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
    </ComponentWrapper>
  )
}

function DescriptionComponent({ component, onDelete }: ExtendedRenderComponentProps) {
  return (
    <ComponentWrapper component={component} onDelete={onDelete}>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">{component.label}</h3>
        <div className="text-sm">{component.config?.text}</div>
      </div>
    </ComponentWrapper>
  )
}

function ImageComponent({ component, onDelete }: ExtendedRenderComponentProps) {
  return (
    <ComponentWrapper component={component} onDelete={onDelete}>
      <div className="space-y-2">
        <div className="border rounded-md p-4 flex flex-col items-center justify-center">
          {component.config?.url ? (
            <img
              src={component.config.url || "/placeholder.svg"}
              alt={component.config.text || component.label}
              className="max-w-full max-h-[300px] object-contain"
            />
          ) : (
            <div className="w-full h-[200px] bg-muted flex items-center justify-center text-muted-foreground">
              Image placeholder
            </div>
          )}
          {component.config?.text && <p className="text-sm text-muted-foreground mt-2">{component.config.text}</p>}
        </div>
      </div>
    </ComponentWrapper>
  )
}

function LinkComponent({ component, onDelete }: ExtendedRenderComponentProps) {
  return (
    <ComponentWrapper component={component} onDelete={onDelete}>
      <div className="space-y-2">
        <a
          href={component.config?.url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {component.config?.text || component.label}
        </a>
        {component.description && <p className="text-sm text-muted-foreground">{component.description}</p>}
      </div>
    </ComponentWrapper>
  )
}

function FormHeadingComponent({ component, onDelete }: ExtendedRenderComponentProps) {
  const size = component.config?.size || "xl"

  return (
    <ComponentWrapper component={component} onDelete={onDelete}>
      <div className="space-y-2">
        {size === "xl" && <h1 className="text-3xl font-bold">{component.config?.text || component.label}</h1>}
        {size === "lg" && <h1 className="text-2xl font-bold">{component.config?.text || component.label}</h1>}
        {size === "md" && <h1 className="text-xl font-bold">{component.config?.text || component.label}</h1>}
      </div>
    </ComponentWrapper>
  )
}

function SectionHeadingComponent({ component, onDelete }: ExtendedRenderComponentProps) {
  const size = component.config?.size || "lg"

  return (
    <ComponentWrapper component={component} onDelete={onDelete}>
      <div className="space-y-2">
        {size === "lg" && <h2 className="text-xl font-semibold">{component.config?.text || component.label}</h2>}
        {size === "md" && <h2 className="text-lg font-semibold">{component.config?.text || component.label}</h2>}
        {size === "sm" && <h2 className="text-base font-semibold">{component.config?.text || component.label}</h2>}
      </div>
    </ComponentWrapper>
  )
}

function SubHeadingComponent({ component, onDelete }: ExtendedRenderComponentProps) {
  const size = component.config?.size || "md"

  return (
    <ComponentWrapper component={component} onDelete={onDelete}>
      <div className="space-y-2">
        {size === "md" && <h3 className="text-lg font-medium">{component.config?.text || component.label}</h3>}
        {size === "sm" && <h3 className="text-base font-medium">{component.config?.text || component.label}</h3>}
        {size === "xs" && <h3 className="text-sm font-medium">{component.config?.text || component.label}</h3>}
      </div>
    </ComponentWrapper>
  )
}

function DividerComponent({ component, onDelete }: ExtendedRenderComponentProps) {
  const style = component.config?.style || "solid"

  return (
    <ComponentWrapper component={component} onDelete={onDelete}>
      <div className="py-2">
        {style === "solid" && <Separator />}
        {style === "dashed" && <Separator className="border-dashed" />}
        {style === "dotted" && <Separator className="border-dotted" />}
      </div>
    </ComponentWrapper>
  )
}

function SpacerComponent({ component, onDelete }: ExtendedRenderComponentProps) {
  const height = component.config?.height || "md"

  return (
    <ComponentWrapper component={component} onDelete={onDelete}>
      <div>
        {height === "xs" && <div className="h-2"></div>}
        {height === "sm" && <div className="h-4"></div>}
        {height === "md" && <div className="h-8"></div>}
        {height === "lg" && <div className="h-12"></div>}
        {height === "xl" && <div className="h-16"></div>}
      </div>
    </ComponentWrapper>
  )
}

function SubmitComponent({ component, onDelete }: ExtendedRenderComponentProps) {
  const style = component.config?.style || "primary"

  return (
    <ComponentWrapper component={component} onDelete={onDelete}>
      <div className="py-2">
        {style === "primary" && <Button className="w-full">{component.config?.text || "Submit"}</Button>}
        {style === "outline" && (
          <Button variant="outline" className="w-full">
            {component.config?.text || "Submit"}
          </Button>
        )}
        {style === "secondary" && (
          <Button variant="secondary" className="w-full">
            {component.config?.text || "Submit"}
          </Button>
        )}
      </div>
    </ComponentWrapper>
  )
}

function PageBreakComponent({ component, onDelete }: ExtendedRenderComponentProps) {
  return (
    <ComponentWrapper component={component} onDelete={onDelete}>
      <div className="py-4 border-t-2 border-b-2 border-dashed border-primary/50 my-4">
        <div className="flex justify-between">
          <Button variant="outline">{component.config?.prevButtonText || "Previous"}</Button>
          <div className="text-sm font-medium">Page Break</div>
          <Button>{component.config?.nextButtonText || "Next"}</Button>
        </div>
      </div>
    </ComponentWrapper>
  )
}
