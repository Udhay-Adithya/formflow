"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  CheckCircle2,
  DropletsIcon as DragDropIcon,
  FileJson,
  Layers,
  LayoutGrid,
  Sparkles,
  Wand2,
  FileText,
} from "lucide-react"
import { useTheme } from "next-themes"
import { ModeToggle } from "@/components/mode-toggle"

export function LandingPage() {
  const { theme } = useTheme()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-card py-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-md p-1">
              <Layers className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">FormFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#templates" className="text-muted-foreground hover:text-foreground transition-colors">
                Templates
              </Link>
              <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <Link href="/auth">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/auth?tab=signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Create beautiful forms with <span className="text-primary">intuitive</span> drag & drop
              </h1>
              <p className="text-xl text-muted-foreground">
                FormFlow makes it easy to build, share, and analyze forms with a powerful no-code interface.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/auth?tab=signup">
                  <Button size="lg" className="gap-2">
                    Start Building <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline">
                    View Templates
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-full h-full rounded-lg bg-primary/20 transform rotate-3"></div>
                <div className="relative bg-card border rounded-lg shadow-lg overflow-hidden">
                  <div className="p-4 border-b bg-muted/50">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-destructive/70"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
                      <div className="ml-4 text-sm font-medium">FormFlow Builder</div>
                    </div>
                  </div>
                  <div className="p-6">
                    <img
                      src="/placeholder.svg?height=300&width=500"
                      alt="FormFlow Builder Interface"
                      className="w-full rounded border"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create professional forms without writing a single line of code.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<DragDropIcon />}
              title="Drag & Drop Builder"
              description="Easily build forms by dragging and dropping components exactly where you want them."
            />
            <FeatureCard
              icon={<LayoutGrid />}
              title="50+ Form Components"
              description="Choose from a wide variety of form components to create the perfect form for your needs."
            />
            <FeatureCard
              icon={<Wand2 />}
              title="AI Form Generation"
              description="Generate complete forms instantly using AI based on text prompts or images."
            />
            <FeatureCard
              icon={<FileJson />}
              title="JSON Import/Export"
              description="Easily import and export forms as JSON for backup or sharing with your team."
            />
            <FeatureCard
              icon={<Sparkles />}
              title="Beautiful Templates"
              description="Start with professionally designed templates for common use cases and customize them."
            />
            <FeatureCard
              icon={<CheckCircle2 />}
              title="Form Validation"
              description="Add validation rules to ensure you collect accurate and complete data."
            />
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-20 bg-secondary/20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Ready-to-Use Templates</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started quickly with our professionally designed templates for common use cases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TemplateCard
              title="Customer Feedback"
              description="Collect valuable feedback from your customers to improve your products and services."
              category="Business"
              fields={8}
            />
            <TemplateCard
              title="Event Registration"
              description="Make it easy for attendees to register for your upcoming events."
              category="Events"
              fields={12}
            />
            <TemplateCard
              title="Job Application"
              description="Streamline your hiring process with a comprehensive job application form."
              category="HR"
              fields={15}
            />
          </div>

          <div className="text-center mt-12">
            <Link href="/dashboard">
              <Button size="lg">View All Templates</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that works best for you and your team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              title="Free"
              price="$0"
              description="Perfect for individuals just getting started"
              features={["Up to 5 forms", "100 submissions/month", "Basic components", "Email support"]}
            />
            <PricingCard
              title="Pro"
              price="$19"
              description="Great for professionals and small teams"
              features={[
                "Unlimited forms",
                "1,000 submissions/month",
                "All components",
                "Priority support",
                "Remove FormFlow branding",
              ]}
              highlighted
            />
            <PricingCard
              title="Enterprise"
              price="$49"
              description="For organizations with advanced needs"
              features={[
                "Unlimited forms",
                "Unlimited submissions",
                "All components",
                "Dedicated support",
                "Custom branding",
                "Advanced analytics",
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to start building amazing forms?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of users who are already creating beautiful forms with FormFlow.
          </p>
          <Link href="/auth?tab=signup">
            <Button size="lg" variant="secondary" className="gap-2">
              Get Started for Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary rounded-md p-1">
                  <Layers className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold">FormFlow</span>
              </div>
              <p className="text-muted-foreground max-w-xs">
                Create, share, and analyze forms with our intuitive drag & drop form builder.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-medium mb-4">Product</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#templates" className="text-muted-foreground hover:text-foreground transition-colors">
                      Templates
                    </Link>
                  </li>
                  <li>
                    <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Tutorials
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-4">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Privacy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">© 2025 FormFlow. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

function TemplateCard({
  title,
  description,
  category,
  fields,
}: {
  title: string
  description: string
  category: string
  fields: number
}) {
  return (
    <div className="bg-card border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-48 bg-muted flex items-center justify-center">
        <FileText className="h-16 w-16 text-muted-foreground/50" />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-medium">{title}</h3>
          <span className="text-xs bg-secondary px-2 py-1 rounded-full">{category}</span>
        </div>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{fields} fields</span>
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              Use Template
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function PricingCard({
  title,
  price,
  description,
  features,
  highlighted = false,
}: {
  title: string
  price: string
  description: string
  features: string[]
  highlighted?: boolean
}) {
  return (
    <div
      className={`bg-card border rounded-lg p-8 ${
        highlighted ? "ring-2 ring-primary shadow-lg scale-105" : ""
      } flex flex-col h-full`}
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <div className="flex items-end gap-1 mb-2">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-muted-foreground mb-1">/month</span>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link href="/auth?tab=signup" className="mt-auto">
        <Button className="w-full" variant={highlighted ? "default" : "outline"}>
          {highlighted ? "Get Started" : "Choose Plan"}
        </Button>
      </Link>
    </div>
  )
}
