export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          username: string
          email: string | null
          role: "owner" | "therapist" | "manager"
          employment_type: "employed" | "self-employed" | null
          hourly_rate: number | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          username: string
          email?: string | null
          role: "owner" | "therapist" | "manager"
          employment_type?: "employed" | "self-employed" | null
          hourly_rate?: number | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          username?: string
          email?: string | null
          role?: "owner" | "therapist" | "manager"
          employment_type?: "employed" | "self-employed" | null
          hourly_rate?: number | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          name: string
          mobile: string
          email: string | null
          notes: string | null
          active: boolean
          last_visit: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          mobile: string
          email?: string | null
          notes?: string | null
          active?: boolean
          last_visit?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          mobile?: string
          email?: string | null
          notes?: string | null
          active?: boolean
          last_visit?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      settings: {
        Row: {
          key: string
          value: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          key: string
          value: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          key?: string
          value?: Json
          created_at?: string
          updated_at?: string
        }
      }
      consultation_forms: {
        Row: {
          id: string
          customer_id: string
          skin_type: string | null
          allergies: Json | null
          medical_conditions: Json | null
          medications: Json | null
          skin_concerns: Json | null
          previous_treatments: Json | null
          lifestyle: Json | null
          preferred_products: Json | null
          consent_given: boolean
          additional_notes: string | null
          completed_at: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          skin_type?: string | null
          allergies?: Json | null
          medical_conditions?: Json | null
          medications?: Json | null
          skin_concerns?: Json | null
          previous_treatments?: Json | null
          lifestyle?: Json | null
          preferred_products?: Json | null
          consent_given?: boolean
          additional_notes?: string | null
          completed_at?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          skin_type?: string | null
          allergies?: Json | null
          medical_conditions?: Json | null
          medications?: Json | null
          skin_concerns?: Json | null
          previous_treatments?: Json | null
          lifestyle?: Json | null
          preferred_products?: Json | null
          consent_given?: boolean
          additional_notes?: string | null
          completed_at?: string | null
          updated_at?: string
        }
      }
      service_categories: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          duration: number | null
          category_id: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          duration?: number | null
          category_id?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          duration?: number | null
          category_id?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          date: string
          customer_id: string | null
          therapist_id: string | null
          service_id: string | null
          amount: number
          discount: number
          payment_method: "Card" | "Cash"
          created_at: string
        }
        Insert: {
          id?: string
          date?: string
          customer_id?: string | null
          therapist_id?: string | null
          service_id?: string | null
          amount: number
          discount?: number
          payment_method: "Card" | "Cash"
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          customer_id?: string | null
          therapist_id?: string | null
          service_id?: string | null
          amount?: number
          discount?: number
          payment_method?: "Card" | "Cash"
          created_at?: string
        }
      }
      therapist_hours: {
        Row: {
          id: string
          therapist_id: string
          date: string
          hours: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          therapist_id: string
          date: string
          hours: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          therapist_id?: string
          date?: string
          hours?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
