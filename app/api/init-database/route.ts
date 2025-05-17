import { createServerSupabaseClient } from "@/lib/supabase-service"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = createServerSupabaseClient()

    // Check if tables exist by trying to query the users table
    const { data: usersData, error: usersError } = await supabase.from("users").select("id").limit(1)

    if (usersError && usersError.code === "42P01") {
      // Table doesn't exist, need manual setup
      return NextResponse.json(
        {
          success: false,
          error: "Database tables don't exist. Please follow the manual setup instructions.",
          needsManualSetup: true,
        },
        { status: 400 },
      )
    }

    // If we get here, either tables exist or there was a different error
    if (usersError) {
      console.error("Error checking users table:", usersError)
      return NextResponse.json({ success: false, error: usersError.message }, { status: 500 })
    }

    // Tables exist, check if we need to insert initial data
    if (!usersData || usersData.length === 0) {
      // Insert default admin user
      const { error: adminError } = await supabase.from("users").insert([
        {
          name: "Admin",
          username: "admin",
          email: "admin@gemneyes.com",
          role: "owner",
          active: true,
        },
      ])

      if (adminError) {
        console.error("Error creating admin user:", adminError)
        return NextResponse.json({ success: false, error: adminError.message }, { status: 500 })
      }
    }

    // Check service categories
    const { data: categoriesData, error: categoriesCheckError } = await supabase
      .from("service_categories")
      .select("id")
      .limit(1)

    if (!categoriesCheckError && (!categoriesData || categoriesData.length === 0)) {
      // Insert service categories
      const { error: categoriesError } = await supabase.from("service_categories").insert([
        { id: "facials", name: "Facials" },
        { id: "waxing", name: "Waxing" },
        { id: "body", name: "Body" },
        { id: "hands-feet", name: "Hands & Feet" },
        { id: "eyes", name: "Eyes" },
        { id: "hot-wax", name: "Hot Wax" },
        { id: "sunbed", name: "Sunbed" },
        { id: "products-vouchers", name: "Products & Vouchers" },
      ])

      if (categoriesError) {
        console.error("Error creating service categories:", categoriesError)
        return NextResponse.json({ success: false, error: categoriesError.message }, { status: 500 })
      }
    }

    // Check settings table
    const { data: settingsData, error: settingsCheckError } = await supabase
      .from("settings")
      .select("key")
      .eq("key", "logo")
      .limit(1)

    if (!settingsCheckError && (!settingsData || settingsData.length === 0)) {
      // Insert logo setting
      const { error: logoError } = await supabase.from("settings").insert([
        {
          key: "logo",
          value: {
            url: "/gemneyes-logo.png",
            alt: "GemnEyes Hair and Beauty",
            width: 120,
            height: 50,
          },
        },
      ])

      if (logoError) {
        console.error("Error creating logo setting:", logoError)
        // Don't return error for this, as it's not critical
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error initializing database:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
