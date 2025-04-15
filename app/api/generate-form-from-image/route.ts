// app/api/generate-form-from-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { generateId } from '@/lib/utils';
import { FormData } from '@/lib/types';

// Initialize Gemini API
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY!);

// Safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;
    const additionalPrompt = formData.get('prompt') as string || '';
    
    if (!imageFile) {
      return NextResponse.json(
        { error: 'Image file is required' },
        { status: 400 }
      );
    }

    console.log('Image file type:', imageFile.type);
    console.log('Image file size:', imageFile.size);

    // Convert image to bytes
    const imageBytes = await imageFile.arrayBuffer();
    
    // Generate form using Gemini
    const generatedFormData = await generateFormFromImage(
      new Uint8Array(imageBytes),
      imageFile.type,
      additionalPrompt
    );
    
    return NextResponse.json({ formData: generatedFormData });
  } catch (error: any) {
    console.error('Error generating form from image:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate form from image' },
      { status: 500 }
    );
  }
}

async function generateFormFromImage(
  imageData: Uint8Array, 
  mimeType: string,
  additionalPrompt: string
): Promise<FormData> {
  try {
    // Use gemini-pro-vision model which is specifically designed for image processing
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    // Construct system prompt
    const systemPrompt = `
You are a smart AI that converts form images into structured digital form schema in JSON format.

Analyze the uploaded image and generate an accurate digital form based on the visual structure, content, and any user-provided context.

---

🧠 Instructions:

1. Carefully review the image layout and identify form components: headings, input fields, checkboxes, etc.
2. Infer appropriate field types based on labels or input types (e.g., email, date, text, checkbox).
3. Assign each field a unique \`id\`. Do not reuse or repeat IDs. You may use any placeholder pattern like \`field_1\`, \`field_name_x1\`, or UUID-style values.
4. Maintain the correct order of appearance using the \`order\` field (start from 0).
5. Add appropriate \`label\`, \`placeholder\`, and set \`required\` as true if the image indicates it's mandatory (e.g., marked with * or bold).
6. Provide metadata for the form: \`title\`, \`description\`, and \`settings\`.
7. Only return **clean and valid JSON**. No markdown, no explanations, no formatting.

---

📦 Expected JSON Structure:

{
  "id": "form-unique-id",
  "title": "Title inferred from the form image",
  "description": "Brief description of what the form does",
  "settings": {
    "requiresLogin": false,
    "confirmationMessage": "Thank you for submitting!",
    "allowMultipleSubmissions": true
  },
  "fields": [
    {
      "id": "unique-field-id",
      "type": "text | email | number | checkbox | multiple_choice | dropdown | date_time | paragraph | description | form_heading | section_heading | submit",
      "order": 0,
      "label": "Descriptive label based on the form",
      "description": "Optional hint or description",
      "required": true,
      "placeholder": "Enter your response here"
    }
  ]
}

---

🚫 Do not:
- Include markdown formatting or explanation.
- Repeat IDs.
- Return anything other than valid JSON.

${additionalPrompt ? `\n User Prompt: ${additionalPrompt}` : ''}
`;


    // Make sure to use the correct mime type from the uploaded file
    // Gemini API requires proper mime type for image handling
    const actualMimeType = mimeType || 'image/jpeg';
    
    console.log('Using MIME type:', actualMimeType);
    
    // Create parts with both image and text
    const imageObject = {
      inlineData: {
        mimeType: actualMimeType,
        data: Buffer.from(imageData).toString('base64')
      }
    };
    
    const textPart = { text: systemPrompt };
    
    console.log('Sending request to Gemini API...');
    
    // Some Gemini models have specific ways of handling multimodal input
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [imageObject, textPart]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 4096,
      },
      safetySettings,
    });

    const responseText = result.response.text();
    console.log('Response received, length:', responseText.length);
    
    // Extract the JSON object - looking for anything that looks like JSON
    const jsonMatch = responseText.match(/(\{[\s\S]*\})/);
    const jsonStr = jsonMatch ? jsonMatch[0] : responseText;
    
    try {
      const parsedResponse = JSON.parse(jsonStr);
      
      // Add generated ID if not present
      if (!parsedResponse.id) {
        parsedResponse.id = generateId();
      }
      
      // Make sure fields have IDs
      if (parsedResponse.fields) {
        parsedResponse.fields = parsedResponse.fields.map((field: any, index: number) => ({
          ...field,
          id: field.id || generateId(),
          order: index,
        }));
      }
      
      return parsedResponse;
    } catch (e) {
      console.error('Failed to parse Gemini response:', e);
      console.log('Raw response text:', responseText);
      // Return a basic form if parsing fails
      return createFallbackForm(additionalPrompt || 'Image-based form');
    }
  } catch (error: any) {
    console.error('Error in generateFormFromImage:', error);
    // Be more specific about the error
    if (error.message.includes('did not match the expected pattern')) {
      throw new Error('The image format is not supported. Please try a different image or format (JPG or PNG recommended).');
    }
    throw error;
  }
}

function createFallbackForm(prompt: string): FormData {
  return {
    id: generateId(),
    title: `Form from Image`,
    description: prompt,
    settings: {
      requiresLogin: false,
      confirmationMessage: "Thank you for your submission!",
      allowMultipleSubmissions: true,
    },
    fields: [
      {
        id: generateId(),
        type: "form_heading",
        order: 0,
        label: "Form Heading",
        config: {
          text: "Generated Form from Image",
        },
      },
      {
        id: generateId(),
        type: "text",
        order: 1,
        label: "Name",
        required: true,
        placeholder: "Enter your name",
      },
      {
        id: generateId(),
        type: "email",
        order: 2,
        label: "Email",
        required: true,
        placeholder: "Enter your email",
      },
      {
        id: generateId(),
        type: "submit",
        order: 3,
        label: "Submit Button",
        config: {
          text: "Submit",
        },
      },
    ],
  };
}