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

- **🤖 AI-Powered Generation** – Type a prompt, and AI builds your form!  

- **🧱 50+ Components** – Use rich inputs like text fields, dropdowns, sliders, date pickers, and more.

- **🔗 Shareable Links** – Publish your forms and share with the world instantly.

- **📊 Response Dashboard** – Analyze submissions via charts and tables.

- **📤 Data Export** – Download responses as CSV/JSON or print them.

- **🧬 JSON Templates** – Export and import form structures easily.

- **🎨 Theming** – Toggle between light and dark modes.

- **🖥️ Responsive** – Optimized for all screen sizes.



## 🚀 Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) 
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
*   **Drag & Drop:** [dnd-kit](https://dndkit.com/)
*   **Charts:** [Recharts](https://recharts.org/)
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

### 💻 Run Development Server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

> ⚠️ The app connects to a backend running at `http://127.0.0.1:8000`.

---

## 📁 Project Structure

```
/form_builder
├── app/               # Pages and routes using Next.js App Router
│   ├── (auth)/        # Authentication pages
│   ├── (dashboard)/   # Dashboard UI & pages
│   ├── api/           # API routes (e.g., AI generation)
│   ├── form/          # Form display and submission
│   └── layout.tsx     # Root layout
├── components/        # Reusable React components
│   ├── ui/            # Shadcn UI components
│   └── *.tsx          # Custom components
├── hooks/             # Custom hooks
├── lib/               # Utilities & types
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