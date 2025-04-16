"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Github, Layers, Mail } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

export function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("signin")
  const router = useRouter()
  const searchParams = useSearchParams()

  // Set active tab based on URL parameter
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "signup") {
      setActiveTab("signup")
    }
  }, [searchParams])

  const handleSignIn = async (
    emailOrEvent: string | React.FormEvent,
    passwordFromArgs?: string
  ): Promise<string | void> => {
    let email: string;
    let password: string;

    if (typeof emailOrEvent === "string") {
      email = emailOrEvent;
      password = passwordFromArgs!;
    } else {
      // Called from form submit
      emailOrEvent.preventDefault();

      const emailInput = document.getElementById("email") as HTMLInputElement;
      const passwordInput = document.getElementById("password") as HTMLInputElement;

      email = emailInput.value;
      password = passwordInput.value;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/auth/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("Login failed: " + (errorData.detail || response.statusText));
        return;
      }

      const data = await response.json();
      const token = data.access_token;

      localStorage.setItem("token", token);
      localStorage.setItem("email", email)
      localStorage.setItem("password", password)
      router.push("/dashboard");

      return token;
    } catch (error) {
      console.error("Login error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };



  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    const firstName = document.getElementById("first-name") as HTMLInputElement;
    const lastName = document.getElementById("last-name") as HTMLInputElement;

    const email = emailInput.value;
    const password = passwordInput.value;
    const fullName = `${firstName.value} ${lastName.value}`;

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          full_name: fullName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("Signup failed: " + (errorData.detail || response.statusText));
        return;
      }

      console.log("Signup successful. Logging in...");


      await handleSignIn(email, password);
    } catch (error) {
      console.error("Signup error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };


  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card py-4">
        <div className="container flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary rounded-md p-1">
              <Layers className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">FormFlow</span>
          </Link>
          <ModeToggle />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <Card>
                <CardHeader>
                  <CardTitle>Sign In</CardTitle>
                  <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="name@example.com" required />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link
                          href="#"
                          className="text-sm text-primary hover:underline"
                          onClick={(e) => e.preventDefault()}
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <Input id="password" type="password" required />
                    </div>
                    <Button type="submit" className="w-full">
                      Sign In
                    </Button>
                  </form>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-card px-2 text-xs text-muted-foreground">OR CONTINUE WITH</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="w-full">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Google
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="justify-center">
                  <p className="text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <button onClick={() => setActiveTab("signup")} className="text-primary hover:underline font-medium">
                      Sign up
                    </button>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Create an Account</CardTitle>
                  <CardDescription>Enter your information to create an account</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First name</Label>
                        <Input id="first-name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last name</Label>
                        <Input id="last-name" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="name@example.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input id="confirm-password" type="password" required />
                    </div>
                    <Button type="submit" className="w-full">
                      Create Account
                    </Button>
                  </form>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-card px-2 text-xs text-muted-foreground">OR CONTINUE WITH</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="w-full">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Google
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="justify-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <button onClick={() => setActiveTab("signin")} className="text-primary hover:underline font-medium">
                      Sign in
                    </button>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 FormFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
