"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"
import type { ServiceItem, ServiceCategory } from "@/types/services"
import { DEFAULT_SERVICES } from "@/data/services"

interface ServiceContextType {
  services: ServiceItem[]
  addService: (service: Omit<ServiceItem, "id">) => void
  updateService: (id: string, serviceData: Partial<ServiceItem>) => void
  deleteService: (id: string) => void
  getServicesByCategory: (category: ServiceCategory) => ServiceItem[]
  getActiveServicesByCategory: (category: ServiceCategory) => ServiceItem[]
  getAllActiveServices: () => ServiceItem[]
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined)

export function ServiceProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<ServiceItem[]>([])

  useEffect(() => {
    const storedServices = localStorage.getItem("gem-n-eyes-services")

    if (storedServices) {
      setServices(JSON.parse(storedServices))
    } else {
      // Initialize with default services
      setServices(DEFAULT_SERVICES)
      localStorage.setItem("gem-n-eyes-services", JSON.stringify(DEFAULT_SERVICES))
    }
  }, [])

  const addService = (serviceData: Omit<ServiceItem, "id">) => {
    const newService = {
      ...serviceData,
      id: `${serviceData.category}-${Date.now()}`,
    }

    const updatedServices = [...services, newService]
    setServices(updatedServices)
    localStorage.setItem("gem-n-eyes-services", JSON.stringify(updatedServices))
  }

  const updateService = (id: string, serviceData: Partial<ServiceItem>) => {
    const updatedServices = services.map((service) => (service.id === id ? { ...service, ...serviceData } : service))
    setServices(updatedServices)
    localStorage.setItem("gem-n-eyes-services", JSON.stringify(updatedServices))
  }

  const deleteService = (id: string) => {
    const updatedServices = services.filter((service) => service.id !== id)
    setServices(updatedServices)
    localStorage.setItem("gem-n-eyes-services", JSON.stringify(updatedServices))
  }

  const getServicesByCategory = (category: ServiceCategory) => {
    return services.filter((service) => service.category === category)
  }

  const getActiveServicesByCategory = useCallback(
    (category: ServiceCategory) => {
      return services
        .filter((service) => service.category === category && service.active)
        .map((service) => ({
          ...service,
          category: service.category, // Ensure category is included
        }))
    },
    [services],
  )

  const getAllActiveServices = () => {
    return services.filter((service) => service.active)
  }

  return (
    <ServiceContext.Provider
      value={{
        services,
        addService,
        updateService,
        deleteService,
        getServicesByCategory,
        getActiveServicesByCategory,
        getAllActiveServices,
      }}
    >
      {children}
    </ServiceContext.Provider>
  )
}

export function useServices() {
  const context = useContext(ServiceContext)
  if (context === undefined) {
    throw new Error("useServices must be used within a ServiceProvider")
  }
  return context
}

export function useService() {
  const context = useContext(ServiceContext)
  if (context === undefined) {
    throw new Error("useService must be used within a ServiceProvider")
  }
  return context
}
