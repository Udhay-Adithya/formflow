<h1 align="center">
  <img src="public/logo/formflow-logo-rounded.svg" height="80" alt="FormFlow logo">
</h1>

<p align="center"><i>Build beautiful forms effortlessly with drag & drop, AI, and real-time analytics 🚀</i></p>

<h4 align="center">
  <a href="https://github.com/Udhay-Adithya/formflow/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/Udhay-Adithya/formflow?style=flat-square" alt="Contributors">
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="MIT License">
  </a>
</h4>


## 🌟 Features

- **🧩 Drag & Drop Builder** – Visually design forms using a modern drag-and-drop interface.

- **🤖 AI-Powered Generation** – Describe a form or upload a photo of one, and Gemini builds it for you.

- **🧱 20+ Components** – Text, email, number, phone, date, choice, checkbox and dropdown fields, plus headings, dividers and page breaks.

- **🔗 Shareable Links** – Publish your forms and share with the world instantly.

- **📊 Response Dashboard** – Live per-question charts, a submissions timeline and a searchable responses table.

- **📤 Data Export** – Download responses as CSV/JSON or print them.

- **📋 Templates & Sample Form** – Start from ready-made templates; new accounts get a sample form.

- **🧬 JSON Templates** – Export and import form structures easily.

- **🎨 Theming** – Toggle between light and dark modes.

- **🖥️ Responsive** – Optimized for all screen sizes.



## 🚀 Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) 
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
*   **Drag & Drop:** [react-dnd](https://react-dnd.github.io/react-dnd/) (add fields) and [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) (reorder fields)
*   **Charts:** [Recharts](https://recharts.org/)
*   **AI:** [Google Gemini](https://ai.google.dev/) via [`@google/genai`](https://www.npmjs.com/package/@google/genai) with structured JSON output
*   **State Management:** React Hooks
*   **Package Manager:** [npm](https://www.npmjs.com/)
*   **Backend API:** [formflow-backend](https://github.com/Udhay-Adithya/formflow_backend)

---

## 🚀 Getting Started

### 📦 Prerequisites

- Node.js (v18+)
- npm

### 🔧 Installation

```bash
git clone https://github.com/Udhay-Adithya/formflow
cd form_builder
npm install
```

### ⚙️ Configure Environment

```bash
cp .env.example .env.local
```

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | FastAPI backend base URL (default `http://127.0.0.1:8000/api/v1`) |
| `GEMINI_API_KEY` | Google Gemini API key for AI generation (server-side only). Get one at [Google AI Studio](https://aistudio.google.com/apikey) |
| `GEMINI_MODEL` | Optional Gemini model override (default `gemini-3.8-flash`) |

### 💻 Run Development Server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

> ⚠️ The [backend](https://github.com/Udhay-Adithya/formflow_backend) must be running, and its `CORS_ORIGINS` must include this app's URL.

---

## 📁 Project Structure

```
/form_builder
├── app/               # Pages and routes using Next.js App Router
│   ├── auth/          # Sign in / sign up
│   ├── builder/       # Form builder (/builder creates, /builder/[formId] edits)
│   ├── dashboard/     # Forms list and per-form responses dashboard
│   ├── api/           # AI generation route handlers (server-side)
│   ├── form/          # Public form display and submission
│   └── layout.tsx     # Root layout
├── components/        # Reusable React components
│   ├── ui/            # Shadcn UI components
│   └── *.tsx          # Custom components
├── hooks/             # Custom hooks
├── lib/               # Utilities & types
│   ├── api.ts                 # Typed client for the FastAPI backend
│   ├── ai/                    # Gemini form generation (server-only)
│   ├── response-analytics.ts  # Stats, charts and CSV export helpers
│   ├── form-templates.ts      # Starter templates
│   ├── component-config.tsx
│   ├── component-types.ts
│   ├── render-component.tsx
│   └── utils.ts
├── public/            # Static assets
├── styles/            # Global/legacy styles
├── tailwind.config.ts # Tailwind configuration
├── tsconfig.json      # TypeScript config
└── ...
```

---

## 🤝 Contributing

We welcome contributions! Please open issues or submit pull requests for improvements, bug fixes, or new features.

---

## 📄 License

[MIT](https://opensource.org/licenses/MIT)

---