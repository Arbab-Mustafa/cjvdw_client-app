import { redirect } from "next/navigation"
import LoginForm from "@/components/login-form"

export default function Home() {
  // If user is already logged in, redirect to dashboard
  // This would be replaced with actual auth check
  const isLoggedIn = false

  if (isLoggedIn) {
    redirect("/dashboard")
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  )
}
