"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"
import { useService } from "@/context/service-context"
import { addTransaction, clearTransactions } from "@/data/reports-data"

// Sample customer names
const CUSTOMER_NAMES = [
  "Emma Thompson",
  "Olivia Wilson",
  "Sophia Martinez",
  "Isabella Johnson",
  "Charlotte Brown",
  "Amelia Davis",
  "Mia Miller",
  "Harper Garcia",
  "Evelyn Rodriguez",
  "Abigail Smith",
  "Emily Jones",
  "Elizabeth Taylor",
  "Mila Thomas",
  "Ella White",
  "Avery Harris",
  "Sofia Clark",
  "Camila Lewis",
  "Aria Walker",
  "Scarlett Hall",
  "Victoria Allen",
]

export default function TransactionGenerator() {
  const [count, setCount] = useState(10)
  const [timeframe, setTimeframe] = useState("today")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const { users } = useAuth()
  const { services } = useService()

  // Filter only therapists
  const therapists = users.filter((user) => user.role === "therapist" && user.active !== false)

  // Get all active services
  const activeServices = services.filter((service) => service.active !== false)

  const generateTransactions = async () => {
    if (!therapists.length || !activeServices.length) {
      toast.error("No therapists or services available")
      return
    }

    setIsGenerating(true)
    let successCount = 0
    let errorCount = 0

    try {
      // Generate transactions
      for (let i = 0; i < count; i++) {
        try {
          // Random date based on timeframe
          let date = new Date()
          switch (timeframe) {
            case "last-week":
              date = new Date(date.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000)
              break
            case "last-month":
              date = new Date(date.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000)
              break
            case "last-year":
              date = new Date(date.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000)
              break
            default:
              // Today - random time in the last 12 hours
              date = new Date(date.getTime() - Math.random() * 12 * 60 * 60 * 1000)
          }

          // Random therapist
          const therapist = therapists[Math.floor(Math.random() * therapists.length)]

          // Random customer
          const customer = CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)]

          // Random number of items (1-3)
          const itemCount = Math.floor(Math.random() * 3) + 1
          const items = []
          let total = 0

          for (let j = 0; j < itemCount; j++) {
            const service = activeServices[Math.floor(Math.random() * activeServices.length)]
            const price = service.price

            // 10% chance of discount
            const discount = Math.random() < 0.1 ? Math.floor(price * 0.1 * 100) / 100 : 0

            const item = {
              id: `item-${Date.now()}-${j}`,
              name: service.name,
              price: price,
              discount: discount,
              category: service.category,
            }

            items.push(item)
            total += price - discount
          }

          // 70% card, 30% cash
          const paymentMethod = Math.random() < 0.7 ? "card" : "cash"

          // Add transaction
          addTransaction({
            id: `tx-${Date.now()}-${i}`,
            date: date.toISOString(),
            therapistId: therapist.id,
            therapistName: therapist.name,
            customer: customer,
            items: items,
            total: total,
            paymentMethod: paymentMethod,
          })

          successCount++
        } catch (error) {
          console.error("Error generating transaction:", error)
          errorCount++
        }

        // Small delay to avoid overwhelming the browser
        if (i % 50 === 0 && i > 0) {
          await new Promise((resolve) => setTimeout(resolve, 100))
        }
      }

      toast.success(
        `Generated ${successCount} transactions successfully${errorCount > 0 ? ` (${errorCount} failed)` : ""}`,
      )
    } catch (error) {
      console.error("Error in transaction generation:", error)
      toast.error("Failed to generate transactions")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleClearTransactions = () => {
    if (window.confirm("Are you sure you want to clear all transactions? This cannot be undone.")) {
      setIsClearing(true)
      try {
        clearTransactions()
        toast.success("All transactions cleared successfully")
      } catch (error) {
        console.error("Error clearing transactions:", error)
        toast.error("Failed to clear transactions")
      } finally {
        setIsClearing(false)
      }
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Generate Test Transactions</CardTitle>
        <CardDescription>
          Generate random transactions to populate the dashboard and reports with test data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="count">Number of Transactions</Label>
          <Input
            id="count"
            type="number"
            min="1"
            max="1000"
            value={count}
            onChange={(e) => setCount(Number.parseInt(e.target.value) || 10)}
          />
          <p className="text-sm text-muted-foreground">How many transactions to generate (1-1000)</p>
        </div>

        <div className="space-y-2">
          <Label>Time Period</Label>
          <RadioGroup value={timeframe} onValueChange={setTimeframe} className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="today" id="today" />
              <Label htmlFor="today" className="cursor-pointer">
                Today
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="last-week" id="last-week" />
              <Label htmlFor="last-week" className="cursor-pointer">
                Last Week
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="last-month" id="last-month" />
              <Label htmlFor="last-month" className="cursor-pointer">
                Last Month
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="last-year" id="last-year" />
              <Label htmlFor="last-year" className="cursor-pointer">
                Last Year
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="destructive" onClick={handleClearTransactions} disabled={isClearing || isGenerating}>
          {isClearing ? "Clearing..." : "Clear All Transactions"}
        </Button>
        <Button onClick={generateTransactions} disabled={isGenerating || isClearing}>
          {isGenerating ? "Generating..." : "Generate Transactions"}
        </Button>
      </CardFooter>
    </Card>
  )
}
