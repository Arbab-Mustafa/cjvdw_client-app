"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"
import { getTransactionsForDateRange } from "@/data/reports-data"

type TherapistHours = {
  date: string
  therapistId: string
  hours: number
}

type HoursContextType = {
  hours: TherapistHours[]
  addHours: (therapistId: string, date: string, hours: number) => void
  getHoursForTherapist: (therapistId: string, startDate: Date, endDate: Date) => number
  getHoursForDateRange: (
    startDate: Date,
    endDate: Date,
  ) => Array<{
    therapistId: string
    therapistName: string
    hours: number
  }>
  calculateCommission: (
    therapistId: string,
    startDate: Date,
    endDate: Date,
  ) => {
    revenue: number
    hours: number
    wage: number
    holidayPay: number
    employerNIC: number
    commission: number
    salonShare: number
    therapistShare: number
  }
}

const HoursContext = createContext<HoursContextType | undefined>(undefined)

export function HoursProvider({ children }: { children: ReactNode }) {
  const { user, users } = useAuth()
  const [hours, setHours] = useState<TherapistHours[]>([])

  // Load hours from localStorage on mount
  useEffect(() => {
    const savedHours = localStorage.getItem("therapistHours")
    if (savedHours) {
      try {
        setHours(JSON.parse(savedHours))
      } catch (error) {
        console.error("Failed to parse saved hours:", error)
      }
    }
  }, [])

  // Save hours to localStorage when they change
  useEffect(() => {
    localStorage.setItem("therapistHours", JSON.stringify(hours))
  }, [hours])

  const addHours = (therapistId: string, date: string, hoursWorked: number) => {
    setHours((prevHours) => {
      // Check if there's already an entry for this therapist and date
      const existingIndex = prevHours.findIndex((entry) => entry.therapistId === therapistId && entry.date === date)

      if (existingIndex >= 0) {
        // Update existing entry
        const updatedHours = [...prevHours]
        updatedHours[existingIndex] = {
          ...updatedHours[existingIndex],
          hours: hoursWorked,
        }
        return updatedHours
      } else {
        // Add new entry
        return [...prevHours, { therapistId, date, hours: hoursWorked }]
      }
    })
  }

  const getHoursForTherapist = (therapistId: string, startDate: Date, endDate: Date) => {
    // Convert dates to string format for comparison
    const start = startDate.toISOString().split("T")[0]
    const end = endDate.toISOString().split("T")[0]

    return hours
      .filter((entry) => {
        return entry.therapistId === therapistId && entry.date >= start && entry.date <= end
      })
      .reduce((total, entry) => total + entry.hours, 0)
  }

  // New function to get hours for all therapists in a date range
  const getHoursForDateRange = (startDate: Date, endDate: Date) => {
    // Convert dates to string format for comparison
    const start = startDate.toISOString().split("T")[0]
    const end = endDate.toISOString().split("T")[0]

    // Get all hours entries in the date range
    const hoursInRange = hours.filter((entry) => entry.date >= start && entry.date <= end)

    // Group by therapist
    const therapistHoursMap = new Map<string, number>()

    hoursInRange.forEach((entry) => {
      const current = therapistHoursMap.get(entry.therapistId) || 0
      therapistHoursMap.set(entry.therapistId, current + entry.hours)
    })

    // Convert to array with therapist names
    return Array.from(therapistHoursMap.entries()).map(([therapistId, hours]) => {
      // Find therapist name from users array
      const therapist = users.find((u) => u.id === therapistId)
      return {
        therapistId,
        therapistName: therapist?.name || "Unknown",
        hours,
      }
    })
  }

  const calculateCommission = (therapistId: string, startDate: Date, endDate: Date) => {
    // Get all transactions for this therapist in the date range
    const transactions = getTransactionsForDateRange(startDate, endDate, therapistId)

    // Calculate total revenue
    const revenue = transactions.reduce((sum, t) => sum + (t.amount - t.discount), 0)

    // Get the therapist's details
    const therapist = users.find((u) => u.id === therapistId) || {
      id: therapistId,
      name: "Unknown",
      role: "therapist" as const,
      employmentType: "employed" as const,
      hourlyRate: 0,
    }

    // Get total hours worked
    const hoursWorked = getHoursForTherapist(therapistId, startDate, endDate)

    // Initialize result object
    const result = {
      revenue,
      hours: hoursWorked,
      wage: 0,
      holidayPay: 0,
      employerNIC: 0,
      commission: 0,
      salonShare: 0,
      therapistShare: 0,
    }

    // Calculate based on employment type
    if (therapist.employmentType === "employed") {
      // For employed therapists: wage + holiday pay + NIC, then 10% commission
      const hourlyRate = therapist.hourlyRate || 0
      const wage = hoursWorked * hourlyRate
      const holidayPay = wage * 0.12 // 12% holiday pay
      const employerNIC = wage * 0.138 // 13.8% employer NIC

      result.wage = wage
      result.holidayPay = holidayPay
      result.employerNIC = employerNIC

      // Commission is 10% of revenue after deducting costs
      const costs = wage + holidayPay + employerNIC
      result.commission = Math.max(0, (revenue - costs) * 0.1)

      result.therapistShare = wage + holidayPay + result.commission
      result.salonShare = revenue - result.therapistShare
    } else {
      // For self-employed therapists: 40% of revenue
      result.therapistShare = revenue * 0.4
      result.salonShare = revenue * 0.6
    }

    return result
  }

  return (
    <HoursContext.Provider
      value={{
        hours,
        addHours,
        getHoursForTherapist,
        getHoursForDateRange,
        calculateCommission,
      }}
    >
      {children}
    </HoursContext.Provider>
  )
}

export function useHours() {
  const context = useContext(HoursContext)
  if (context === undefined) {
    throw new Error("useHours must be used within a HoursProvider")
  }
  return context
}

export const addHoursEntry = () => {}
