export interface Customer {
  id: string
  name: string
  mobile: string
  email: string
  createdAt: Date
  updatedAt: Date
  lastVisit?: Date
  consultationFormId?: string
  notes?: string
  active: boolean
}

export interface ConsultationForm {
  id: string
  customerId: string
  completedAt?: Date
  updatedAt: Date
  skinType?: "normal" | "dry" | "oily" | "combination" | "sensitive"
  allergies: string[]
  medicalConditions: string[]
  medications: string[]
  skinConcerns: string[]
  previousTreatments: string[]
  lifestyle: {
    waterIntake?: string
    sleepHours?: number
    stressLevel?: "low" | "medium" | "high"
    exercise?: string
    diet?: string
  }
  preferredProducts?: string[]
  consentGiven: boolean
  signature?: string
  additionalNotes?: string
}

export interface ConsultationQuestion {
  id: string
  question: string
  type: "text" | "checkbox" | "radio" | "select" | "textarea"
  options?: string[]
  required: boolean
  category: string
}
