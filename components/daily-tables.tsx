"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  getTransactionsForDateRange,
  getDateRange,
  groupTransactionsByCustomer,
  groupTransactionsByService,
  type Transaction,
} from "@/data/reports-data"

export default function DailyTables() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("therapists")

  useEffect(() => {
    const fetchData = () => {
      setLoading(true)
      try {
        // Get today's date range
        const { startDate, endDate } = getDateRange("day")

        // Get transactions for today
        const todayTransactions = getTransactionsForDateRange(startDate, endDate)
        setTransactions(todayTransactions)
      } catch (error) {
        console.error("Error fetching transactions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Refresh data every minute
    const intervalId = setInterval(fetchData, 60000)
    return () => clearInterval(intervalId)
  }, [])

  // Group transactions by therapist with payment method split
  const therapistData = () => {
    const grouped: Record<
      string,
      {
        name: string
        totalAmount: number
        cardAmount: number
        cashAmount: number
        transactionCount: number
      }
    > = {}

    transactions.forEach((transaction) => {
      if (!grouped[transaction.therapistId]) {
        grouped[transaction.therapistId] = {
          name: transaction.therapist,
          totalAmount: 0,
          cardAmount: 0,
          cashAmount: 0,
          transactionCount: 0,
        }
      }

      const amount = transaction.amount - transaction.discount
      grouped[transaction.therapistId].totalAmount += amount
      grouped[transaction.therapistId].transactionCount += 1

      if (transaction.paymentMethod.toLowerCase() === "card") {
        grouped[transaction.therapistId].cardAmount += amount
      } else {
        grouped[transaction.therapistId].cashAmount += amount
      }
    })

    return Object.values(grouped).sort((a, b) => b.totalAmount - a.totalAmount)
  }

  // Group transactions by customer
  const customerData = () => {
    const grouped = groupTransactionsByCustomer(transactions)
    return Object.entries(grouped)
      .map(([name, data]) => ({
        name,
        totalAmount: data.totalAmount,
        transactionCount: data.transactionCount,
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount)
  }

  // Group transactions by service
  const serviceData = () => {
    const grouped = groupTransactionsByService(transactions)
    return Object.entries(grouped)
      .map(([name, data]) => ({
        name,
        category: data.category,
        totalAmount: data.totalAmount,
        transactionCount: data.transactionCount,
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount)
  }

  if (loading) {
    return <div className="text-center py-8">Loading today's data...</div>
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">No transactions recorded today.</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-pink-700">Today's Sales Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="therapists" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="therapists">By Therapist</TabsTrigger>
            <TabsTrigger value="customers">By Customer</TabsTrigger>
            <TabsTrigger value="services">By Service</TabsTrigger>
          </TabsList>

          <TabsContent value="therapists">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Therapist</TableHead>
                  <TableHead className="text-right">Card</TableHead>
                  <TableHead className="text-right">Cash</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Transactions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {therapistData().map((therapist) => (
                  <TableRow key={therapist.name}>
                    <TableCell className="font-medium">{therapist.name}</TableCell>
                    <TableCell className="text-right">£{therapist.cardAmount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">£{therapist.cashAmount.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-semibold">£{therapist.totalAmount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{therapist.transactionCount}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-pink-50">
                  <TableCell className="font-bold">Total</TableCell>
                  <TableCell className="text-right font-bold">
                    £
                    {therapistData()
                      .reduce((sum, t) => sum + t.cardAmount, 0)
                      .toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    £
                    {therapistData()
                      .reduce((sum, t) => sum + t.cashAmount, 0)
                      .toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    £
                    {therapistData()
                      .reduce((sum, t) => sum + t.totalAmount, 0)
                      .toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {therapistData().reduce((sum, t) => sum + t.transactionCount, 0)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="customers">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Total Spent</TableHead>
                  <TableHead className="text-right">Transactions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerData().map((customer) => (
                  <TableRow key={customer.name}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell className="text-right">£{customer.totalAmount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{customer.transactionCount}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-pink-50">
                  <TableCell className="font-bold">Total</TableCell>
                  <TableCell className="text-right font-bold">
                    £
                    {customerData()
                      .reduce((sum, c) => sum + c.totalAmount, 0)
                      .toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {customerData().reduce((sum, c) => sum + c.transactionCount, 0)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="services">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service/Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Total Revenue</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceData().map((service) => (
                  <TableRow key={service.name}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell>{service.category}</TableCell>
                    <TableCell className="text-right">£{service.totalAmount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{service.transactionCount}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-pink-50">
                  <TableCell className="font-bold">Total</TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right font-bold">
                    £
                    {serviceData()
                      .reduce((sum, s) => sum + s.totalAmount, 0)
                      .toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {serviceData().reduce((sum, s) => sum + s.transactionCount, 0)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
