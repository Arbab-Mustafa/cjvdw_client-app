// context/service-context.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from "react";
import type { ServiceItem, ServiceCategory } from "@/types/services";
import { DEFAULT_SERVICES } from "@/data/services";

interface ServiceContextType {
  services: ServiceItem[];
  addService: (service: Omit<ServiceItem, "id">) => void;
  updateService: (id: string, serviceData: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  getServicesByCategory: (category: ServiceCategory) => ServiceItem[];
  getActiveServicesByCategory: (category: ServiceCategory) => ServiceItem[];
  getAllActiveServices: () => ServiceItem[];
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export function ServiceProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    try {
      const storedServices = localStorage.getItem("gem-n-eyes-services");
      if (storedServices) {
        setServices(JSON.parse(storedServices));
      } else {
        setServices(DEFAULT_SERVICES);
        localStorage.setItem(
          "gem-n-eyes-services",
          JSON.stringify(DEFAULT_SERVICES)
        );
      }
    } catch (error) {
      console.error("Failed to load services from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    const syncServices = () => {
      try {
        const storedServices = localStorage.getItem("gem-n-eyes-services");
        if (storedServices) {
          setServices(JSON.parse(storedServices));
        }
      } catch (error) {
        console.error("Failed to sync services from localStorage:", error);
      }
    };
    window.addEventListener("storage", syncServices);
    return () => window.removeEventListener("storage", syncServices);
  }, []);

  const addService = (serviceData: Omit<ServiceItem, "id">) => {
    try {
      const newService = {
        ...serviceData,
        id: `${serviceData.category}-${Date.now()}`,
      };
      const updatedServices = [...services, newService];
      setServices(updatedServices);
      localStorage.setItem(
        "gem-n-eyes-services",
        JSON.stringify(updatedServices)
      );
    } catch (error) {
      console.error("Failed to add service:", error);
    }
  };

  const updateService = (id: string, serviceData: Partial<ServiceItem>) => {
    try {
      const updatedServices = services.map((service) =>
        service.id === id ? { ...service, ...serviceData } : service
      );
      setServices(updatedServices);
      localStorage.setItem(
        "gem-n-eyes-services",
        JSON.stringify(updatedServices)
      );
    } catch (error) {
      console.error("Failed to update service:", error);
    }
  };

  const deleteService = (id: string) => {
    try {
      const updatedServices = services.filter((service) => service.id !== id);
      setServices(updatedServices);
      localStorage.setItem(
        "gem-n-eyes-services",
        JSON.stringify(updatedServices)
      );
    } catch (error) {
      console.error("Failed to delete service:", error);
    }
  };

  const getServicesByCategory = (category: ServiceCategory) => {
    return services.filter((service) => service.category === category);
  };

  const getActiveServicesByCategory = useCallback(
    (category: ServiceCategory) => {
      return services.filter(
        (service) => service.category === category && service.active
      );
    },
    [services]
  );

  const getAllActiveServices = () => {
    return services.filter((service) => service.active);
  };

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
  );
}

export function useServices() {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error("useServices must be used within a ServiceProvider");
  }
  return context;
}