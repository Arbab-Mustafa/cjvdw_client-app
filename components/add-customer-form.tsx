"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { OnScreenKeyboard } from "./on-screen-keyboard"
import { useCustomers } from "@/context/customer-context"
import { toast } from "sonner"

interface AddCustomerFormProps {
  onSuccess: (customer: { id: string; name: string }) => void
  onCancel: () => void
}

export function AddCustomerForm({ onSuccess, onCancel }: AddCustomerFormProps) {
  const { addCustomer } = useCustomers()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [mobile, setMobile] = useState("")
  const [email, setEmail] = useState("")
  const [activeField, setActiveField] = useState<"firstName" | "lastName" | "mobile" | "email" | null>(null)

  const handleKeyPress = (key: string) => {
    if (!activeField) return

    const updateField = (field: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
      if (key === "backspace") {
        setter(field.slice(0, -1))
      } else if (key === "space") {
        setter(field + " ")
      } else if (key === "clear") {
        setter("")
      } else {
        setter(field + key)
      }
    }

    switch (activeField) {
      case "firstName":
        updateField(firstName, setFirstName)
        break
      case "lastName":
        updateField(lastName, setLastName)
        break
      case "mobile":
        // Only allow numbers and spaces for mobile
        if (key === "backspace" || key === "clear" || key === "space" || /^[0-9]$/.test(key)) {
          updateField(mobile, setMobile)
        }
        break
      case "email":
        updateField(email, setEmail)
        break
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!firstName.trim()) {
      toast.error("First name is required")
      return
    }

    if (!mobile.trim()) {
      toast.error("Mobile number is required")
      return
    }

    // Create full name
    const fullName = `${firstName} ${lastName}`.trim()

    // Add customer
    const customerId = addCustomer({
      name: fullName,
      mobile: mobile,
      email: email,
      active: true,
    })

    toast.success(`Customer ${fullName} added successfully`)
    onSuccess({ id: customerId, name: fullName })
  }

  return (
    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-semibold">Add New Customer</h2>
        <Button variant="ghost" size="icon" onClick={onCancel} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 flex-1 overflow-y-auto">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onFocus={() => setActiveField("firstName")}
                className="border-pink-200"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onFocus={() => setActiveField("lastName")}
                className="border-pink-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number *</Label>
            <Input
              id="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              onFocus={() => setActiveField("mobile")}
              className="border-pink-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setActiveField("email")}
              className="border-pink-200"
            />
          </div>
        </div>

        {activeField && (
          <div className="mt-4 border-t pt-4">
            <OnScreenKeyboard onKeyPress={handleKeyPress} />
          </div>
        )}

        <div className="mt-6 flex gap-2">
          <Button type="submit" className="flex-1 bg-pink-600 hover:bg-pink-700">
            Add Customer
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
