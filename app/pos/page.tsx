// app/pos/page.tsx
import type { Metadata } from "next";
import DashboardHeader from "@/components/dashboard-header";
import POSInterface from "@/components/pos-interface";
import ProtectedRoute from "@/components/protected-route";

export const metadata: Metadata = {
  title: "Point of Sale | Gem 'n' Eyes EPOS",
  description: "Point of Sale system for Gem 'n' Eyes beauty salon",
};

export default function POSPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "therapist", "manager"]}>
      <div className="min-h-screen bg-pink-50">
        <DashboardHeader />
        <main className="container mx-auto p-4 pt-24">
          <POSInterface />
        </main>
      </div>
    </ProtectedRoute>
  );
}