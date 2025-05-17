import type { Metadata } from "next"
import DashboardHeader from "@/components/dashboard-header"
import CustomerManagement from "@/components/customer-management"
import ProtectedRoute from "@/components/protected-route"

export const metadata: Metadata = {
  title: "Customers | Gem 'n' Eyes EPOS",
  description: "Customer management for Gem 'n' Eyes beauty salon",
}

export default function CustomersPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "therapist", "manager"]}>
      <div className="min-h-screen bg-pink-50">
        <DashboardHeader />
        <main className="container mx-auto p-4 pt-24">
          <h1 className="text-2xl font-bold text-pink-800 mb-6">Customer Management</h1>
          <CustomerManagement />
        </main>
      </div>
    </ProtectedRoute>
  )
}
