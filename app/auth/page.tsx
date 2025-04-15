import { Suspense } from "react"
import { AuthPage } from "@/components/auth-page"

export default function AuthenticationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthPage />
    </Suspense>
  )
}
