"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"
import { getTransactionsForDateRange } from "@/data/reports-data"
import { useHours } from "@/context/hours-context"
import { format } from "date-fns"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface RevenueChartsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  startDate: Date
  endDate: Date
  title: string
  period: "day" | "week" | "month" | "year"
}

export default function RevenueChartsDialog({
  open,
  onOpenChange,
  startDate,
  endDate,
  title,
  period,
}: RevenueChartsDialogProps) {
  const { getHoursForDateRange } = useHours()
  const [therapistData, setTherapistData] = useState<any[]>([])
  const [customerData, setCustomerData] = useState<any[]>([])
  const [serviceData, setServiceData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (open) {
      setLoading(true)
      console.log(`Loading revenue charts for period: ${period}`)
      console.log(`Date range: ${startDate.toISOString()} - ${endDate.toISOString()}`)

      try {
        // Get transactions for the date range
        const transactions = getTransactionsForDateRange(startDate, endDate)
        console.log(`Found ${transactions.length} transactions in date range`)

        // Process therapist data
        const therapistMap = new Map<
          string,
          {
            name: string
            total: number
            card: number
            cash: number
            hours: number
            treatmentHours: number
          }
        >()

        transactions.forEach((transaction) => {
          const { therapist, amount, discount, paymentMethod } = transaction
          const net = amount - discount

          if (!therapistMap.has(therapist)) {
            therapistMap.set(therapist, {
              name: therapist,
              total: 0,
              card: 0,
              cash: 0,
              hours: 0,
              treatmentHours: 0,
            })
          }

          const therapistData = therapistMap.get(therapist)!
          therapistData.total += net

          if (paymentMethod.toLowerCase() === "card") {
            therapistData.card += net
          } else {
            therapistData.cash += net
          }

          // Estimate treatment hours (assuming average treatment is 45 minutes)
          therapistData.treatmentHours += 0.75
        })

        // Get hours worked for each therapist
        let hoursData: Array<{ therapistId: string; therapistName: string; hours: number }> = []
        try {
          hoursData = getHoursForDateRange(startDate, endDate)
          console.log(`Found ${hoursData.length} hour entries in date range`)
        } catch (error) {
          console.error("Error getting hours data:", error)
          hoursData = []
        }

        // Add hours data to therapist data
        hoursData.forEach((hourEntry) => {
          const therapistData = therapistMap.get(hourEntry.therapistName)
          if (therapistData) {
            therapistData.hours += hourEntry.hours
          }
        })

        // Calculate utilization score and format data for chart
        const therapistChartData = Array.from(therapistMap.values()).map((data) => {
          const utilization = data.hours > 0 ? (data.treatmentHours / data.hours) * 100 : 0
          return {
            name: data.name,
            total: data.total,
            card: data.card,
            cash: data.cash,
            utilization: Math.round(utilization),
          }
        })

        // Sort by total revenue (highest first)
        therapistChartData.sort((a, b) => b.total - a.total)
        setTherapistData(therapistChartData)
        console.log(`Processed ${therapistChartData.length} therapist data points`)

        // Process customer data
        const customerMap = new Map<string, { name: string; total: number }>()
        transactions.forEach((transaction) => {
          const { customer, amount, discount } = transaction
          const net = amount - discount

          if (!customerMap.has(customer)) {
            customerMap.set(customer, { name: customer, total: 0 })
          }

          const customerData = customerMap.get(customer)!
          customerData.total += net
        })

        // Format data for chart and sort by total (highest first)
        const customerChartData = Array.from(customerMap.values())
        customerChartData.sort((a, b) => b.total - a.total)

        // Limit to top 10 customers
        setCustomerData(customerChartData.slice(0, 10))
        console.log(`Processed ${customerChartData.length} customer data points`)

        // Process service data
        const serviceMap = new Map<string, { name: string; total: number; category: string }>()
        transactions.forEach((transaction) => {
          const { service, amount, discount, category } = transaction
          const net = amount - discount

          if (!serviceMap.has(service)) {
            serviceMap.set(service, { name: service, total: 0, category })
          }

          const serviceData = serviceMap.get(service)!
          serviceData.total += net
        })

        // Format data for chart and sort by total (highest first)
        const serviceChartData = Array.from(serviceMap.values())
        serviceChartData.sort((a, b) => b.total - a.revenue)

        // Limit to top 10 services
        setServiceData(serviceChartData.slice(0, 10))
        console.log(`Processed ${serviceChartData.length} service data points`)
      } catch (error) {
        console.error("Error processing chart data:", error)
      } finally {
        setLoading(false)
      }
    }
  }, [open, startDate, endDate, getHoursForDateRange, period])

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
            <p className="text-muted-foreground">Loading chart data...</p>
          </div>
        ) : (
          <Tabs defaultValue="therapists" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="therapists">By Therapist</TabsTrigger>
              <TabsTrigger value="customers">By Customer</TabsTrigger>
              <TabsTrigger value="services">By Service</TabsTrigger>
            </TabsList>

            <TabsContent value="therapists" className="mt-4">
              <Card className="p-4">
                <h3 className="text-lg font-medium mb-4">Revenue by Therapist</h3>
                <div className="h-[400px]">
                  {therapistData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={therapistData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                        <Tooltip
                          formatter={(value: number, name: string) => {
                            if (name === "Utilization %") return [`${value}%`, name]
                            return [`£${value.toFixed(2)}`, name]
                          }}
                          labelFormatter={(value) => `Therapist: ${value}`}
                        />
                        <Legend />
                        <Bar yAxisId="left" dataKey="card" name="Card Payments" fill="#8884d8" stackId="a" />
                        <Bar yAxisId="left" dataKey="cash" name="Cash Payments" fill="#82ca9d" stackId="a" />
                        <Bar yAxisId="right" dataKey="utilization" name="Utilization %" fill="#ffc658" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No data available for this period
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="customers" className="mt-4">
              <Card className="p-4">
                <h3 className="text-lg font-medium mb-4">Revenue by Customer (Top 10)</h3>
                <div className="h-[400px]">
                  {customerData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={customerData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
                        <YAxis />
                        <Tooltip
                          formatter={(value: number) => [`£${value.toFixed(2)}`, "Total Spent"]}
                          labelFormatter={(value) => `Customer: ${value}`}
                        />
                        <Legend />
                        <Bar dataKey="total" name="Total Spent" fill="#ff7eb9" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No data available for this period
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="mt-4">
              <Card className="p-4">
                <h3 className="text-lg font-medium mb-4">Revenue by Service/Product (Top 10)</h3>
                <div className="h-[400px]">
                  {serviceData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={serviceData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
                        <YAxis />
                        <Tooltip
                          formatter={(value: number) => [`£${value.toFixed(2)}`, "Revenue"]}
                          labelFormatter={(value) => `Service: ${value}`}
                        />
                        <Legend />
                        <Bar dataKey="total" name="Revenue" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No data available for this period
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}
