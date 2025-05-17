"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User, Search, X } from "lucide-react"
import { useAuth } from "@/context/auth-context"

interface TherapistSelectorProps {
  onSelect: (therapist: { id: string; name: string }) => void
  onClose: () => void
}

export function TherapistSelector({ onSelect, onClose }: TherapistSelectorProps) {
  const { users } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  // Filter therapists only
  const therapists = users.filter((user) => user.role === "therapist" && user.active !== false)

  // Filter by search query
  const filteredTherapists = therapists.filter((therapist) =>
    therapist.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-pink-800">Select Therapist</DialogTitle>
        </DialogHeader>

        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search therapists..."
            className="pl-8 border-pink-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-7 w-7"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>

        <ScrollArea className="mt-4 max-h-[300px] pr-4">
          <div className="space-y-2">
            {filteredTherapists.length > 0 ? (
              filteredTherapists.map((therapist) => (
                <Button
                  key={therapist.id}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3 px-4 hover:bg-pink-50"
                  onClick={() => onSelect({ id: therapist.id, name: therapist.name })}
                >
                  <div className="flex items-center">
                    <User className="mr-2 h-5 w-5 text-pink-600" />
                    <div className="font-medium">{therapist.name}</div>
                  </div>
                </Button>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">No therapists found</div>
            )}
          </div>
        </ScrollArea>

        <Button variant="outline" onClick={onClose} className="mt-2">
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  )
}
