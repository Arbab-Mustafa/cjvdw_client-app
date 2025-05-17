import type React from "react"
import DashboardHeader from "@/components/dashboard-header"
import ProtectedRoute from "@/components/protected-route"

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <main className="flex-1 pt-16 md:pt-4">{children}</main>
      </div>
    </ProtectedRoute>
  )
}
