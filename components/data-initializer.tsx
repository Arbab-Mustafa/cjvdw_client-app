"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { generateMonthOfData, clearAllData } from "@/data/data-initializer"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"

export default function DataInitializer() {
  const [isInitialized, setIsInitialized] = useState(false)
  const { user } = useAuth()

  // Only initialize data once
  useEffect(() => {
    if (!isInitialized) {
      generateMonthOfData()
      setIsInitialized(true)
    }
  }, [isInitialized])

  // Only show the clear data button to the owner
  if (!user || user.role !== "owner") {
    return null
  }

  const handleClearData = () => {
    clearAllData()
    toast.success("All test data has been cleared")
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
          Clear Test Data
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear All Test Data?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove all transactions and hours data from the system. This action cannot be undone. Only do this
            when you are ready to go into production.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleClearData} className="bg-red-600 hover:bg-red-700">
            Clear All Data
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
