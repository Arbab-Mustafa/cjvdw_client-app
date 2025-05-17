import type { Metadata } from "next"
import DashboardHeader from "@/components/dashboard-header"
import DashboardStats from "@/components/dashboard-stats"
import ProtectedRoute from "@/components/protected-route"

export const metadata: Metadata = {
  title: "Dashboard | Gem 'n' Eyes EPOS",
  description: "Therapist dashboard for Gem 'n' Eyes beauty salon",
}

export default function DashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["owner"]}>
      <div className="min-h-screen bg-pink-50">
        <DashboardHeader />
        <main className="container mx-auto p-4 pt-24">
          <DashboardStats />
        </main>
      </div>
    </ProtectedRoute>
  )
}
