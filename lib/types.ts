export type Role = "admin" | "employee";

export type ServiceType = "install" | "takedown" | "repair";
export type ProjectStatus = "scheduled" | "in_progress" | "completed" | "needs_assignment";
export type LightsPackage = "Classic Warm White" | "Multicolor Pro" | "C9 Premium" | "Custom";
export type EmployeeRole = "lead" | "installer";

export type LngLat = [number, number];

export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  phone: string;
  email: string;
  startLocation: {
    address: string;
    coords: LngLat;
  };
  hourlyRate: number;
  hoursAvailableThisWeek: number;
  initials?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    coords: LngLat;
  };
  lastYear?: {
    season: string;
    packageType: LightsPackage;
    sqft: number;
    notes: string;
    priceCharged: number;
  };
}

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface Project {
  id: string;
  customerId: string;
  status: ProjectStatus;
  serviceType: ServiceType;
  installDate: string;
  takedownDate?: string;
  crewSize: number;
  estimatedHours: number;
  packageType: LightsPackage;
  sqft: number;
  price: number;
  notes: string;
  specialInstructions?: string;
  assignedEmployeeIds: string[];
  scheduledStart: string;
  checklist: ChecklistItem[];
  createdAt: string;
}

export interface ShiftLog {
  id: string;
  employeeId: string;
  clockIn: string;
  clockOut: string | null;
  date: string;
}

export interface Message {
  id: string;
  employeeId: string;
  from: string;
  subject: string;
  body: string;
  sentAt: string;
  read: boolean;
}

export interface Quote {
  id: string;
  customerId: string;
  packageType: LightsPackage;
  sqft: number;
  pricePerSqft: number;
  subtotal: number;
  serviceType: ServiceType;
  notes?: string;
  status: "draft" | "sent" | "accepted" | "rejected";
  createdAt: string;
  acceptedAt?: string;
  convertedProjectId?: string;
}

export interface WeatherDay {
  date: string;
  condition: "clear" | "cloudy" | "snow" | "wind" | "rain";
  highC: number;
  lowC: number;
  precipChance: number;
  windKph: number;
  warning?: string;
}
