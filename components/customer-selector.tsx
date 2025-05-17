"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, X, Search, Users, UserPlus } from "lucide-react"
import { useCustomers } from "@/context/customer-context"
import { OnScreenKeyboard } from "./on-screen-keyboard"
import { getTopCustomersForTherapist } from "@/data/reports-data"
import { AddCustomerForm } from "./add-customer-form"

interface CustomerSelectorProps {
  onSelect: (customer: { id: string; name: string }) => void
  onClose: () => void
  therapistId: string
}

export function CustomerSelector({ onSelect, onClose, therapistId }: CustomerSelectorProps) {
  const { customers } = useCustomers()
  const [searchQuery, setSearchQuery] = useState("")
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [topCustomers, setTopCustomers] = useState<{ id: string; name: string; count: number }[]>([])
  const [showAddCustomerForm, setShowAddCustomerForm] = useState(false)

  useEffect(() => {
    // Get top customers for this therapist
    const therapistTopCustomers = getTopCustomersForTherapist(therapistId, 10)
    setTopCustomers(therapistTopCustomers)
  }, [therapistId])

  const filteredCustomers = customers
    .filter((customer) => customer.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 20) // Limit to 20 results for performance

  const handleKeyPress = (key: string) => {
    if (key === "backspace") {
      setSearchQuery((prev) => prev.slice(0, -1))
    } else if (key === "space") {
      setSearchQuery((prev) => prev + " ")
    } else if (key === "clear") {
      setSearchQuery("")
    } else {
      setSearchQuery((prev) => prev + key)
    }
  }

  // If showing add customer form, render that instead
  if (showAddCustomerForm) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <AddCustomerForm
          onSuccess={(customer) => {
            onSelect(customer)
            setShowAddCustomerForm(false)
          }}
          onCancel={() => setShowAddCustomerForm(false)}
        />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Select Customer
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search customers..."
              className="pl-8 pr-8 border-pink-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowKeyboard(true)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-5 w-5 text-gray-400"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              variant={showKeyboard ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => setShowKeyboard(!showKeyboard)}
            >
              {showKeyboard ? "Hide Keyboard" : "Show Keyboard"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-pink-200 text-pink-600 hover:bg-pink-50"
              onClick={() => setShowAddCustomerForm(true)}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Customer
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {searchQuery ? (
            <div>
              <h3 className="text-sm font-medium text-gray-500 px-2 py-1">Search Results</h3>
              {filteredCustomers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No customers found</div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {filteredCustomers.map((customer) => (
                    <Button
                      key={customer.id}
                      variant="outline"
                      className="justify-start h-auto py-2 border-pink-100 hover:bg-pink-50"
                      onClick={() => onSelect({ id: customer.id, name: customer.name })}
                    >
                      <User className="mr-2 h-4 w-4 text-pink-600" />
                      <span>{customer.name}</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <h3 className="text-sm font-medium text-gray-500 px-2 py-1">Your Top Customers</h3>
              {topCustomers.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No recent customers</div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {topCustomers.map((customer) => (
                    <Button
                      key={customer.id}
                      variant="outline"
                      className="justify-start h-auto py-2 border-pink-100 hover:bg-pink-50"
                      onClick={() => onSelect({ id: customer.id, name: customer.name })}
                    >
                      <User className="mr-2 h-4 w-4 text-pink-600" />
                      <span className="flex-1">{customer.name}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {customer.count} visits
                      </span>
                    </Button>
                  ))}
                </div>
              )}

              <h3 className="text-sm font-medium text-gray-500 px-2 py-1 mt-4">All Customers</h3>
              <div className="grid grid-cols-1 gap-2">
                {customers.slice(0, 10).map((customer) => (
                  <Button
                    key={customer.id}
                    variant="outline"
                    className="justify-start h-auto py-2 border-pink-100 hover:bg-pink-50"
                    onClick={() => onSelect({ id: customer.id, name: customer.name })}
                  >
                    <User className="mr-2 h-4 w-4 text-pink-600" />
                    <span>{customer.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {showKeyboard && (
          <div className="p-2 border-t">
            <OnScreenKeyboard onKeyPress={handleKeyPress} />
          </div>
        )}

        <div className="p-4 border-t">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
