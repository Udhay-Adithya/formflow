"use client"

import type React from "react"

import { useRef, useState } from "react"
import { toast } from "sonner"
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
import { copyToClipboard } from "@/lib/utils"

interface ShareFormDialogProps {
    formData: FormData
    trigger?: React.ReactNode
}

export function ShareFormDialog({ formData, trigger }: ShareFormDialogProps) {
    const [copied, setCopied] = useState(false)
    const [activeTab, setActiveTab] = useState<"link" | "email">("link")
    const linkInputRef = useRef<HTMLInputElement>(null)
    const [emailRecipients, setEmailRecipients] = useState("")
    const [emailMessage, setEmailMessage] = useState("")

    // Generate the shareable link
    const shareableLink =
        typeof window !== "undefined" ? `${window.location.origin}/form/${formData.id}` : `/form/${formData.id}`

    const handleCopyLink = async () => {
        if (await copyToClipboard(shareableLink)) {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
            toast.success("Link copied to clipboard")
        } else {
            // Last resort: select the link so the user can copy it manually
            linkInputRef.current?.select()
            toast.error("Couldn't copy automatically. The link is selected; press Ctrl/Cmd+C.")
        }
    }

    // The native share sheet (navigator.share) is only available on secure origins; otherwise copy the link
    const handleNativeShare = async () => {
        if (typeof navigator.share === "function") {
            try {
                await navigator.share({ title: formData.title, text: formData.description, url: shareableLink })
            } catch {
                // User dismissed the share sheet
            }
            return
        }
        await handleCopyLink()
    }

    // No email service on the backend, so hand off to the user's email app with a prefilled draft
    const handleSendEmail = (e: React.FormEvent) => {
        e.preventDefault()
        const recipients = emailRecipients
            .split(",")
            .map((address) => address.trim())
            .filter(Boolean)
            .join(",")
        const body = `${emailMessage || "I'd like to share this form with you."}\n\n${shareableLink}`
        const subject = `Please fill out: ${formData.title}`
        window.location.href = `mailto:${recipients}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
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
                                <Input
                                    id="link"
                                    ref={linkInputRef}
                                    value={shareableLink}
                                    readOnly
                                    className="flex-1"
                                    onFocus={(e) => e.target.select()}
                                />
                                <Button size="icon" onClick={handleCopyLink} aria-label="Copy link">
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
                                    onClick={handleNativeShare}
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
                                <Label htmlFor="share-email">Email Addresses</Label>
                                <Input
                                    id="share-email"
                                    placeholder="email@example.com, email2@example.com"
                                    value={emailRecipients}
                                    onChange={(e) => setEmailRecipients(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">Separate multiple email addresses with commas.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="share-message">Message (Optional)</Label>
                                <Textarea
                                    id="share-message"
                                    placeholder="I'd like to share this form with you..."
                                    rows={3}
                                    value={emailMessage}
                                    onChange={(e) => setEmailMessage(e.target.value)}
                                />
                            </div>

                            <Button type="submit" className="w-full">
                                <Mail className="h-4 w-4 mr-2" />
                                Open in Email App
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
