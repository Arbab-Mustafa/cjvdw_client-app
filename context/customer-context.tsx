"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Customer, ConsultationForm } from "@/types/customer"
import { v4 as uuidv4 } from "uuid"

// Sample data for initial customers
const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "c1",
    name: "Emma Thompson",
    mobile: "07700 900123",
    email: "emma.thompson@example.com",
    createdAt: new Date(2024, 2, 15),
    updatedAt: new Date(2024, 2, 15),
    lastVisit: new Date(2025, 4, 10),
    consultationFormId: "cf1",
    notes: "Prefers afternoon appointments",
    active: true,
  },
  {
    id: "c2",
    name: "Sophie Williams",
    mobile: "07700 900124",
    email: "sophie.williams@example.com",
    createdAt: new Date(2024, 2, 20),
    updatedAt: new Date(2024, 2, 20),
    lastVisit: new Date(2025, 4, 11),
    consultationFormId: "cf2",
    notes: "Allergic to lavender",
    active: true,
  },
  {
    id: "c3",
    name: "Olivia Davis",
    mobile: "07700 900125",
    email: "olivia.davis@example.com",
    createdAt: new Date(2024, 3, 5),
    updatedAt: new Date(2024, 3, 5),
    lastVisit: new Date(2025, 4, 13),
    consultationFormId: "cf3",
    active: true,
  },
  {
    id: "c4",
    name: "Charlotte Brown",
    mobile: "07700 900126",
    email: "charlotte.brown@example.com",
    createdAt: new Date(2024, 3, 10),
    updatedAt: new Date(2024, 3, 10),
    lastVisit: new Date(2025, 4, 13),
    active: true,
  },
  {
    id: "c5",
    name: "Amelia Wilson",
    mobile: "07700 900127",
    email: "amelia.wilson@example.com",
    createdAt: new Date(2024, 3, 15),
    updatedAt: new Date(2024, 3, 15),
    lastVisit: new Date(2025, 4, 14),
    consultationFormId: "cf4",
    notes: "Sensitive skin",
    active: true,
  },
]

// Sample consultation forms
const INITIAL_CONSULTATION_FORMS: ConsultationForm[] = [
  {
    id: "cf1",
    customerId: "c1",
    completedAt: new Date(2024, 2, 15),
    updatedAt: new Date(2024, 2, 15),
    skinType: "combination",
    allergies: ["Nuts"],
    medicalConditions: ["None"],
    medications: ["None"],
    skinConcerns: ["Fine lines", "Dryness"],
    previousTreatments: ["Facials"],
    lifestyle: {
      waterIntake: "2 liters daily",
      sleepHours: 7,
      stressLevel: "medium",
      exercise: "3 times per week",
      diet: "Balanced",
    },
    preferredProducts: ["Moisturizer", "Serum"],
    consentGiven: true,
    additionalNotes: "Interested in anti-aging treatments",
  },
  {
    id: "cf2",
    customerId: "c2",
    completedAt: new Date(2024, 2, 20),
    updatedAt: new Date(2024, 2, 20),
    skinType: "sensitive",
    allergies: ["Lavender", "Certain fragrances"],
    medicalConditions: ["Eczema"],
    medications: ["Antihistamines occasionally"],
    skinConcerns: ["Redness", "Sensitivity"],
    previousTreatments: ["Gentle facials"],
    lifestyle: {
      waterIntake: "1.5 liters daily",
      sleepHours: 8,
      stressLevel: "low",
      exercise: "Yoga twice weekly",
      diet: "Vegetarian",
    },
    preferredProducts: ["Fragrance-free products"],
    consentGiven: true,
  },
  {
    id: "cf3",
    customerId: "c3",
    completedAt: new Date(2024, 3, 5),
    updatedAt: new Date(2024, 3, 5),
    skinType: "oily",
    allergies: [],
    medicalConditions: ["None"],
    medications: ["None"],
    skinConcerns: ["Acne", "Oiliness"],
    previousTreatments: ["Chemical peels"],
    lifestyle: {
      waterIntake: "3 liters daily",
      sleepHours: 6,
      stressLevel: "high",
      exercise: "Running 4 times weekly",
      diet: "High protein",
    },
    preferredProducts: ["Oil-free moisturizer", "Clay masks"],
    consentGiven: true,
  },
  {
    id: "cf4",
    customerId: "c5",
    completedAt: new Date(2024, 3, 15),
    updatedAt: new Date(2024, 3, 15),
    skinType: "sensitive",
    allergies: ["Certain preservatives"],
    medicalConditions: ["Rosacea"],
    medications: ["Topical prescription"],
    skinConcerns: ["Redness", "Sensitivity", "Dryness"],
    previousTreatments: ["LED light therapy"],
    lifestyle: {
      waterIntake: "2 liters daily",
      sleepHours: 7,
      stressLevel: "medium",
      exercise: "Walking daily",
      diet: "Avoiding spicy foods",
    },
    preferredProducts: ["Gentle cleanser", "Calming serum"],
    consentGiven: true,
    additionalNotes: "Avoids hot rooms and saunas",
  },
]

interface CustomerContextType {
  customers: Customer[]
  consultationForms: ConsultationForm[]
  addCustomer: (customer: Omit<Customer, "id" | "createdAt" | "updatedAt">) => string
  updateCustomer: (id: string, customerData: Partial<Customer>) => void
  deleteCustomer: (id: string) => void
  getCustomerById: (id: string) => Customer | undefined
  getConsultationFormByCustomerId: (customerId: string) => ConsultationForm | undefined
  addConsultationForm: (form: Omit<ConsultationForm, "id" | "updatedAt">) => string
  updateConsultationForm: (id: string, formData: Partial<ConsultationForm>) => void
  generateConsultationFormLink: (customerId: string) => string
  updateCustomerConsultationForm: (customerId: string, formData: Partial<ConsultationForm>) => void
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined)

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [consultationForms, setConsultationForms] = useState<ConsultationForm[]>([])

  useEffect(() => {
    const storedCustomers = localStorage.getItem("gem-n-eyes-customers")
    const storedForms = localStorage.getItem("gem-n-eyes-consultation-forms")

    if (storedCustomers) {
      // Parse dates from JSON
      const parsedCustomers = JSON.parse(storedCustomers, (key, value) => {
        if (key === "createdAt" || key === "updatedAt" || key === "lastVisit") {
          return value ? new Date(value) : undefined
        }
        return value
      })
      setCustomers(parsedCustomers)
    } else {
      setCustomers(INITIAL_CUSTOMERS)
      localStorage.setItem("gem-n-eyes-customers", JSON.stringify(INITIAL_CUSTOMERS))
    }

    if (storedForms) {
      // Parse dates from JSON
      const parsedForms = JSON.parse(storedForms, (key, value) => {
        if (key === "completedAt" || key === "updatedAt") {
          return value ? new Date(value) : undefined
        }
        return value
      })
      setConsultationForms(parsedForms)
    } else {
      setConsultationForms(INITIAL_CONSULTATION_FORMS)
      localStorage.setItem("gem-n-eyes-consultation-forms", JSON.stringify(INITIAL_CONSULTATION_FORMS))
    }
  }, [])

  const addCustomer = (customerData: Omit<Customer, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date()
    const newCustomer: Customer = {
      ...customerData,
      id: `c${uuidv4()}`,
      createdAt: now,
      updatedAt: now,
    }

    const updatedCustomers = [...customers, newCustomer]
    setCustomers(updatedCustomers)
    localStorage.setItem("gem-n-eyes-customers", JSON.stringify(updatedCustomers))
    return newCustomer.id
  }

  const updateCustomer = (id: string, customerData: Partial<Customer>) => {
    const updatedCustomers = customers.map((customer) =>
      customer.id === id
        ? {
            ...customer,
            ...customerData,
            updatedAt: new Date(),
          }
        : customer,
    )
    setCustomers(updatedCustomers)
    localStorage.setItem("gem-n-eyes-customers", JSON.stringify(updatedCustomers))
  }

  const deleteCustomer = (id: string) => {
    // In a real app, you might want to soft delete instead
    const updatedCustomers = customers.filter((customer) => customer.id !== id)
    setCustomers(updatedCustomers)
    localStorage.setItem("gem-n-eyes-customers", JSON.stringify(updatedCustomers))

    // Also delete associated consultation form
    const updatedForms = consultationForms.filter((form) => form.customerId !== id)
    setConsultationForms(updatedForms)
    localStorage.setItem("gem-n-eyes-consultation-forms", JSON.stringify(updatedForms))
  }

  const getCustomerById = (id: string) => {
    return customers.find((customer) => customer.id === id)
  }

  const getConsultationFormByCustomerId = (customerId: string) => {
    return consultationForms.find((form) => form.customerId === customerId)
  }

  const addConsultationForm = (formData: Omit<ConsultationForm, "id" | "updatedAt">) => {
    const now = new Date()
    const newForm: ConsultationForm = {
      ...formData,
      id: `cf${uuidv4()}`,
      updatedAt: now,
    }

    const updatedForms = [...consultationForms, newForm]
    setConsultationForms(updatedForms)
    localStorage.setItem("gem-n-eyes-consultation-forms", JSON.stringify(updatedForms))

    // Update customer with consultation form ID
    const customer = customers.find((c) => c.id === formData.customerId)
    if (customer) {
      updateCustomer(customer.id, { consultationFormId: newForm.id })
    }

    return newForm.id
  }

  const updateConsultationForm = (id: string, formData: Partial<ConsultationForm>) => {
    const updatedForms = consultationForms.map((form) =>
      form.id === id
        ? {
            ...form,
            ...formData,
            updatedAt: new Date(),
          }
        : form,
    )
    setConsultationForms(updatedForms)
    localStorage.setItem("gem-n-eyes-consultation-forms", JSON.stringify(updatedForms))
  }

  const generateConsultationFormLink = (customerId: string) => {
    // In a real app, this would generate a secure token
    // For this demo, we'll just use the customer ID
    return `/consultation-form/${customerId}`
  }

  const updateCustomerConsultationForm = (customerId: string, formData: Partial<ConsultationForm>) => {
    const customer = customers.find((c) => c.id === customerId)
    if (!customer) return

    const formId = customer.consultationFormId
    if (!formId) return

    updateConsultationForm(formId, formData)
  }

  return (
    <CustomerContext.Provider
      value={{
        customers,
        consultationForms,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        getCustomerById,
        getConsultationFormByCustomerId,
        addConsultationForm,
        updateConsultationForm,
        generateConsultationFormLink,
        updateCustomerConsultationForm,
      }}
    >
      {children}
    </CustomerContext.Provider>
  )
}

export function useCustomers() {
  const context = useContext(CustomerContext)
  if (context === undefined) {
    throw new Error("useCustomers must be used within a CustomerProvider")
  }
  return context
}

export function useCustomer() {
  const context = useContext(CustomerContext)
  if (context === undefined) {
    throw new Error("useCustomer must be used within a CustomerProvider")
  }
  return context
}
