"use client"

import ProtectedRoute from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ThankYouPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "therapist", "manager"]}>
      <div className="container mx-auto px-4 py-8 pt-20">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-2" />
            <CardTitle className="text-2xl text-pink-800">Thank You!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p>The consultation form has been submitted successfully.</p>
            <p className="mt-2 text-gray-500">
              This information will help us provide the best possible service tailored to your needs.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/customers">Return to Customers</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
