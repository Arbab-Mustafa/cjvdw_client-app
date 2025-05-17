"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface LogoProps {
  width?: number
  height?: number
  className?: string
}

export default function Logo({ width = 120, height = 50, className = "" }: LogoProps) {
  const [logoSrc, setLogoSrc] = useState("/gemneyes-logo.png")
  const [logoAlt, setLogoAlt] = useState("GemnEyes Hair and Beauty")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch("/api/settings/logo")

        if (response.ok) {
          const data = await response.json()
          setLogoSrc(data.url)
          setLogoAlt(data.alt || "GemnEyes Hair and Beauty")
        } else {
          // If API fails, silently fall back to the static logo
          console.warn("Could not fetch logo from API, using static logo")
        }
      } catch (error) {
        // If there's an error, silently fall back to the static logo
        console.warn("Error fetching logo, using static logo:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLogo()
  }, [])

  // Always render the image, even during loading, to prevent layout shifts
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <Image
        src={logoSrc || "/placeholder.svg"}
        alt={logoAlt}
        width={width}
        height={height}
        className={`object-contain transition-opacity ${isLoading ? "opacity-0" : "opacity-100"}`}
        priority
        onError={() => {
          // If the image fails to load, fall back to the static logo
          setLogoSrc("/gemneyes-logo.png")
          setIsLoading(false)
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}
