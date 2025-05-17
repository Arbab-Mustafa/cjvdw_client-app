"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"
import {
  getTransactionsForDateRange,
  groupTransactionsByCustomer,
  groupTransactionsByService,
  type Transaction,
} from "@/data/reports-data"

interface SalesTablesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  startDate: Date
  endDate: Date
  title: string
  period: "day" | "week" | "month" | "year"
}

export default function SalesTablesDialog({
  open,
  onOpenChange,
  startDate,
  endDate,
  title,
  period,
}: SalesTablesDialogProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("therapists")

  useEffect(() => {
    if (open) {
      setLoading(true)
      try {
        // Get transactions for the date range
        const periodTransactions = getTransactionsForDateRange(startDate, endDate)
        setTransactions(periodTransactions)
      } catch (error) {
        console.error("Error fetching transactions:", error)
      } finally {
        setLoading(false)
      }
    }
  }, [open, startDate, endDate])

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

  // Export data to CSV
  const exportToCSV = () => {
    let csvContent = ""
    let fileName = ""

    // Format the date range for the filename
    const dateRangeFormatted = `${format(startDate, "yyyy-MM-dd")}_to_${format(endDate, "yyyy-MM-dd")}`

    if (activeTab === "therapists") {
      // Create CSV header
      csvContent = "Therapist,Card Payments,Cash Payments,Total,Transactions\n"

      // Add data rows
      therapistData().forEach((therapist) => {
        csvContent += `"${therapist.name}",${therapist.cardAmount.toFixed(2)},${therapist.cashAmount.toFixed(
          2,
        )},${therapist.totalAmount.toFixed(2)},${therapist.transactionCount}\n`
      })

      // Add totals row
      const totalCard = therapistData().reduce((sum, t) => sum + t.cardAmount, 0)
      const totalCash = therapistData().reduce((sum, t) => sum + t.cashAmount, 0)
      const totalAmount = therapistData().reduce((sum, t) => sum + t.totalAmount, 0)
      const totalTransactions = therapistData().reduce((sum, t) => sum + t.transactionCount, 0)

      csvContent += `"TOTAL",${totalCard.toFixed(2)},${totalCash.toFixed(2)},${totalAmount.toFixed(
        2,
      )},${totalTransactions}\n`

      fileName = `therapist_sales_${dateRangeFormatted}.csv`
    } else if (activeTab === "customers") {
      // Create CSV header
      csvContent = "Customer,Total Spent,Transactions\n"

      // Add data rows
      customerData().forEach((customer) => {
        csvContent += `"${customer.name}",${customer.totalAmount.toFixed(2)},${customer.transactionCount}\n`
      })

      // Add totals row
      const totalAmount = customerData().reduce((sum, c) => sum + c.totalAmount, 0)
      const totalTransactions = customerData().reduce((sum, c) => sum + c.transactionCount, 0)

      csvContent += `"TOTAL",${totalAmount.toFixed(2)},${totalTransactions}\n`

      fileName = `customer_sales_${dateRangeFormatted}.csv`
    } else if (activeTab === "services") {
      // Create CSV header
      csvContent = "Service/Product,Category,Total Revenue,Count\n"

      // Add data rows
      serviceData().forEach((service) => {
        csvContent += `"${service.name}","${service.category}",${service.totalAmount.toFixed(
          2,
        )},${service.transactionCount}\n`
      })

      // Add totals row
      const totalAmount = serviceData().reduce((sum, s) => sum + s.totalAmount, 0)
      const totalCount = serviceData().reduce((sum, s) => sum + s.transactionCount, 0)

      csvContent += `"TOTAL","",${totalAmount.toFixed(2)},${totalCount}\n`

      fileName = `service_sales_${dateRangeFormatted}.csv`
    }

    // Create a download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", fileName)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const dateRangeText = `${format(startDate, "dd MMM yyyy")} - ${format(endDate, "dd MMM yyyy")}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-pink-800">{title} Breakdown</DialogTitle>
          <DialogDescription>{dateRangeText}</DialogDescription>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-muted-foreground">Loading data...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex items-center justify-center h-[200px]">
            <p className="text-muted-foreground">No transactions found for this period.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList>
                  <TabsTrigger value="therapists">By Therapist</TabsTrigger>
                  <TabsTrigger value="customers">By Customer</TabsTrigger>
                  <TabsTrigger value="services">By Service</TabsTrigger>
                </TabsList>

                <div className="max-h-[500px] overflow-auto mt-4">
                  <TabsContent value="therapists" className="mt-0">
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
                            <TableCell className="text-right font-semibold">
                              £{therapist.totalAmount.toFixed(2)}
                            </TableCell>
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

                  <TabsContent value="customers" className="mt-0">
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

                  <TabsContent value="services" className="mt-0">
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
                </div>
              </Tabs>

              <Button variant="outline" size="sm" onClick={exportToCSV} className="ml-4 h-10">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
