"use client"

import type React from "react"

import { useState } from "react"
import { useCustomers } from "@/context/customer-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  UserPlus,
  Search,
  FileText,
  Copy,
  ClipboardCheck,
  Eye,
  Mail,
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import type { Customer } from "@/types/customer"

type CustomerFormData = {
  name: string
  mobile: string
  email: string
  notes: string
  active: boolean
}

const initialFormData: CustomerFormData = {
  name: "",
  mobile: "",
  email: "",
  notes: "",
  active: true,
}

export default function CustomerManagement() {
  const { customers, addCustomer, updateCustomer, deleteCustomer, generateConsultationFormLink } = useCustomers()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [formData, setFormData] = useState<CustomerFormData>(initialFormData)
  const [currentCustomerId, setCurrentCustomerId] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<Partial<CustomerFormData>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "active" | "inactive">("all")

  const resetForm = () => {
    setFormData(initialFormData)
    setFormErrors({})
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (formErrors[name as keyof CustomerFormData]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, active: checked }))
  }

  const validateForm = (): boolean => {
    const errors: Partial<CustomerFormData> = {}

    if (!formData.name.trim()) errors.name = "Name is required"
    if (!formData.mobile.trim()) errors.mobile = "Mobile number is required"
    if (!formData.email.trim()) errors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAddCustomer = () => {
    if (!validateForm()) return

    // Check if mobile or email already exists
    if (customers.some((customer) => customer.mobile === formData.mobile)) {
      setFormErrors((prev) => ({ ...prev, mobile: "Mobile number already exists" }))
      return
    }

    if (customers.some((customer) => customer.email.toLowerCase() === formData.email.toLowerCase())) {
      setFormErrors((prev) => ({ ...prev, email: "Email already exists" }))
      return
    }

    const newCustomerId = addCustomer({
      name: formData.name,
      mobile: formData.mobile,
      email: formData.email,
      notes: formData.notes || undefined,
      active: formData.active,
    })

    toast.success(`${formData.name} has been added successfully`)
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditCustomer = () => {
    if (!currentCustomerId || !validateForm()) return

    // Check if mobile or email already exists (excluding current customer)
    if (customers.some((customer) => customer.id !== currentCustomerId && customer.mobile === formData.mobile)) {
      setFormErrors((prev) => ({ ...prev, mobile: "Mobile number already exists" }))
      return
    }

    if (
      customers.some(
        (customer) =>
          customer.id !== currentCustomerId && customer.email.toLowerCase() === formData.email.toLowerCase(),
      )
    ) {
      setFormErrors((prev) => ({ ...prev, email: "Email already exists" }))
      return
    }

    updateCustomer(currentCustomerId, {
      name: formData.name,
      mobile: formData.mobile,
      email: formData.email,
      notes: formData.notes || undefined,
      active: formData.active,
    })

    toast.success(`${formData.name} has been updated successfully`)
    setIsEditDialogOpen(false)
    resetForm()
  }

  const handleDeleteCustomer = () => {
    if (!currentCustomerId) return

    const customerToDelete = customers.find((customer) => customer.id === currentCustomerId)
    if (!customerToDelete) return

    deleteCustomer(currentCustomerId)
    toast.success(`${customerToDelete.name} has been deleted`)
    setIsDeleteDialogOpen(false)
    setCurrentCustomerId(null)
  }

  const openEditDialog = (customer: Customer) => {
    setCurrentCustomerId(customer.id)
    setFormData({
      name: customer.name,
      mobile: customer.mobile,
      email: customer.email,
      notes: customer.notes || "",
      active: customer.active,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (customerId: string) => {
    setCurrentCustomerId(customerId)
    setIsDeleteDialogOpen(true)
  }

  const openViewDialog = (customer: Customer) => {
    setCurrentCustomerId(customer.id)
    setFormData({
      name: customer.name,
      mobile: customer.mobile,
      email: customer.email,
      notes: customer.notes || "",
      active: customer.active,
    })
    setIsViewDialogOpen(true)
  }

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
    toast.success(message)
  }

  const sendConsultationFormEmail = (customer: Customer) => {
    // In a real app, this would send an email
    // For this demo, we'll just show a toast
    toast.success(`Consultation form link sent to ${customer.email}`)
  }

  // Filter customers based on search query and active tab
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.mobile.includes(searchQuery)

    if (activeTab === "all") return matchesSearch
    if (activeTab === "active") return matchesSearch && customer.active
    if (activeTab === "inactive") return matchesSearch && !customer.active

    return matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="pl-8 border-pink-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pink-600 hover:bg-pink-700" onClick={resetForm}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>Create a new customer record.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={formErrors.name ? "border-red-500" : ""}
                />
                {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className={formErrors.mobile ? "border-red-500" : ""}
                />
                {formErrors.mobile && <p className="text-xs text-red-500">{formErrors.mobile}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={formErrors.email ? "border-red-500" : ""}
                />
                {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="resize-none"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="active" checked={formData.active} onCheckedChange={handleSwitchChange} />
                <Label htmlFor="active">Active Customer</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-pink-600 hover:bg-pink-700" onClick={handleAddCustomer}>
                Add Customer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "all" | "active" | "inactive")}
      >
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="all" className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800">
            All Customers
          </TabsTrigger>
          <TabsTrigger value="active" className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800">
            Active
          </TabsTrigger>
          <TabsTrigger value="inactive" className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800">
            Inactive
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="m-0">
          <CustomerTable
            customers={filteredCustomers}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
            onView={openViewDialog}
            onSendForm={sendConsultationFormEmail}
          />
        </TabsContent>

        <TabsContent value="active" className="m-0">
          <CustomerTable
            customers={filteredCustomers}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
            onView={openViewDialog}
            onSendForm={sendConsultationFormEmail}
          />
        </TabsContent>

        <TabsContent value="inactive" className="m-0">
          <CustomerTable
            customers={filteredCustomers}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
            onView={openViewDialog}
            onSendForm={sendConsultationFormEmail}
          />
        </TabsContent>
      </Tabs>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>Update customer information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={formErrors.name ? "border-red-500" : ""}
              />
              {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-mobile">Mobile Number</Label>
              <Input
                id="edit-mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                className={formErrors.mobile ? "border-red-500" : ""}
              />
              {formErrors.mobile && <p className="text-xs text-red-500">{formErrors.mobile}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={formErrors.email ? "border-red-500" : ""}
              />
              {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-notes">Notes (Optional)</Label>
              <Textarea
                id="edit-notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="resize-none"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="edit-active" checked={formData.active} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="edit-active">Active Customer</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-pink-600 hover:bg-pink-700" onClick={handleEditCustomer}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Customer Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p>{formData.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mobile</p>
                <div className="flex items-center gap-1">
                  <p>{formData.mobile}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(formData.mobile, "Mobile number copied to clipboard")}
                  >
                    <Copy className="h-3 w-3" />
                    <span className="sr-only">Copy mobile number</span>
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <div className="flex items-center gap-1">
                  <p className="truncate max-w-[120px]">{formData.email}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(formData.email, "Email copied to clipboard")}
                  >
                    <Copy className="h-3 w-3" />
                    <span className="sr-only">Copy email</span>
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge
                variant={formData.active ? "default" : "outline"}
                className={
                  formData.active
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                }
              >
                {formData.active ? "Active" : "Inactive"}
              </Badge>
            </div>

            {formData.notes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                <p className="text-sm">{formData.notes}</p>
              </div>
            )}

            <div className="pt-2">
              <p className="text-sm font-medium text-muted-foreground mb-2">Consultation Form</p>
              {currentCustomerId && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-pink-200"
                      onClick={() => {
                        const link = `${window.location.origin}/consultation-form/${currentCustomerId}`
                        copyToClipboard(link, "Consultation form link copied to clipboard")
                      }}
                    >
                      <ClipboardCheck className="mr-2 h-4 w-4" />
                      Copy Form Link
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-pink-200"
                      onClick={() => {
                        if (currentCustomerId) {
                          const customer = customers.find((c) => c.id === currentCustomerId)
                          if (customer) {
                            sendConsultationFormEmail(customer)
                          }
                        }
                      }}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Email Form Link
                    </Button>
                    <Button asChild variant="outline" size="sm" className="border-pink-200">
                      <Link href={`/consultation-form/${currentCustomerId}`} target="_blank">
                        <Eye className="mr-2 h-4 w-4" />
                        View Form
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button
              className="bg-pink-600 hover:bg-pink-700"
              onClick={() => {
                setIsViewDialogOpen(false)
                if (currentCustomerId) {
                  const customer = customers.find((c) => c.id === currentCustomerId)
                  if (customer) {
                    openEditDialog(customer)
                  }
                }
              }}
            >
              Edit Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Customer Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCustomer}>
              Delete Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface CustomerTableProps {
  customers: Customer[]
  onEdit: (customer: Customer) => void
  onDelete: (customerId: string) => void
  onView: (customer: Customer) => void
  onSendForm: (customer: Customer) => void
}

function CustomerTable({ customers, onEdit, onDelete, onView, onSendForm }: CustomerTableProps) {
  return (
    <Card className="border-pink-200">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                  No customers found.
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.mobile}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{customer.email}</TableCell>
                  <TableCell>
                    {customer.lastVisit
                      ? new Date(customer.lastVisit).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "Never"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={customer.active ? "default" : "outline"}
                      className={
                        customer.active
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      }
                    >
                      {customer.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onView(customer)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(customer)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onSendForm(customer)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Send Consultation Form
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(customer.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
