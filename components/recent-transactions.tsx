"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState, useEffect } from "react"
import { getTransactionsForDateRange } from "@/data/reports-data"
import { format } from "date-fns"

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    // Get transactions from the last 7 days
    const today = new Date()
    const lastWeek = new Date(today)
    lastWeek.setDate(lastWeek.getDate() - 7)

    const recentTransactions = getTransactionsForDateRange(lastWeek, today)
    setTransactions(recentTransactions.slice(0, 5)) // Show only the 5 most recent
  }, [])

  return (
    <Card className="border-pink-200">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Therapist</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {format(new Date(transaction.date), "dd MMM yyyy")}
                    <div className="text-xs text-muted-foreground">{format(new Date(transaction.date), "h:mm a")}</div>
                  </TableCell>
                  <TableCell>
                    {transaction.service}
                    <div className="text-xs text-muted-foreground">{transaction.customer}</div>
                  </TableCell>
                  <TableCell>{transaction.therapist}</TableCell>
                  <TableCell className="text-right font-medium">
                    £{(transaction.amount - transaction.discount).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                  No recent transactions
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
