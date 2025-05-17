"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import DashboardHeader from "@/components/dashboard-header"
import Logo from "@/components/logo"
import { settingsService } from "@/lib/supabase-service"

export default function BrandingPage() {
  const [logoUrl, setLogoUrl] = useState("")
  const [logoAlt, setLogoAlt] = useState("GemnEyes Hair and Beauty")
  const [logoWidth, setLogoWidth] = useState(300)
  const [logoHeight, setLogoHeight] = useState(150)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const logo = await settingsService.getLogo()
        if (logo) {
          setLogoUrl(logo.url)
          setLogoAlt(logo.alt)
          setLogoWidth(logo.width)
          setLogoHeight(logo.height)
        }
      } catch (error) {
        console.error("Error fetching logo:", error)
        toast.error("Failed to fetch logo settings")
      } finally {
        setIsFetching(false)
      }
    }

    fetchLogo()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await settingsService.updateLogo({
        url: logoUrl,
        alt: logoAlt,
        width: logoWidth,
        height: logoHeight,
      })

      if (success) {
        toast.success("Logo settings updated successfully")
      } else {
        toast.error("Failed to update logo settings")
      }
    } catch (error) {
      console.error("Error updating logo:", error)
      toast.error("An error occurred while updating logo settings")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 pt-20 pb-10">
        <h1 className="text-2xl font-bold text-pink-800 mb-6">Branding Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Logo Preview</CardTitle>
              <CardDescription>Current logo appearance</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {isFetching ? (
                <div className="w-64 h-32 bg-gray-100 animate-pulse rounded" />
              ) : (
                <Logo width={256} height={128} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Logo Settings</CardTitle>
              <CardDescription>Update your logo configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input
                    id="logoUrl"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logoAlt">Alt Text</Label>
                  <Input
                    id="logoAlt"
                    value={logoAlt}
                    onChange={(e) => setLogoAlt(e.target.value)}
                    placeholder="Company Logo"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="logoWidth">Width</Label>
                    <Input
                      id="logoWidth"
                      type="number"
                      value={logoWidth}
                      onChange={(e) => setLogoWidth(Number(e.target.value))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logoHeight">Height</Label>
                    <Input
                      id="logoHeight"
                      type="number"
                      value={logoHeight}
                      onChange={(e) => setLogoHeight(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
