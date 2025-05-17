"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { AlertCircle, CheckCircle2, Copy, Database } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DatabaseInitializer() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [needsManualSetup, setNeedsManualSetup] = useState(false)

  const initializeDatabase = async () => {
    setIsInitializing(true)
    setError(null)
    setNeedsManualSetup(false)

    try {
      // Fetch the SQL script
      const response = await fetch("/api/init-database", {
        method: "POST",
      })
      const result = await response.json()

      if (result.success) {
        toast.success("Database initialized successfully")
        setIsComplete(true)
      } else if (result.needsManualSetup) {
        setNeedsManualSetup(true)
        setError("Manual setup required")
      } else {
        throw new Error(result.error || "Failed to initialize database")
      }
    } catch (error: any) {
      console.error("Error initializing database:", error)
      setError(error.message || "Failed to initialize database")
      toast.error("Failed to initialize database")
    } finally {
      setIsInitializing(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      const response = await fetch("/db/schema.sql")
      const sql = await response.text()
      await navigator.clipboard.writeText(sql)
      toast.success("SQL copied to clipboard")
    } catch (error) {
      toast.error("Failed to copy SQL")
    }
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Database Setup</CardTitle>
        <CardDescription>Set up the database for GemnEyes Hair and Beauty EPOS system</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="automatic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="automatic">Automatic Setup</TabsTrigger>
            <TabsTrigger value="manual">Manual Setup</TabsTrigger>
          </TabsList>
          <TabsContent value="automatic" className="space-y-4 pt-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                This will attempt to automatically set up your database with all necessary tables:
              </p>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Users and therapists</li>
                <li>Customers and consultation forms</li>
                <li>Services and categories</li>
                <li>Transactions and reports</li>
                <li>System settings and branding</li>
              </ul>
            </div>

            {error && !needsManualSetup && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800">Initialization failed</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            {needsManualSetup && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Manual setup required</p>
                  <p className="text-sm text-amber-700 mt-1">
                    Please switch to the "Manual Setup" tab and follow the instructions.
                  </p>
                </div>
              </div>
            )}

            {isComplete && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-800">Database initialized successfully</p>
                  <p className="text-sm text-green-700 mt-1">You can now proceed to the next step.</p>
                </div>
              </div>
            )}

            <Button
              onClick={initializeDatabase}
              disabled={isInitializing || isComplete}
              className="w-full bg-pink-600 hover:bg-pink-700"
            >
              {isInitializing ? "Initializing..." : isComplete ? "Database Initialized" : "Initialize Database"}
            </Button>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4 pt-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Follow these steps to manually set up your database:</p>
              <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-3">
                <li>
                  <p>Go to your Supabase project dashboard</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-1"
                    onClick={() => window.open("https://app.supabase.com", "_blank")}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Open Supabase Dashboard
                  </Button>
                </li>
                <li>
                  <p>Navigate to the SQL Editor</p>
                </li>
                <li>
                  <p>Copy the SQL below and paste it into the SQL Editor</p>
                  <Button variant="outline" size="sm" className="mt-1" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy SQL to Clipboard
                  </Button>
                </li>
                <li>
                  <p>Click "Run" to execute the SQL and create all necessary tables</p>
                </li>
                <li>
                  <p>Return to this page and click "Verify Setup" below</p>
                </li>
              </ol>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
              <p className="text-sm font-medium mb-2">SQL Schema</p>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-60">
                {`-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users/Therapists table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  -- More fields omitted for brevity
);

-- More tables omitted for brevity

-- Insert default data
INSERT INTO service_categories (id, name)
VALUES
  ('facials', 'Facials'),
  ('waxing', 'Waxing'),
  -- More categories omitted for brevity
);`}
              </pre>
            </div>

            <Button onClick={initializeDatabase} className="w-full bg-pink-600 hover:bg-pink-700">
              Verify Setup
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
