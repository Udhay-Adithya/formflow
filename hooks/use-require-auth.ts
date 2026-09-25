"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { getAuthToken } from "@/lib/api"

export function loginPath(next: string) {
  return `/auth?next=${encodeURIComponent(next)}`
}

/**
 * Client-side guard for signed-in pages: sends visitors without a token to the
 * sign-in page and back here afterwards. Returns true once a token is present.
 * The backend still enforces auth on every request; this only improves UX.
 */
export function useRequireAuth() {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    if (getAuthToken()) {
      setIsAuthed(true)
    } else {
      router.replace(loginPath(pathname))
    }
  }, [router, pathname])

  return isAuthed
}
