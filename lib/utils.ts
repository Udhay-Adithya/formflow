import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { v4 as uuidv4 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return uuidv4();
}

/**
 * Copy text to the clipboard. `navigator.clipboard` only exists on secure origins
 * (https or localhost), so when the app is opened over the local network
 * (e.g. http://192.168.x.x:3000) this falls back to the legacy execCommand("copy").
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === "undefined") return false

  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Permission denied or document not focused: try the fallback below
    }
  }

  const textarea = document.createElement("textarea")
  textarea.value = text
  textarea.setAttribute("readonly", "")
  Object.assign(textarea.style, { position: "fixed", top: "0", left: "0", opacity: "0", pointerEvents: "none" })
  // Open dialogs and menus trap focus, so the textarea must live inside them to be selectable
  const container =
    document.activeElement?.closest('[role="dialog"], [role="alertdialog"], [role="menu"]') ?? document.body
  container.appendChild(textarea)
  try {
    textarea.focus()
    textarea.select()
    textarea.setSelectionRange(0, text.length) // iOS Safari ignores select() alone
    // If a focus trap stole focus, nothing is selected and execCommand would "succeed" copying nothing
    return document.activeElement === textarea && document.execCommand("copy")
  } catch {
    return false
  } finally {
    container.removeChild(textarea)
  }
}