import { addTransaction, clearTransactions, type Transaction } from "./reports-data"
import { DEFAULT_SERVICES } from "./services"
import { addHoursEntry } from "@/context/hours-context"

// Sample customer data
const SAMPLE_CUSTOMERS = [
  "Emma Thompson",
  "Sophie Williams",
  "Olivia Davis",
  "Charlotte Brown",
  "Amelia Wilson",
  "Isabella Moore",
  "Mia Taylor",
  "Harper Anderson",
  "Evelyn Thomas",
  "Abigail Jackson",
  "Elizabeth White",
  "Ella Harris",
  "Grace Martin",
  "Chloe Thompson",
  "Victoria Garcia",
  "Lily Martinez",
  "Hannah Robinson",
  "Layla Clark",
  "Scarlett Rodriguez",
  "Aria Lewis",
  "Zoe Walker",
  "Nora Hall",
  "Riley Allen",
  "Zoey Young",
  "Penelope King",
  "Leah Wright",
  "Aubrey Scott",
  "Stella Green",
  "Savannah Baker",
  "Brooklyn Adams",
]

// Sample therapist data
const SAMPLE_THERAPISTS = [
  { id: "sarah", name: "Sarah" },
  { id: "alex", name: "Alex" },
  { id: "danica", name: "Danica" },
  { id: "chelsea", name: "Chelsea" },
  { id: "kelly", name: "Kelly" },
  { id: "steph", name: "Steph" },
  { id: "eleni", name: "Eleni" },
]

// Payment methods
const PAYMENT_METHODS = ["Card", "Cash"]

// Generate a random date within a range
const randomDate = (start: Date, end: Date) => {
  const startTime = start.getTime()
  const endTime = end.getTime()
  const randomTime = startTime + Math.random() * (endTime - startTime)
  const date = new Date(randomTime)

  // Set hours between 9am and 6pm
  date.setHours(9 + Math.floor(Math.random() * 9), Math.floor(Math.random() * 60), 0, 0)

  return date
}

// Generate a random transaction
const generateRandomTransaction = (date: Date): Transaction => {
  // Select a random service
  const service = DEFAULT_SERVICES[Math.floor(Math.random() * DEFAULT_SERVICES.length)]

  // Select a random customer
  const customer = SAMPLE_CUSTOMERS[Math.floor(Math.random() * SAMPLE_CUSTOMERS.length)]

  // Select a random therapist
  const therapistIndex = Math.floor(Math.random() * SAMPLE_THERAPISTS.length)
  const therapist = SAMPLE_THERAPISTS[therapistIndex]

  // Determine payment method (70% card, 30% cash)
  const paymentMethod = Math.random() < 0.7 ? "Card" : "Cash"

  // Determine if there's a discount (10% chance)
  const hasDiscount = Math.random() < 0.1
  const discountAmount = hasDiscount ? service.price * 0.1 : 0

  return {
    id: `TX${Math.floor(Math.random() * 1000000)}`,
    date: date,
    customer: customer,
    therapistId: therapist.id,
    therapist: therapist.name,
    service: service.name,
    category: service.category,
    amount: service.price,
    discount: discountAmount,
    paymentMethod: paymentMethod,
  }
}

// Generate hours for therapists
const generateHoursForTherapists = (startDate: Date, endDate: Date) => {
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    // Skip weekends
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      // For each therapist
      SAMPLE_THERAPISTS.forEach((therapist) => {
        // 80% chance of working on any given day
        if (Math.random() < 0.8) {
          // Random hours between 4 and 8
          const hours = 4 + Math.floor(Math.random() * 4)

          addHoursEntry({
            id: `H${Math.floor(Math.random() * 1000000)}`,
            therapistId: therapist.id,
            therapistName: therapist.name,
            date: new Date(currentDate),
            hours: hours,
          })
        }
      })
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1)
  }
}

// Generate transactions for a month
export const generateMonthOfData = () => {
  // Clear existing data
  clearTransactions()

  // Set date range (last 30 days)
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(endDate.getDate() - 30)

  // Generate hours for therapists
  generateHoursForTherapists(startDate, endDate)

  // Generate between 300-500 transactions
  const transactionCount = 300 + Math.floor(Math.random() * 200)

  for (let i = 0; i < transactionCount; i++) {
    const date = randomDate(startDate, endDate)
    const transaction = generateRandomTransaction(date)
    addTransaction(transaction)
  }

  console.log(
    `Generated ${transactionCount} transactions from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
  )
}

// Function to clear all data (for production)
export const clearAllData = () => {
  clearTransactions()
  console.log("All transaction data cleared")
}
