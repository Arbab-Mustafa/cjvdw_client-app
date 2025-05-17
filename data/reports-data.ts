import { getItem, setItem } from "./local-storage"

// Define the Transaction interface
export interface Transaction {
  id: string
  date: Date
  customer: string
  customerId?: string
  therapistId: string
  therapist: string
  service: string
  category: string
  amount: number
  discount: number
  paymentMethod: string
}

// Initialize transactions from localStorage or empty array
const loadTransactions = (): Transaction[] => {
  const storedTransactions = getItem<any[]>("gem-n-eyes-transactions") || []

  // Convert date strings back to Date objects
  return storedTransactions.map((transaction) => ({
    ...transaction,
    date: new Date(transaction.date),
  }))
}

// Sample data for reports
export let sampleTransactions: Transaction[] = loadTransactions()

// Save transactions to localStorage
const saveTransactions = () => {
  setItem("gem-n-eyes-transactions", sampleTransactions)
}

// Helper function to get transactions for a specific date range
export const getTransactionsForDateRange = (
  startDate: Date,
  endDate: Date,
  therapistId = "all",
  category = "all",
  customer = "all",
) => {
  return sampleTransactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date)
    const isInDateRange = transactionDate >= startDate && transactionDate <= endDate
    const isTherapistMatch = therapistId === "all" || transaction.therapistId === therapistId
    const isCategoryMatch = category === "all" || transaction.category === category
    const isCustomerMatch = customer === "all" || transaction.customer.toLowerCase().includes(customer.toLowerCase())

    return isInDateRange && isTherapistMatch && isCategoryMatch && isCustomerMatch
  })
}

// Helper function to get unique customers
export const getUniqueCustomers = () => {
  const customers = new Set<string>()
  sampleTransactions.forEach((transaction) => {
    customers.add(transaction.customer)
  })
  return Array.from(customers).sort()
}

// Helper function to get unique therapists
export const getUniqueTherapists = () => {
  const therapists = new Set<string>()
  sampleTransactions.forEach((transaction) => {
    therapists.add(transaction.therapist)
  })
  return Array.from(therapists).sort()
}

// Helper function to get unique services/products
export const getUniqueServices = () => {
  const services = new Set<string>()
  sampleTransactions.forEach((transaction) => {
    services.add(transaction.service)
  })
  return Array.from(services).sort()
}

// Helper function to get unique categories
export const getUniqueCategories = () => {
  const categories = new Set<string>()
  sampleTransactions.forEach((transaction) => {
    categories.add(transaction.category)
  })
  return Array.from(categories).sort()
}

// Helper function to group transactions by therapist
export const groupTransactionsByTherapist = (transactions: Transaction[]) => {
  const grouped: Record<
    string,
    {
      therapistId: string
      totalAmount: number
      transactionCount: number
      transactions: Transaction[]
    }
  > = {}

  transactions.forEach((transaction) => {
    if (!grouped[transaction.therapist]) {
      grouped[transaction.therapist] = {
        therapistId: transaction.therapistId,
        totalAmount: 0,
        transactionCount: 0,
        transactions: [],
      }
    }

    grouped[transaction.therapist].totalAmount += transaction.amount - transaction.discount
    grouped[transaction.therapist].transactionCount += 1
    grouped[transaction.therapist].transactions.push(transaction)
  })

  return grouped
}

// Helper function to group transactions by customer
export const groupTransactionsByCustomer = (transactions: Transaction[]) => {
  const grouped: Record<
    string,
    {
      totalAmount: number
      transactionCount: number
      transactions: Transaction[]
    }
  > = {}

  transactions.forEach((transaction) => {
    if (!grouped[transaction.customer]) {
      grouped[transaction.customer] = {
        totalAmount: 0,
        transactionCount: 0,
        transactions: [],
      }
    }

    grouped[transaction.customer].totalAmount += transaction.amount - transaction.discount
    grouped[transaction.customer].transactionCount += 1
    grouped[transaction.customer].transactions.push(transaction)
  })

  return grouped
}

// Helper function to group transactions by service/product
export const groupTransactionsByService = (transactions: Transaction[]) => {
  const grouped: Record<
    string,
    {
      totalAmount: number
      transactionCount: number
      transactions: Transaction[]
      category: string
    }
  > = {}

  transactions.forEach((transaction) => {
    if (!grouped[transaction.service]) {
      grouped[transaction.service] = {
        totalAmount: 0,
        transactionCount: 0,
        transactions: [],
        category: transaction.category,
      }
    }

    grouped[transaction.service].totalAmount += transaction.amount - transaction.discount
    grouped[transaction.service].transactionCount += 1
    grouped[transaction.service].transactions.push(transaction)
  })

  return grouped
}

// Helper function to group transactions by category
export const groupTransactionsByCategory = (transactions: Transaction[]) => {
  const grouped: Record<
    string,
    {
      totalAmount: number
      transactionCount: number
      transactions: Transaction[]
    }
  > = {}

  transactions.forEach((transaction) => {
    if (!grouped[transaction.category]) {
      grouped[transaction.category] = {
        totalAmount: 0,
        transactionCount: 0,
        transactions: [],
      }
    }

    grouped[transaction.category].totalAmount += transaction.amount - transaction.discount
    grouped[transaction.category].transactionCount += 1
    grouped[transaction.category].transactions.push(transaction)
  })

  return grouped
}

// Helper function to get daily totals for a date range
export const getDailyTotals = (startDate: Date, endDate: Date, therapistId = "all") => {
  const dailyTotals: Record<string, number> = {}
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    const dateString = currentDate.toISOString().split("T")[0]
    dailyTotals[dateString] = 0

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1)
  }

  const transactions = getTransactionsForDateRange(startDate, endDate, therapistId)
  transactions.forEach((transaction) => {
    const dateString = transaction.date.toISOString().split("T")[0]
    dailyTotals[dateString] = (dailyTotals[dateString] || 0) + (transaction.amount - transaction.discount)
  })

  return dailyTotals
}

// Helper function to format date ranges
export const getDateRangeLabel = (startDate: Date, endDate: Date) => {
  const start = startDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
  const end = endDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
  return `${start} - ${end}`
}

// Helper function to get the start and end dates for different periods
export const getDateRange = (period: "day" | "week" | "month" | "year", date: Date = new Date()) => {
  const today = new Date(date)
  today.setHours(0, 0, 0, 0)

  if (period === "day") {
    const endDate = new Date(today)
    endDate.setHours(23, 59, 59, 999)
    return { startDate: today, endDate }
  }

  if (period === "week") {
    const startDate = new Date(today)
    const day = startDate.getDay()
    const diff = startDate.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
    startDate.setDate(diff)

    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6)
    endDate.setHours(23, 59, 59, 999)

    return { startDate, endDate }
  }

  if (period === "month") {
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1)
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    endDate.setHours(23, 59, 59, 999)

    return { startDate, endDate }
  }

  if (period === "year") {
    const startDate = new Date(today.getFullYear(), 0, 1)
    const endDate = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999)
    return { startDate, endDate }
  }

  return { startDate: today, endDate: today }
}

// Add a transaction to the sample data
export const addTransaction = (transaction: Transaction) => {
  sampleTransactions.push(transaction)

  // Sort transactions by date (newest first)
  sampleTransactions.sort((a, b) => b.date.getTime() - a.date.getTime())

  // Save to localStorage
  saveTransactions()
}

// Clear all transactions
export const clearTransactions = () => {
  sampleTransactions = []
  saveTransactions()
}

// Get top customers for a specific therapist
export const getTopCustomersForTherapist = (therapistId: string, limit = 10) => {
  // Filter transactions for this therapist
  const therapistTransactions = sampleTransactions.filter(
    (transaction) => transaction.therapistId === therapistId && transaction.customerId,
  )

  // Count transactions by customer
  const customerCounts: Record<string, { id: string; name: string; count: number }> = {}

  therapistTransactions.forEach((transaction) => {
    if (transaction.customerId) {
      if (!customerCounts[transaction.customerId]) {
        customerCounts[transaction.customerId] = {
          id: transaction.customerId,
          name: transaction.customer,
          count: 0,
        }
      }
      customerCounts[transaction.customerId].count += 1
    }
  })

  // Convert to array and sort by count (descending)
  const sortedCustomers = Object.values(customerCounts).sort((a, b) => b.count - a.count)

  // Return top N customers
  return sortedCustomers.slice(0, limit)
}
