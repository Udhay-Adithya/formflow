import type { FormComponent } from "@/lib/types"

export const componentTypes: FormComponent[] = [
  {
    id: "text-template",
    type: "text",
    order: 0,
    label: "Short text",
    description: "Single line input",
    required: false,
    placeholder: "Enter text here",
  },
  {
    id: "paragraph-template",
    type: "paragraph",
    order: 0,
    label: "Long text",
    description: "Multi-line input",
    required: false,
    placeholder: "Enter text here",
  },
  {
    id: "text-editor-template",
    type: "text_editor",
    order: 0,
    label: "Text editor",
    description: "Text editor that allows formatting",
    required: false,
  },
  {
    id: "number-template",
    type: "number",
    order: 0,
    label: "Number",
    description: "Input field that only allows numbers",
    required: false,
    placeholder: "Enter a number",
    validation: {
      min: 0,
      max: 100,
    },
  },
  {
    id: "email-template",
    type: "email",
    order: 0,
    label: "Email",
    description: "Input field that expects an email",
    required: false,
    placeholder: "Enter your email",
  },
  {
    id: "phone-template",
    type: "phone",
    order: 0,
    label: "Phone",
    description: "Phone number with country selector",
    required: false,
    placeholder: "Enter your phone number",
  },
  {
    id: "signature-template",
    type: "signature",
    order: 0,
    label: "Signature",
    description: "Draw, type or upload signature",
    required: false,
  },
  {
    id: "date-time-template",
    type: "date_time",
    order: 0,
    label: "Date & Time",
    description: "Date and time picker",
    required: false,
    config: {
      enableTime: true,
      enableDate: true,
    },
  },
  {
    id: "choice-template",
    type: "choice",
    order: 0,
    label: "Choice",
    description: "Single or multiple choice selection",
    required: false,
    config: {
      options: [
        { label: "Option 1", value: "option_1" },
        { label: "Option 2", value: "option_2" },
        { label: "Option 3", value: "option_3" },
      ],
      multiple: false,
      allowOther: false,
    },
  },
  {
    id: "checkbox-template",
    type: "checkbox",
    order: 0,
    label: "Single Checkbox",
    description: "A single checkbox for agreement",
    required: false,
    config: {
      text: "I agree to the terms and conditions",
    },
  },
  {
    id: "multiple-choice-template",
    type: "multiple_choice",
    order: 0,
    label: "Multiple choice",
    description: "Accept multiple options",
    required: false,
    config: {
      options: [
        { label: "Option 1", value: "option_1" },
        { label: "Option 2", value: "option_2" },
        { label: "Option 3", value: "option_3" },
      ],
      allowOther: false,
    },
  },
  {
    id: "checkboxes-template",
    type: "checkboxes",
    order: 0,
    label: "Checkboxes",
    description: "Select multiple options",
    required: false,
    config: {
      options: [
        { label: "Option 1", value: "option_1" },
        { label: "Option 2", value: "option_2" },
        { label: "Option 3", value: "option_3" },
      ],
      multiple: true,
    },
  },
  {
    id: "dropdown-template",
    type: "dropdown",
    order: 0,
    label: "Dropdown",
    description: "Select from a dropdown list",
    required: false,
    config: {
      options: [
        { label: "Option 1", value: "option_1" },
        { label: "Option 2", value: "option_2" },
        { label: "Option 3", value: "option_3" },
      ],
    },
  },
  {
    id: "description-template",
    type: "description",
    order: 0,
    label: "Paragraph",
    description: "Formattable text",
    config: {
      text: "Add your text here",
    },
  },
  {
    id: "image-template",
    type: "image",
    order: 0,
    label: "Image",
    description: "Display an image",
    config: {
      text: "Image description",
      url: "",
    },
  },
  {
    id: "link-template",
    type: "link",
    order: 0,
    label: "Link",
    description: "Link to another website",
    config: {
      text: "Link text",
      url: "https://example.com",
    },
  },
]

export const pageComponentTypes: FormComponent[] = [
  {
    id: "form-heading-template",
    type: "form_heading",
    order: 0,
    label: "Form Heading",
    description: "Main heading for the form",
    config: {
      text: "Form Heading",
      size: "xl",
    },
  },
  {
    id: "section-heading-template",
    type: "section_heading",
    order: 0,
    label: "Section Heading",
    description: "Heading for a section of the form",
    config: {
      text: "Section Heading",
      size: "lg",
    },
  },
  {
    id: "sub-heading-template",
    type: "sub_heading",
    order: 0,
    label: "Sub Heading",
    description: "Sub-heading for a section",
    config: {
      text: "Sub Heading",
      size: "md",
    },
  },
  {
    id: "divider-template",
    type: "divider",
    order: 0,
    label: "Divider",
    description: "Visual separator between sections",
    config: {
      style: "solid",
    },
  },
  {
    id: "spacer-template",
    type: "spacer",
    order: 0,
    label: "Spacer",
    description: "Add vertical space between components",
    config: {
      height: "md",
    },
  },
  {
    id: "submit-template",
    type: "submit",
    order: 0,
    label: "Submit Button",
    description: "Button to submit the form",
    config: {
      text: "Submit",
      style: "primary",
    },
  },
  {
    id: "page-break-template",
    type: "page_break",
    order: 0,
    label: "Page Break",
    description: "Break the form into multiple pages",
    config: {
      nextButtonText: "Next",
      prevButtonText: "Previous",
    },
  },
]
