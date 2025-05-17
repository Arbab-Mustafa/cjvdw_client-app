import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Create a single supabase client for the browser
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Server-side client (for API routes)
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient<Database>(supabaseUrl, supabaseServiceKey)
}

// Settings service
export const settingsService = {
  async getLogo() {
    try {
      const { data, error } = await supabase.from("settings").select("value").eq("key", "logo").single()

      if (error) {
        // If the error is because the table doesn't exist, return null instead of throwing
        if (error.code === "42P01" || error.message.includes("does not exist")) {
          console.warn("Settings table does not exist yet. Using default logo.")
          return null
        }
        console.error("Error fetching logo:", error)
        return null
      }

      return data?.value as {
        url: string
        alt: string
        width: number
        height: number
      } | null
    } catch (error) {
      console.error("Unexpected error fetching logo:", error)
      return null
    }
  },

  async updateLogo(logoData: {
    url: string
    alt: string
    width: number
    height: number
  }) {
    try {
      const { error } = await supabase.from("settings").upsert({
        key: "logo",
        value: logoData,
      })

      if (error) {
        console.error("Error updating logo:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Unexpected error updating logo:", error)
      return false
    }
  },
}
