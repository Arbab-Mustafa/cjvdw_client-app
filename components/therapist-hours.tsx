"use client"

import { useState } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/context/auth-context"
import { useHours } from "@/context/hours-context"
import { toast } from "sonner"

export default function TherapistHours() {
  const { users, user } = useAuth()
  const { hours, addHours, getHoursForTherapist, calculateCommission } = useHours()

  const isOwner = user?.role === "owner"

  // State
  const [selectedTherapist, setSelectedTherapist] = useState<string>(isOwner ? "" : user?.id || "")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [hoursWorked, setHoursWorked] = useState<string>("8")
  const [month, setMonth] = useState<Date>(new Date())

  // Get start and end of selected month
  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)

  // Get all days in the month
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get therapist details
  const therapist = users.find((u) => u.id === selectedTherapist)

  // Calculate commission for the selected month
  const commission = selectedTherapist ? calculateCommission(selectedTherapist, monthStart, monthEnd) : null

  // Handle adding hours
  const handleAddHours = () => {
    if (!selectedTherapist) {
      toast.error("Please select a therapist")
      return
    }

    const hours = Number.parseFloat(hoursWorked)
    if (isNaN(hours) || hours <= 0) {
      toast.error("Please enter valid hours")
      return
    }

    const dateString = format(selectedDate, "yyyy-MM-dd")
    addHours(selectedTherapist, dateString, hours)
    toast.success(`Added ${hours} hours for ${therapist?.name} on ${format(selectedDate, "dd MMM yyyy")}`)
  }

  // Get hours for a specific day
  const getHoursForDay = (therapistId: string, date: Date) => {
    const dateString = format(date, "yyyy-MM-dd")
    const entry = hours.find((h) => h.therapistId === therapistId && h.date === dateString)
    return entry ? entry.hours : 0
  }

  // Get total hours for the month
  const totalHours = selectedTherapist ? getHoursForTherapist(selectedTherapist, monthStart, monthEnd) : 0

  return (
    <div className="space-y-6">
      {/* Therapist Selection */}
      <Card className="border-pink-200">
        <CardHeader>
          <CardTitle>Therapist Hours & Commission</CardTitle>
          <CardDescription>Track hours worked and calculate commission for therapists</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="therapist">Select Therapist</Label>
              <Select
                value={selectedTherapist}
                onValueChange={setSelectedTherapist}
                disabled={!isOwner && user?.id !== selectedTherapist}
              >
                <SelectTrigger id="therapist" className="border-pink-200">
                  <SelectValue placeholder="Select a therapist" />
                </SelectTrigger>
                <SelectContent>
                  {users
                    .filter((u) => u.role === "therapist")
                    .map((therapist) => (
                      <SelectItem key={therapist.id} value={therapist.id}>
                        {therapist.name} ({therapist.employmentType === "employed" ? "Employed" : "Self-employed"})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="month">Month</Label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="border-pink-200"
                  onClick={() => {
                    const prevMonth = new Date(month)
                    prevMonth.setMonth(prevMonth.getMonth() - 1)
                    setMonth(prevMonth)
                  }}
                >
                  Previous
                </Button>
                <span className="flex-1 text-center">{format(month, "MMMM yyyy")}</span>
                <Button
                  variant="outline"
                  className="border-pink-200"
                  onClick={() => {
                    const nextMonth = new Date(month)
                    nextMonth.setMonth(nextMonth.getMonth() + 1)
                    setMonth(nextMonth)
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>

          {selectedTherapist && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Add Hours for a Specific Day</Label>
                <div className="mt-2 border rounded-md p-2 border-pink-200">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    month={month}
                    onMonthChange={setMonth}
                    className="rounded-md border-0"
                    modifiers={{
                      hasHours: (date) => getHoursForDay(selectedTherapist, date) > 0,
                    }}
                    modifiersClassNames={{
                      hasHours: "bg-pink-100 font-bold text-pink-800",
                    }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="hours">Hours Worked on {format(selectedDate, "dd MMM yyyy")}</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Input
                      id="hours"
                      type="number"
                      min="0"
                      step="0.5"
                      value={hoursWorked}
                      onChange={(e) => setHoursWorked(e.target.value)}
                      className="border-pink-200"
                    />
                    <Button className="bg-pink-600 hover:bg-pink-700" onClick={handleAddHours}>
                      Add Hours
                    </Button>
                  </div>

                  {getHoursForDay(selectedTherapist, selectedDate) > 0 && (
                    <p className="text-sm text-pink-600 mt-1">
                      Currently logged: {getHoursForDay(selectedTherapist, selectedDate)} hours
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-pink-100">
                  <h3 className="font-medium mb-2">Hours Summary for {format(month, "MMMM yyyy")}</h3>
                  <p>
                    Total Hours: <span className="font-bold">{totalHours}</span>
                  </p>

                  {therapist?.employmentType === "employed" && therapist.hourlyRate && (
                    <p className="mt-1">
                      Base Wage: <span className="font-bold">£{(totalHours * therapist.hourlyRate).toFixed(2)}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Commission Calculation */}
      {selectedTherapist && commission && (
        <Card className="border-pink-200">
          <CardHeader>
            <CardTitle>Commission Calculation for {therapist?.name}</CardTitle>
            <CardDescription>{format(month, "MMMM yyyy")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Total Revenue</TableCell>
                  <TableCell className="text-right font-medium">£{commission.revenue.toFixed(2)}</TableCell>
                </TableRow>

                {therapist?.employmentType === "employed" ? (
                  <>
                    <TableRow>
                      <TableCell>Hours Worked</TableCell>
                      <TableCell className="text-right">{commission.hours}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Base Wage (£{therapist.hourlyRate}/hr)</TableCell>
                      <TableCell className="text-right">£{commission.wage.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Holiday Pay (12%)</TableCell>
                      <TableCell className="text-right">£{commission.holidayPay.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Employer NIC (13.8%)</TableCell>
                      <TableCell className="text-right">£{commission.employerNIC.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Commission (10% after costs)</TableCell>
                      <TableCell className="text-right">£{commission.commission.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow className="bg-pink-50">
                      <TableCell className="font-bold">Total Therapist Earnings</TableCell>
                      <TableCell className="text-right font-bold">£{commission.therapistShare.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow className="bg-pink-50">
                      <TableCell className="font-bold">Salon Revenue</TableCell>
                      <TableCell className="text-right font-bold">£{commission.salonShare.toFixed(2)}</TableCell>
                    </TableRow>
                  </>
                ) : (
                  <>
                    <TableRow>
                      <TableCell>Therapist Share (40%)</TableCell>
                      <TableCell className="text-right">£{commission.therapistShare.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow className="bg-pink-50">
                      <TableCell className="font-bold">Salon Share (60%)</TableCell>
                      <TableCell className="text-right font-bold">£{commission.salonShare.toFixed(2)}</TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full border-pink-200">
              Export Commission Report
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Hours Log */}
      {selectedTherapist && hours.filter((h) => h.therapistId === selectedTherapist).length > 0 && (
        <Card className="border-pink-200">
          <CardHeader>
            <CardTitle>Hours Log for {therapist?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hours
                  .filter((h) => h.therapistId === selectedTherapist)
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{format(new Date(entry.date), "dd MMM yyyy")}</TableCell>
                      <TableCell className="text-right">{entry.hours}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
