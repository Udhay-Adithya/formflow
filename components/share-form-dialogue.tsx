"use client"

import type React from "react"

import { useState } from "react"
import { Check, Copy, Link, Mail, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import type { FormData } from "@/lib/types"

interface ShareFormDialogProps {
    formData: FormData
    trigger?: React.ReactNode
}

export function ShareFormDialog({ formData, trigger }: ShareFormDialogProps) {
    const [copied, setCopied] = useState(false)
    const [activeTab, setActiveTab] = useState<"link" | "email">("link")

    // Generate the shareable link
    const shareableLink =
        typeof window !== "undefined" ? `${window.location.origin}/form/${formData.id}` : `/form/${formData.id}`

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareableLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleSendEmail = (e: React.FormEvent) => {
        e.preventDefault()
        // In a real app, this would send the email
        console.log("Email sharing functionality would go here")
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" className="gap-1">
                        <Share2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Share</span>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share Form</DialogTitle>
                    <DialogDescription>Share your form with others to collect responses.</DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="link" value={activeTab} onValueChange={(value) => setActiveTab(value as "link" | "email")}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="link">Share Link</TabsTrigger>
                        <TabsTrigger value="email">Email</TabsTrigger>
                    </TabsList>

                    <TabsContent value="link" className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="link">Shareable Link</Label>
                            <div className="flex items-center space-x-2">
                                <Input id="link" value={shareableLink} readOnly className="flex-1" />
                                <Button size="icon" onClick={handleCopyLink}>
                                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Anyone with this link will be able to view and submit this form.
                            </p>

                            <div className="flex gap-2 mt-4">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => {
                                        if (navigator.share) {
                                            navigator.share({
                                                title: formData.title,
                                                text: formData.description,
                                                url: shareableLink,
                                            })
                                        }
                                    }}
                                >
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Share
                                </Button>

                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => {
                                        window.open(
                                            `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareableLink)}&text=${encodeURIComponent(`Check out my form: ${formData.title}`)}`,
                                            "_blank",
                                        )
                                    }}
                                >
                                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                    Tweet
                                </Button>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="email" className="space-y-4 py-4">
                        <form onSubmit={handleSendEmail} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Addresses</Label>
                                <Input id="email" placeholder="email@example.com, email2@example.com" />
                                <p className="text-xs text-muted-foreground">Separate multiple email addresses with commas.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Message (Optional)</Label>
                                <Textarea id="message" placeholder="I'd like to share this form with you..." rows={3} />
                            </div>

                            <Button type="submit" className="w-full">
                                <Mail className="h-4 w-4 mr-2" />
                                Send Email
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>

                <DialogFooter className="sm:justify-start">
                    <Button
                        variant="secondary"
                        onClick={() => {
                            window.open(shareableLink, "_blank")
                        }}
                    >
                        <Link className="h-4 w-4 mr-2" />
                        Open Form
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
