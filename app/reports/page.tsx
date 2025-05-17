import type { Metadata } from "next"
import DashboardHeader from "@/components/dashboard-header"
import ReportsInterface from "@/components/reports-interface"
import ProtectedRoute from "@/components/protected-route"

export const metadata: Metadata = {
  title: "Reports | Gem 'n' Eyes EPOS",
  description: "Reports for Gem 'n' Eyes beauty salon",
}

export default function ReportsPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "therapist", "manager"]}>
      <div className="min-h-screen bg-pink-50">
        <DashboardHeader />
        <main className="container mx-auto p-4 pt-24">
          <h1 className="text-2xl font-bold text-pink-800 mb-6">Reports</h1>
          <ReportsInterface />
        </main>
      </div>
    </ProtectedRoute>
  )
}
