"use client"

import type React from "react"

import { useState } from "react"
import { useServices } from "@/context/service-context"
import { type ServiceItem, type ServiceCategory, CATEGORY_LABELS } from "@/types/services"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { MoreHorizontal, Pencil, Trash2, Plus, Search } from "lucide-react"
import { toast } from "sonner"

type ServiceFormData = {
  name: string
  description: string
  price: string
  duration: string
  category: ServiceCategory
  active: boolean
}

const initialFormData: ServiceFormData = {
  name: "",
  description: "",
  price: "",
  duration: "",
  category: "facial",
  active: true,
}

const categoryOptions: { value: ServiceCategory; label: string }[] = Object.entries(CATEGORY_LABELS).map(
  ([value, label]) => ({
    value: value as ServiceCategory,
    label,
  }),
)

export default function ServiceManagement() {
  const { services, addService, updateService, deleteService } = useServices()
  const [activeTab, setActiveTab] = useState<ServiceCategory>("facial")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [formData, setFormData] = useState<ServiceFormData>(initialFormData)
  const [currentServiceId, setCurrentServiceId] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<Partial<ServiceFormData>>({})
  const [searchQuery, setSearchQuery] = useState("")

  const resetForm = () => {
    setFormData({ ...initialFormData, category: activeTab })
    setFormErrors({})
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (formErrors[name as keyof ServiceFormData]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, active: checked }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value as ServiceCategory }))
  }

  const validateForm = (): boolean => {
    const errors: Partial<ServiceFormData> = {}

    if (!formData.name.trim()) errors.name = "Name is required"

    if (!formData.price.trim()) {
      errors.price = "Price is required"
    } else if (isNaN(Number.parseFloat(formData.price)) || Number.parseFloat(formData.price) < 0) {
      errors.price = "Price must be a valid number"
    }

    if (formData.duration && (isNaN(Number.parseInt(formData.duration)) || Number.parseInt(formData.duration) <= 0)) {
      errors.duration = "Duration must be a valid number"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAddService = () => {
    if (!validateForm()) return

    addService({
      name: formData.name,
      description: formData.description || undefined,
      price: Number.parseFloat(formData.price),
      duration: formData.duration ? Number.parseInt(formData.duration) : undefined,
      category: formData.category,
      active: formData.active,
    })

    toast.success(`${formData.name} has been added successfully`)
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditService = () => {
    if (!currentServiceId || !validateForm()) return

    updateService(currentServiceId, {
      name: formData.name,
      description: formData.description || undefined,
      price: Number.parseFloat(formData.price),
      duration: formData.duration ? Number.parseInt(formData.duration) : undefined,
      category: formData.category,
      active: formData.active,
    })

    toast.success(`${formData.name} has been updated successfully`)
    setIsEditDialogOpen(false)
    resetForm()
  }

  const handleDeleteService = () => {
    if (!currentServiceId) return

    const serviceToDelete = services.find((service) => service.id === currentServiceId)
    if (!serviceToDelete) return

    deleteService(currentServiceId)
    toast.success(`${serviceToDelete.name} has been deleted`)
    setIsDeleteDialogOpen(false)
    setCurrentServiceId(null)
  }

  const openEditDialog = (service: ServiceItem) => {
    setCurrentServiceId(service.id)
    setFormData({
      name: service.name,
      description: service.description || "",
      price: service.price.toString(),
      duration: service.duration ? service.duration.toString() : "",
      category: service.category,
      active: service.active,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (serviceId: string) => {
    setCurrentServiceId(serviceId)
    setIsDeleteDialogOpen(true)
  }

  const filteredServices = searchQuery
    ? services.filter(
        (service) =>
          service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    : services.filter((service) => service.category === activeTab)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search services..."
            className="pl-8 border-pink-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pink-600 hover:bg-pink-700" onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Service or Product</DialogTitle>
              <DialogDescription>Create a new service or product for your salon.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Service Name</Label>
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
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="resize-none"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (£)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={formErrors.price ? "border-red-500" : ""}
                  />
                  {formErrors.price && <p className="text-xs text-red-500">{formErrors.price}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (mins, optional)</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className={formErrors.duration ? "border-red-500" : ""}
                  />
                  {formErrors.duration && <p className="text-xs text-red-500">{formErrors.duration}</p>}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="active" checked={formData.active} onCheckedChange={handleSwitchChange} />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-pink-600 hover:bg-pink-700" onClick={handleAddService}>
                Add Service
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {searchQuery ? (
        <Card className="border-pink-200">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      No services found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">
                        {service.name}
                        {service.description && (
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{service.description}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-pink-50 text-pink-800 hover:bg-pink-50">
                          {CATEGORY_LABELS[service.category]}
                        </Badge>
                      </TableCell>
                      <TableCell>£{service.price.toFixed(2)}</TableCell>
                      <TableCell>{service.duration ? `${service.duration} mins` : "N/A"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={service.active ? "default" : "outline"}
                          className={
                            service.active
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                          }
                        >
                          {service.active ? "Active" : "Inactive"}
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
                            <DropdownMenuItem onClick={() => openEditDialog(service)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDeleteDialog(service.id)}
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
      ) : (
        <Tabs defaultValue="facial" value={activeTab} onValueChange={(value) => setActiveTab(value as ServiceCategory)}>
          <TabsList className="grid grid-cols-4 md:grid-cols-8 mb-4">
            {categoryOptions.map((option) => (
              <TabsTrigger
                key={option.value}
                value={option.value}
                className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800"
              >
                {option.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {categoryOptions.map((category) => (
            <TabsContent key={category.value} value={category.value} className="m-0">
              <Card className="border-pink-200">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredServices.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                            No services found in this category.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredServices.map((service) => (
                          <TableRow key={service.id}>
                            <TableCell className="font-medium">
                              {service.name}
                              {service.description && (
                                <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                                  {service.description}
                                </p>
                              )}
                            </TableCell>
                            <TableCell>£{service.price.toFixed(2)}</TableCell>
                            <TableCell>{service.duration ? `${service.duration} mins` : "N/A"}</TableCell>
                            <TableCell>
                              <Badge
                                variant={service.active ? "default" : "outline"}
                                className={
                                  service.active
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                                }
                              >
                                {service.active ? "Active" : "Inactive"}
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
                                  <DropdownMenuItem onClick={() => openEditDialog(service)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => openDeleteDialog(service.id)}
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
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Edit Service Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>Update service or product information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Service Name</Label>
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
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="resize-none"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Price (£)</Label>
                <Input
                  id="edit-price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={formErrors.price ? "border-red-500" : ""}
                />
                {formErrors.price && <p className="text-xs text-red-500">{formErrors.price}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-duration">Duration (mins, optional)</Label>
                <Input
                  id="edit-duration"
                  name="duration"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className={formErrors.duration ? "border-red-500" : ""}
                />
                {formErrors.duration && <p className="text-xs text-red-500">{formErrors.duration}</p>}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select value={formData.category} onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="edit-active" checked={formData.active} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="edit-active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-pink-600 hover:bg-pink-700" onClick={handleEditService}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Service Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this service? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteService}>
              Delete Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
