"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import type { UserRole } from "@/context/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

// Define route access by role
const ROUTE_ACCESS: Record<string, UserRole[]> = {
  "/dashboard": ["owner"],
  "/users": ["owner"],
  "/services": ["owner"],
  "/pos": ["owner", "therapist", "manager"],
  "/reports": ["owner", "therapist", "manager"],
  "/hours": ["owner"],
  "/test-data": ["owner"],
  "/customers": ["owner", "therapist", "manager"],
  "/consultation-form": ["owner", "therapist", "manager"],
  "/welcome": ["owner", "therapist", "manager"],
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Wait until auth is checked
    if (!isLoading) {
      // If not logged in, redirect to login
      if (!user) {
        router.push("/")
        return
      }

      // Check if the current route has role restrictions
      const routePath = pathname.split("/")[1] // Get the first part of the path
      const routeKey = `/${routePath}`
      const routeRoles = ROUTE_ACCESS[routeKey]

      // If route has restrictions and user's role is not allowed
      if (routeRoles && !routeRoles.includes(user.role)) {
        // Redirect to an appropriate page based on role
        router.push(user.role === "owner" ? "/dashboard" : "/pos")
      }
    }
  }, [user, isLoading, router, pathname])

  // Show nothing while checking auth
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  // If user is not logged in, don't render children
  if (!user) {
    return null
  }

  // If allowedRoles is specified, check if user has permission
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-pink-800 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to view this page.</p>
          <p className="text-gray-600 mt-2">Current role: {user.role}</p>
          <p className="text-gray-600">Allowed roles: {allowedRoles.join(", ")}</p>
        </div>
      </div>
    )
  }

  // User is authenticated and authorized
  return <>{children}</>
}
