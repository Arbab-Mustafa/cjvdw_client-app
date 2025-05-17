"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export default function MonthlyBarCharts() {
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [therapistData, setTherapistData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("monthly")

  useEffect(() => {
    const updateChartData = () => {
      console.log("Updating monthly bar charts...")
      setLoading(true)

      try {
        // Create static test data to verify charts are working
        const testMonthlyData = [
          { month: "Jan 2023", revenue: 1200 },
          { month: "Feb 2023", revenue: 1500 },
          { month: "Mar 2023", revenue: 1800 },
          { month: "Apr 2023", revenue: 2000 },
          { month: "May 2023", revenue: 2200 },
          { month: "Jun 2023", revenue: 1900 },
          { month: "Jul 2023", revenue: 2100 },
          { month: "Aug 2023", revenue: 2400 },
          { month: "Sep 2023", revenue: 2600 },
          { month: "Oct 2023", revenue: 2300 },
          { month: "Nov 2023", revenue: 2500 },
          { month: "Dec 2023", revenue: 2800 },
        ]

        const testCategoryData = [
          { category: "Facials", revenue: 5000 },
          { category: "Waxing", revenue: 4200 },
          { category: "Body Treatments", revenue: 3800 },
          { category: "Hands & Feet", revenue: 3500 },
          { category: "Eyes", revenue: 2900 },
          { category: "Hot Wax", revenue: 2500 },
          { category: "Sunbed", revenue: 2000 },
          { category: "Products & Vouchers", revenue: 1800 },
        ]

        const testTherapistData = [
          { therapist: "Sarah", revenue: 8500 },
          { therapist: "Emma", revenue: 7200 },
          { therapist: "Jessica", revenue: 6800 },
          { therapist: "Olivia", revenue: 6500 },
          { therapist: "Sophie", revenue: 5900 },
          { therapist: "Charlotte", revenue: 5500 },
          { therapist: "Lucy", revenue: 5000 },
          { therapist: "Megan", revenue: 4800 },
        ]

        // Set the test data
        setMonthlyData(testMonthlyData)
        setCategoryData(testCategoryData)
        setTherapistData(testTherapistData)

        console.log("Test data loaded successfully")
      } catch (error) {
        console.error("Error updating chart data:", error)
      } finally {
        setLoading(false)
      }
    }

    // Initial update
    updateChartData()
  }, [])

  // Custom formatter for tooltip values
  const formatCurrency = (value: number) => {
    return [`£${value.toFixed(2)}`, "Revenue"]
  }

  if (loading) {
    return (
      <Card className="border-pink-200">
        <CardContent className="p-6 flex items-center justify-center h-[400px]">
          <p className="text-muted-foreground text-lg">Loading chart data...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-pink-200 w-full">
      <CardContent className="p-6">
        <Tabs defaultValue="monthly" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="monthly">Monthly Revenue</TabsTrigger>
            <TabsTrigger value="category">By Category</TabsTrigger>
            <TabsTrigger value="therapist">By Therapist</TabsTrigger>
          </TabsList>

          <TabsContent value="monthly" className="mt-2 h-[400px]">
            {monthlyData.length > 0 ? (
              <div className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip formatter={formatCurrency} />
                    <Legend wrapperStyle={{ paddingTop: 10 }} />
                    <Bar dataKey="revenue" name="Monthly Revenue" fill="#ff7eb9" isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No monthly revenue data available
              </div>
            )}
          </TabsContent>

          <TabsContent value="category" className="mt-2 h-[400px]">
            {categoryData.length > 0 ? (
              <div className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical" margin={{ top: 20, right: 30, left: 120, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="category" tick={{ fontSize: 12 }} />
                    <Tooltip formatter={formatCurrency} />
                    <Legend wrapperStyle={{ paddingTop: 10 }} />
                    <Bar dataKey="revenue" name="Revenue by Category" fill="#8884d8" isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No category data available
              </div>
            )}
          </TabsContent>

          <TabsContent value="therapist" className="mt-2 h-[400px]">
            {therapistData.length > 0 ? (
              <div className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={therapistData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="therapist" tick={{ fontSize: 12 }} />
                    <Tooltip formatter={formatCurrency} />
                    <Legend wrapperStyle={{ paddingTop: 10 }} />
                    <Bar dataKey="revenue" name="Revenue by Therapist" fill="#82ca9d" isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No therapist data available
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
