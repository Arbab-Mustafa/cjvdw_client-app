"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import ProtectedRoute from "@/components/protected-route"

export default function WelcomePage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect based on user role after a short delay
    const timer = setTimeout(() => {
      if (user) {
        if (user.role === "owner") {
          router.push("/dashboard")
        } else {
          router.push("/pos")
        }
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [user, router])

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-pink-800 mb-2">Welcome, {user?.name}!</h1>
          <p className="text-gray-600">Redirecting you to your dashboard...</p>
        </div>
      </div>
    </ProtectedRoute>
  )
}
