export interface FormData {
  id: string
  title: string
  description: string
  settings: {
    requiresLogin: boolean
    confirmationMessage: string
    allowMultipleSubmissions: boolean
  }
  fields: FormComponent[]
}

export interface FormComponent {
  id: string
  type: string
  order: number
  label: string
  description?: string
  required?: boolean
  placeholder?: string
  validation?: {
    pattern?: string
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
  }
  config?: {
    options?: { label: string; value: string }[]
    allowOther?: boolean
    text?: string
    multiple?: boolean
  }
  isNew?: boolean
}

export interface FormSettings {
  requiresLogin: boolean;
  confirmationMessage: string;
  allowMultipleSubmissions: boolean;
  redirectUrl?: string;
  theme?: string;
  submitButtonText?: string;
}

export interface ComponentConfigProps {
  component: FormComponent
  onUpdate: (component: FormComponent) => void
}

export interface RenderComponentProps {
  component: FormComponent
  isEditing?: boolean
  onUpdate?: (component: FormComponent) => void
  onDelete?: (componentId: string) => void
}
