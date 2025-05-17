"use client"

import { useState, useMemo } from "react"
import { format, startOfDay, endOfDay } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Download, Printer, Search, ArrowUpDown } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import {
  getTransactionsForDateRange,
  groupTransactionsByTherapist,
  groupTransactionsByCustomer,
  groupTransactionsByService,
  getUniqueCustomers,
  getUniqueTherapists,
  getDateRange,
  getDateRangeLabel,
} from "@/data/reports-data"
import { CATEGORY_LABELS } from "@/types/services"

type ReportType = "therapist" | "customer" | "service" | "transaction"
type TimePeriod = "day" | "week" | "month" | "custom"

export default function ReportsInterface() {
  const { user } = useAuth()
  const isOwner = user?.role === "owner"

  // Report filters
  const [reportType, setReportType] = useState<ReportType>("therapist")
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("day")
  const [therapistFilter, setTherapistFilter] = useState<string>(isOwner ? "all" : user?.id || "all")
  const [customerFilter, setCustomerFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({
    key: "amount",
    direction: "desc",
  })

  // Date range
  const today = new Date()
  const [dateRange, setDateRange] = useState(() => {
    const { startDate, endDate } = getDateRange("day", today)
    return { startDate, endDate }
  })

  // Update date range when time period changes
  const handleTimePeriodChange = (period: TimePeriod) => {
    setTimePeriod(period)

    if (period !== "custom") {
      const { startDate, endDate } = getDateRange(period, today)
      setDateRange({ startDate, endDate })
    }
  }

  // Set custom date range
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return

    if (!dateRange.startDate || (dateRange.startDate && dateRange.endDate)) {
      // Start a new selection
      setDateRange({ startDate: date, endDate: date })
    } else {
      // Complete the selection
      if (date < dateRange.startDate) {
        setDateRange({ startDate: date, endDate: dateRange.startDate })
      } else {
        setDateRange({ startDate: dateRange.startDate, endDate: date })
      }
    }
  }

  // Get filtered transactions
  const filteredTransactions = useMemo(() => {
    let transactions = getTransactionsForDateRange(
      dateRange.startDate,
      dateRange.endDate,
      therapistFilter,
      categoryFilter,
      customerFilter,
    )

    if (searchQuery) {
      transactions = transactions.filter(
        (transaction) =>
          transaction.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          transaction.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
          transaction.therapist.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return transactions
  }, [dateRange, therapistFilter, categoryFilter, customerFilter, searchQuery])

  // Group transactions based on report type
  const groupedData = useMemo(() => {
    switch (reportType) {
      case "therapist":
        return groupTransactionsByTherapist(filteredTransactions)
      case "customer":
        return groupTransactionsByCustomer(filteredTransactions)
      case "service":
        return groupTransactionsByService(filteredTransactions)
      case "transaction":
      default:
        return { transactions: filteredTransactions }
    }
  }, [reportType, filteredTransactions])

  // Calculate totals
  const totalRevenue = useMemo(() => {
    return filteredTransactions.reduce((sum, transaction) => sum + (transaction.amount - transaction.discount), 0)
  }, [filteredTransactions])

  const totalTransactions = filteredTransactions.length

  // Get unique customers and therapists for filters
  const uniqueCustomers = useMemo(() => getUniqueCustomers(), [])
  const uniqueTherapists = useMemo(() => getUniqueTherapists(), [])

  // Handle sorting
  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }))
  }

  // Sort data for tables
  const getSortedData = (data: any[]) => {
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1
      }
      return 0
    })
  }

  // Format date range for display
  const dateRangeLabel = useMemo(() => {
    if (timePeriod === "day") {
      return format(dateRange.startDate, "PPPP")
    } else {
      return getDateRangeLabel(dateRange.startDate, dateRange.endDate)
    }
  }, [timePeriod, dateRange])

  // Prepare data for therapist report
  const therapistReportData = useMemo(() => {
    return Object.entries(groupedData).map(([therapist, data]) => ({
      name: therapist,
      amount: data.totalAmount,
      count: data.transactionCount,
      average: data.totalAmount / data.transactionCount,
    }))
  }, [groupedData])

  // Prepare data for customer report
  const customerReportData = useMemo(() => {
    return Object.entries(groupedData).map(([customer, data]) => ({
      name: customer,
      amount: data.totalAmount,
      count: data.transactionCount,
      average: data.totalAmount / data.transactionCount,
    }))
  }, [groupedData])

  // Prepare data for service report
  const serviceReportData = useMemo(() => {
    if (reportType !== "service") return []

    return Object.entries(groupedData).map(([service, data]) => ({
      name: service,
      category: data.category,
      amount: data.totalAmount,
      count: data.transactionCount,
      average: data.totalAmount / data.transactionCount,
    }))
  }, [groupedData, reportType])

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-pink-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-pink-600">Report Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={reportType} onValueChange={(value) => setReportType(value as ReportType)}>
              <SelectTrigger className="border-pink-200">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="therapist">Revenue by Therapist</SelectItem>
                <SelectItem value="customer">Revenue by Customer</SelectItem>
                <SelectItem value="service">Revenue by Service/Product</SelectItem>
                <SelectItem value="transaction">Transaction List</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="border-pink-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-pink-600">Time Period</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={timePeriod} onValueChange={(value) => handleTimePeriodChange(value as TimePeriod)}>
              <SelectTrigger className="border-pink-200">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Daily</SelectItem>
                <SelectItem value="week">Weekly</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="border-pink-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-pink-600">Date Range</CardTitle>
          </CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal border-pink-200">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRangeLabel}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={{
                    from: dateRange.startDate,
                    to: dateRange.endDate,
                  }}
                  onSelect={(range) => {
                    if (range?.from) {
                      setDateRange({
                        startDate: startOfDay(range.from),
                        endDate: range.to ? endOfDay(range.to) : endOfDay(range.from),
                      })
                      if (timePeriod !== "custom") {
                        setTimePeriod("custom")
                      }
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>

        <Card className="border-pink-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-pink-600">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {isOwner && (
              <Select value={therapistFilter} onValueChange={setTherapistFilter}>
                <SelectTrigger className="border-pink-200">
                  <SelectValue placeholder="All Therapists" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Therapists</SelectItem>
                  {uniqueTherapists.map((therapist) => (
                    <SelectItem key={therapist} value={therapist.toLowerCase()}>
                      {therapist}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {reportType === "customer" && (
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search customers..."
                  className="pl-8 border-pink-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}

            {reportType === "service" && (
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="border-pink-200">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-pink-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-pink-600">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{dateRangeLabel}</p>
          </CardContent>
        </Card>

        <Card className="border-pink-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-pink-600">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">{dateRangeLabel}</p>
          </CardContent>
        </Card>

        <Card className="border-pink-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-pink-600">Average Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              £{totalTransactions > 0 ? (totalRevenue / totalTransactions).toFixed(2) : "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">{dateRangeLabel}</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Content */}
      <Card className="border-pink-200">
        <CardHeader>
          <CardTitle>
            {reportType === "therapist"
              ? "Revenue by Therapist"
              : reportType === "customer"
                ? "Revenue by Customer"
                : reportType === "service"
                  ? "Revenue by Service/Product"
                  : "Transaction List"}
          </CardTitle>
          <CardDescription>{dateRangeLabel}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {/* Therapist Report */}
          {reportType === "therapist" && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("name")}>
                      Therapist
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("count")}>
                      Transactions
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("amount")}>
                      Revenue
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("average")}>
                      Average
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getSortedData(therapistReportData).map((row) => (
                  <TableRow key={row.name}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell className="text-right">{row.count}</TableCell>
                    <TableCell className="text-right">£{row.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">£{row.average.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                {therapistReportData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      No data available for the selected period.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}

          {/* Customer Report */}
          {reportType === "customer" && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("name")}>
                      Customer
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("count")}>
                      Visits
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("amount")}>
                      Spent
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("average")}>
                      Average
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getSortedData(customerReportData).map((row) => (
                  <TableRow key={row.name}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell className="text-right">{row.count}</TableCell>
                    <TableCell className="text-right">£{row.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">£{row.average.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                {customerReportData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      No data available for the selected period.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}

          {/* Service Report */}
          {reportType === "service" && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("name")}>
                      Service/Product
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("category")}>
                      Category
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("count")}>
                      Quantity
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("amount")}>
                      Revenue
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getSortedData(serviceReportData).map((row) => (
                  <TableRow key={row.name}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-pink-50 text-pink-800 hover:bg-pink-50">
                        {CATEGORY_LABELS[row.category as keyof typeof CATEGORY_LABELS] || row.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{row.count}</TableCell>
                    <TableCell className="text-right">£{row.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                {serviceReportData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      No data available for the selected period.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}

          {/* Transaction List */}
          {reportType === "transaction" && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("date")}>
                      Date/Time
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("customer")}>
                      Customer
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("service")}>
                      Service/Product
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("therapist")}>
                      Therapist
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("amount")}>
                      Amount
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {format(new Date(transaction.date), "dd MMM yyyy")}
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(transaction.date), "h:mm a")}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{transaction.customer}</TableCell>
                    <TableCell>{transaction.service}</TableCell>
                    <TableCell>{transaction.therapist}</TableCell>
                    <TableCell className="text-right">
                      £{(transaction.amount - transaction.discount).toFixed(2)}
                      {transaction.discount > 0 && (
                        <div className="text-xs text-pink-600">Discount: £{transaction.discount.toFixed(2)}</div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredTransactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      No transactions found for the selected period.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Export Options */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" className="border-pink-200">
          <Printer className="mr-2 h-4 w-4" />
          Print Report
        </Button>
        <Button variant="outline" size="sm" className="border-pink-200">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
    </div>
  )
}
