export type ServiceCategory =
  | "facials"
  | "waxing"
  | "body"
  | "hands-feet"
  | "eyes"
  | "hot-wax"
  | "sunbed"
  | "products-vouchers";

export interface ServiceItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration?: number; // in minutes
  category: ServiceCategory;
  active: boolean;
}

export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  facials: "Facials",
  waxing: "Waxing",
  body: "Body",
  "hands-feet": "Hands & Feet",
  eyes: "Eyes",
  "hot-wax": "Hot Wax",
  sunbed: "Sunbed",
  "products-vouchers": "Products & Vouchers",
};
