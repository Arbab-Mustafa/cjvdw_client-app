"use client"

import type React from "react"

import { useState } from "react"
import { useAuth, type User, type EmploymentType } from "@/context/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { MoreHorizontal, Pencil, Trash2, UserPlus } from "lucide-react"
import { toast } from "sonner"

type UserFormData = {
  name: string
  username: string
  email: string
  role: "owner" | "therapist"
  active: boolean
  password: string
  confirmPassword: string
  employmentType: EmploymentType
  hourlyRate: string
}

const initialFormData: UserFormData = {
  name: "",
  username: "",
  email: "",
  role: "therapist",
  active: true,
  password: "",
  confirmPassword: "",
  employmentType: "employed",
  hourlyRate: "",
}

export default function UserManagement() {
  const { users, addUser, updateUser, deleteUser } = useAuth()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [formData, setFormData] = useState<UserFormData>(initialFormData)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<Partial<UserFormData>>({})

  const resetForm = () => {
    setFormData(initialFormData)
    setFormErrors({})
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (formErrors[name as keyof UserFormData]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, active: checked }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = (): boolean => {
    const errors: Partial<UserFormData> = {}

    if (!formData.name.trim()) errors.name = "Name is required"
    if (!formData.username.trim()) errors.username = "Username is required"
    if (!formData.email.trim()) errors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid"

    // Only validate password fields for new users or if password is being changed
    if (!currentUserId || formData.password) {
      if (!currentUserId && !formData.password) errors.password = "Password is required"
      if (formData.password && formData.password.length < 8) errors.password = "Password must be at least 8 characters"
      if (formData.password !== formData.confirmPassword) errors.confirmPassword = "Passwords do not match"
    }

    // Validate hourly rate for employed therapists
    if (formData.employmentType === "employed" && formData.role === "therapist") {
      if (!formData.hourlyRate.trim()) {
        errors.hourlyRate = "Hourly rate is required for employed therapists"
      } else if (isNaN(Number(formData.hourlyRate)) || Number(formData.hourlyRate) <= 0) {
        errors.hourlyRate = "Hourly rate must be a valid number greater than 0"
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAddUser = () => {
    if (!validateForm()) return

    // Check if username already exists
    if (users.some((user) => user.username.toLowerCase() === formData.username.toLowerCase())) {
      setFormErrors((prev) => ({ ...prev, username: "Username already exists" }))
      return
    }

    addUser({
      name: formData.name,
      username: formData.username,
      email: formData.email,
      role: formData.role,
      active: formData.active,
      employmentType: formData.employmentType,
      hourlyRate:
        formData.employmentType === "employed" && formData.role === "therapist"
          ? Number(formData.hourlyRate)
          : undefined,
    })

    toast.success(`${formData.name} has been added successfully`)
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditUser = () => {
    if (!currentUserId || !validateForm()) return

    // Check if username already exists (excluding current user)
    if (
      users.some((user) => user.id !== currentUserId && user.username.toLowerCase() === formData.username.toLowerCase())
    ) {
      setFormErrors((prev) => ({ ...prev, username: "Username already exists" }))
      return
    }

    updateUser(currentUserId, {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      role: formData.role,
      active: formData.active,
      employmentType: formData.employmentType,
      hourlyRate:
        formData.employmentType === "employed" && formData.role === "therapist"
          ? Number(formData.hourlyRate)
          : undefined,
    })

    toast.success(`${formData.name} has been updated successfully`)
    setIsEditDialogOpen(false)
    resetForm()
  }

  const handleDeleteUser = () => {
    if (!currentUserId) return

    const userToDelete = users.find((user) => user.id === currentUserId)
    if (!userToDelete) return

    deleteUser(currentUserId)
    toast.success(`${userToDelete.name} has been deleted`)
    setIsDeleteDialogOpen(false)
    setCurrentUserId(null)
  }

  const openEditDialog = (user: User) => {
    setCurrentUserId(user.id)
    setFormData({
      name: user.name,
      username: user.username,
      email: user.email || "",
      role: user.role,
      active: user.active !== false,
      password: "",
      confirmPassword: "",
      employmentType: user.employmentType || "employed",
      hourlyRate: user.hourlyRate ? user.hourlyRate.toString() : "",
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (userId: string) => {
    setCurrentUserId(userId)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-pink-800">Therapist Accounts</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pink-600 hover:bg-pink-700" onClick={resetForm}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Therapist
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Therapist</DialogTitle>
              <DialogDescription>
                Create a new account for a therapist. They'll be able to log in with these credentials.
              </DialogDescription>
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
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={formErrors.username ? "border-red-500" : ""}
                />
                {formErrors.username && <p className="text-xs text-red-500">{formErrors.username}</p>}
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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={formErrors.password ? "border-red-500" : ""}
                />
                {formErrors.password && <p className="text-xs text-red-500">{formErrors.password}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={formErrors.confirmPassword ? "border-red-500" : ""}
                />
                {formErrors.confirmPassword && <p className="text-xs text-red-500">{formErrors.confirmPassword}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="therapist">Therapist</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="employmentType">Employment Type</Label>
                <Select
                  value={formData.employmentType}
                  onValueChange={(value) => handleSelectChange("employmentType", value as EmploymentType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employed">Employed</SelectItem>
                    <SelectItem value="self-employed">Self-Employed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.employmentType === "employed" && formData.role === "therapist" && (
                <div className="grid gap-2">
                  <Label htmlFor="hourlyRate">Hourly Rate (£)</Label>
                  <Input
                    id="hourlyRate"
                    name="hourlyRate"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    className={formErrors.hourlyRate ? "border-red-500" : ""}
                  />
                  {formErrors.hourlyRate && <p className="text-xs text-red-500">{formErrors.hourlyRate}</p>}
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Switch id="active" checked={formData.active} onCheckedChange={handleSwitchChange} />
                <Label htmlFor="active">Active Account</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-pink-600 hover:bg-pink-700" onClick={handleAddUser}>
                Add Therapist
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-pink-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Employment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "owner" ? "default" : "outline"}
                      className={
                        user.role === "owner"
                          ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                          : "bg-pink-100 text-pink-800 hover:bg-pink-100"
                      }
                    >
                      {user.role === "owner" ? "Owner" : "Therapist"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        user.employmentType === "employed"
                          ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                          : "bg-green-100 text-green-800 hover:bg-green-100"
                      }
                    >
                      {user.employmentType === "employed" ? "Employed" : "Self-Employed"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.active !== false ? "default" : "outline"}
                      className={
                        user.active !== false
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      }
                    >
                      {user.active !== false ? "Active" : "Inactive"}
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
                        <DropdownMenuItem onClick={() => openEditDialog(user)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(user.id)}
                          className="text-red-600 focus:text-red-600"
                          disabled={user.role === "owner" && user.username === "Sarah"}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Therapist</DialogTitle>
            <DialogDescription>Update account information for this therapist.</DialogDescription>
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
              <Label htmlFor="edit-username">Username</Label>
              <Input
                id="edit-username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={formErrors.username ? "border-red-500" : ""}
              />
              {formErrors.username && <p className="text-xs text-red-500">{formErrors.username}</p>}
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
              <Label htmlFor="edit-password">New Password (leave blank to keep current)</Label>
              <Input
                id="edit-password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className={formErrors.password ? "border-red-500" : ""}
              />
              {formErrors.password && <p className="text-xs text-red-500">{formErrors.password}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-confirmPassword">Confirm New Password</Label>
              <Input
                id="edit-confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={formErrors.confirmPassword ? "border-red-500" : ""}
              />
              {formErrors.confirmPassword && <p className="text-xs text-red-500">{formErrors.confirmPassword}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleSelectChange("role", value)}
                disabled={formData.username === "Sarah"} // Prevent changing Sarah's role
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="therapist">Therapist</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-employmentType">Employment Type</Label>
              <Select
                value={formData.employmentType}
                onValueChange={(value) => handleSelectChange("employmentType", value as EmploymentType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employed">Employed</SelectItem>
                  <SelectItem value="self-employed">Self-Employed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.employmentType === "employed" && formData.role === "therapist" && (
              <div className="grid gap-2">
                <Label htmlFor="edit-hourlyRate">Hourly Rate (£)</Label>
                <Input
                  id="edit-hourlyRate"
                  name="hourlyRate"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.hourlyRate}
                  onChange={handleInputChange}
                  className={formErrors.hourlyRate ? "border-red-500" : ""}
                />
                {formErrors.hourlyRate && <p className="text-xs text-red-500">{formErrors.hourlyRate}</p>}
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-active"
                checked={formData.active}
                onCheckedChange={handleSwitchChange}
                disabled={formData.username === "Sarah"} // Prevent deactivating Sarah
              />
              <Label htmlFor="edit-active">Active Account</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-pink-600 hover:bg-pink-700" onClick={handleEditUser}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this therapist account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
