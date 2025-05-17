import { NextResponse } from "next/server"
import { settingsService } from "@/lib/supabase-service"

export async function GET() {
  try {
    const logo = await settingsService.getLogo()

    if (!logo) {
      // Return a default logo configuration instead of an error
      return NextResponse.json({
        url: "/gemneyes-logo.png",
        alt: "GemnEyes Hair and Beauty",
        width: 300,
        height: 150,
      })
    }

    return NextResponse.json(logo)
  } catch (error) {
    console.error("Error fetching logo:", error)
    // Return a default logo configuration in case of any error
    return NextResponse.json({
      url: "/gemneyes-logo.png",
      alt: "GemnEyes Hair and Beauty",
      width: 300,
      height: 150,
    })
  }
}
