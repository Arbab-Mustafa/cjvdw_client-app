import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DatabaseInitializer from "@/components/database-initializer"
import Image from "next/image"

export default function SetupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-3xl space-y-8">
        <div className="flex flex-col items-center space-y-2">
          <div className="relative w-40 h-16">
            <Image src="/gemneyes-logo.png" alt="GemnEyes Hair and Beauty" fill className="object-contain" priority />
          </div>
          <h1 className="text-2xl font-bold text-center">EPOS System Setup</h1>
          <p className="text-muted-foreground text-center">Complete the following steps to set up your EPOS system</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Step 1: Database Setup</CardTitle>
            <CardDescription>Set up the database tables and initial data</CardDescription>
          </CardHeader>
          <CardContent>
            <DatabaseInitializer />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
