import type { Metadata } from "next"
import DashboardHeader from "@/components/dashboard-header"
import ServiceManagement from "@/components/service-management"
import ProtectedRoute from "@/components/protected-route"

export const metadata: Metadata = {
  title: "Services | Gem 'n' Eyes EPOS",
  description: "Service management for Gem 'n' Eyes beauty salon",
}

export default function ServicesPage() {
  return (
    <ProtectedRoute allowedRoles={["owner"]}>
      <div className="min-h-screen bg-pink-50">
        <DashboardHeader />
        <main className="container mx-auto p-4 pt-24">
          <h1 className="text-2xl font-bold text-pink-800 mb-6">Service Management</h1>
          <ServiceManagement />
        </main>
      </div>
    </ProtectedRoute>
  )
}
