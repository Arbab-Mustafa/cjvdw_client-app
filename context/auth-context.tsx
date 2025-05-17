"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { getItem, setItem, removeItem } from "@/data/local-storage"

// Define user types and roles
export type UserRole = "owner" | "therapist" | "manager"
export type EmploymentType = "employed" | "self-employed"

export interface User {
  id: string
  name: string
  username: string
  role: UserRole
  email?: string
  active?: boolean
  employmentType?: EmploymentType
  hourlyRate?: number
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  users: User[]
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  addUser: (user: Omit<User, "id">) => void
  updateUser: (id: string, userData: Partial<User>) => void
  deleteUser: (id: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Initial user data - in a real app, this would come from a database
const INITIAL_USERS: User[] = [
  {
    id: "1",
    name: "Sarah",
    username: "Sarah",
    role: "owner",
    email: "sarah@gemneyessalon.com",
    active: true,
    employmentType: "employed",
  },
  {
    id: "2",
    name: "Danica",
    username: "danica",
    role: "therapist",
    email: "danica@gemneyessalon.com",
    active: true,
    employmentType: "employed",
    hourlyRate: 12.5,
  },
  {
    id: "3",
    name: "Alex",
    username: "alex",
    role: "therapist",
    email: "alex@gemneyessalon.com",
    active: true,
    employmentType: "employed",
    hourlyRate: 13.0,
  },
  {
    id: "4",
    name: "Chelsea",
    username: "chelsea",
    role: "therapist",
    email: "chelsea@gemneyessalon.com",
    active: true,
    employmentType: "employed",
    hourlyRate: 12.75,
  },
  {
    id: "5",
    name: "Kelly",
    username: "kelly",
    role: "therapist",
    email: "kelly@gemneyessalon.com",
    active: true,
    employmentType: "self-employed",
  },
  {
    id: "6",
    name: "Keeley",
    username: "keeley",
    role: "therapist",
    email: "keeley@gemneyessalon.com",
    active: true,
    employmentType: "employed",
    hourlyRate: 12.5,
  },
  {
    id: "7",
    name: "Steph",
    username: "steph",
    role: "therapist",
    email: "steph@gemneyessalon.com",
    active: true,
    employmentType: "self-employed",
  },
  {
    id: "8",
    name: "Eleni",
    username: "eleni",
    role: "therapist",
    email: "eleni@gemneyessalon.com",
    active: true,
    employmentType: "self-employed",
  },
  {
    id: "9",
    name: "Checkout",
    username: "checkout",
    role: "manager",
    email: "checkout@gemneyessalon.com",
    active: true,
    employmentType: "employed",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>(INITIAL_USERS)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check for existing session on load
  useEffect(() => {
    const storedUser = getItem<User>("user")
    const storedUsers = getItem<User[]>("users")

    if (storedUser) {
      setUser(storedUser)
    }

    if (storedUsers) {
      setUsers(storedUsers)
    } else {
      // Initialize users in localStorage if not present
      setItem("users", INITIAL_USERS)
    }

    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate authentication delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Special case for Sarah with specific password
    if (username.toLowerCase() === "sarah" && password === "Westhouse202!") {
      const sarahUser = users.find((u) => u.username.toLowerCase() === "sarah")
      if (sarahUser) {
        setUser(sarahUser)
        setItem("user", sarahUser)
        setIsLoading(false)
        return true
      }
    }

    // For Checkout user (manager role)
    if (username.toLowerCase() === "checkout" && password === "Password") {
      const checkoutUser = users.find((u) => u.username.toLowerCase() === "checkout")
      if (checkoutUser) {
        setUser(checkoutUser)
        setItem("user", checkoutUser)
        setIsLoading(false)
        return true
      }
    }

    // For other users, just check username (in a real app, you'd verify passwords)
    const foundUser = users.find((u) => u.username.toLowerCase() === username.toLowerCase() && u.active !== false)

    if (foundUser) {
      // In a real app, you would verify the password here
      setUser(foundUser)
      setItem("user", foundUser)
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    removeItem("user")
    router.push("/")
  }

  const addUser = (userData: Omit<User, "id">) => {
    const newUser = {
      ...userData,
      id: `${users.length + 1}`,
      active: userData.active !== undefined ? userData.active : true,
    }

    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)
    setItem("users", updatedUsers)
  }

  const updateUser = (id: string, userData: Partial<User>) => {
    const updatedUsers = users.map((user) => (user.id === id ? { ...user, ...userData } : user))
    setUsers(updatedUsers)
    setItem("users", updatedUsers)

    // If the current user is updated, update the session
    if (user && user.id === id) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      setItem("user", updatedUser)
    }
  }

  const deleteUser = (id: string) => {
    // In a real app, you might want to soft delete instead
    const updatedUsers = users.filter((user) => user.id !== id)
    setUsers(updatedUsers)
    setItem("users", updatedUsers)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        users,
        login,
        logout,
        addUser,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
