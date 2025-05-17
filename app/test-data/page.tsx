"use client"

import ProtectedRoute from "@/components/protected-route"
import DataInitializer from "@/components/data-initializer"

export default function TestDataPage() {
  return (
    <ProtectedRoute allowedRoles={["owner"]}>
      <div className="container mx-auto px-4 py-8 pt-20">
        <h1 className="text-2xl font-bold text-pink-800 mb-6">Test Data Generator</h1>
        <DataInitializer />
      </div>
    </ProtectedRoute>
  )
}
