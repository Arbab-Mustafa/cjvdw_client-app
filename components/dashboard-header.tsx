"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Home, ShoppingCart, BarChart3, User, LogOut, Menu, X, Users, Scissors, UserCircle, Clock } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import Logo from "./logo"

export default function DashboardHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  // If user is manager (checkout), only show the user menu
  if (user?.role === "manager") {
    return (
      <header className="fixed top-0 right-0 z-10 p-4">
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5 text-pink-600" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{user?.name || "Checkout"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    )
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-pink-200 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href={user?.role === "owner" ? "/dashboard" : "/pos"} className="flex items-center">
              <Logo width={96} height={32} className="mr-2" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {user?.role === "owner" && (
              <>
                <Button variant="ghost" size="sm" className="text-pink-700" asChild>
                  <Link href="/dashboard">
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" className="text-pink-700" asChild>
                  <Link href="/users">
                    <Users className="mr-2 h-4 w-4" />
                    Users
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" className="text-pink-700" asChild>
                  <Link href="/services">
                    <Scissors className="mr-2 h-4 w-4" />
                    Services
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" className="text-pink-700" asChild>
                  <Link href="/hours">
                    <Clock className="mr-2 h-4 w-4" />
                    Hours
                  </Link>
                </Button>
              </>
            )}
            <Button variant="ghost" size="sm" className="text-pink-700" asChild>
              <Link href="/pos">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Checkout
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="text-pink-700" asChild>
              <Link href="/customers">
                <UserCircle className="mr-2 h-4 w-4" />
                Customers
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="text-pink-700" asChild>
              <Link href="/reports">
                <BarChart3 className="mr-2 h-4 w-4" />
                Reports
              </Link>
            </Button>
          </nav>

          {/* User Menu */}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5 text-pink-600" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user?.name || "User"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden ml-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6 text-pink-600" /> : <Menu className="h-6 w-6 text-pink-600" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white border-t border-pink-100 py-2">
          <div className="container mx-auto px-4 space-y-1">
            {user?.role === "owner" && (
              <>
                <Button variant="ghost" size="sm" className="w-full justify-start text-pink-700" asChild>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-pink-700" asChild>
                  <Link href="/users" onClick={() => setMobileMenuOpen(false)}>
                    <Users className="mr-2 h-4 w-4" />
                    Users
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-pink-700" asChild>
                  <Link href="/services" onClick={() => setMobileMenuOpen(false)}>
                    <Scissors className="mr-2 h-4 w-4" />
                    Services
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-pink-700" asChild>
                  <Link href="/hours" onClick={() => setMobileMenuOpen(false)}>
                    <Clock className="mr-2 h-4 w-4" />
                    Hours
                  </Link>
                </Button>
              </>
            )}
            <Button variant="ghost" size="sm" className="w-full justify-start text-pink-700" asChild>
              <Link href="/pos" onClick={() => setMobileMenuOpen(false)}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Checkout
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start text-pink-700" asChild>
              <Link href="/customers" onClick={() => setMobileMenuOpen(false)}>
                <UserCircle className="mr-2 h-4 w-4" />
                Customers
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start text-pink-700" asChild>
              <Link href="/reports" onClick={() => setMobileMenuOpen(false)}>
                <BarChart3 className="mr-2 h-4 w-4" />
                Reports
              </Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  )
}
