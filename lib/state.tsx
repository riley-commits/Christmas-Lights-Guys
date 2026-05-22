"use client";

import * as React from "react";
import {
  customers as seedCustomers,
  employees,
  projects as seedProjects,
  quotes as seedQuotes,
  messages as seedMessages,
  shifts as seedShifts,
  TODAY,
} from "@/lib/mock-data";
import type {
  Customer,
  Employee,
  Message,
  Project,
  ProjectStatus,
  Quote,
  Role,
  ServiceType,
  ShiftLog,
} from "@/lib/types";

const ROLE_KEY = "clg.role.v1";
const EMP_KEY = "clg.activeEmployee.v1";
const ACTIVE_SHIFT_KEY = "clg.activeShift.v1";

interface CreateProjectInput {
  customer: {
    name: string;
    phone: string;
    email: string;
    street: string;
    city: string;
    postalCode: string;
  };
  installDate: string;
  takedownDate: string;
  serviceType: ServiceType;
  crewSize: number;
  estimatedHours: number;
  packageType: Project["packageType"];
  sqft: number;
  price: number;
  notes: string;
  specialInstructions: string;
}

interface ActiveShiftState {
  employeeId: string;
  clockIn: string;
}

interface AppState {
  // identity
  role: Role | null;
  activeEmployeeId: string | null;
  setRole: (r: Role | null) => void;
  setActiveEmployeeId: (id: string | null) => void;
  logout: () => void;

  // data
  employees: Employee[];
  customers: Customer[];
  projects: Project[];
  quotes: Quote[];
  messages: Message[];
  shifts: ShiftLog[];

  // mutations
  createProject: (input: CreateProjectInput) => Project;
  assignCrew: (projectId: string, employeeIds: string[], scheduledStart: string) => void;
  setProjectStatus: (projectId: string, status: ProjectStatus) => void;
  toggleChecklistItem: (projectId: string, itemId: string) => void;
  markJobComplete: (projectId: string) => void;
  acceptQuote: (quoteId: string) => Project | null;
  markMessageRead: (messageId: string) => void;

  // time clock
  activeShift: ActiveShiftState | null;
  clockIn: (employeeId: string) => void;
  clockOut: (employeeId: string) => void;
}

const Ctx = React.createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [role, _setRole] = React.useState<Role | null>(null);
  const [activeEmployeeId, _setActiveEmployeeId] = React.useState<string | null>(null);
  const [hydrated, setHydrated] = React.useState(false);

  const [customers, setCustomers] = React.useState<Customer[]>(seedCustomers);
  const [projects, setProjects] = React.useState<Project[]>(seedProjects);
  const [quotes, setQuotes] = React.useState<Quote[]>(seedQuotes);
  const [messages, setMessages] = React.useState<Message[]>(seedMessages);
  const [shifts, setShifts] = React.useState<ShiftLog[]>(seedShifts);
  const [activeShift, setActiveShift] = React.useState<ActiveShiftState | null>(null);

  React.useEffect(() => {
    try {
      const r = window.localStorage.getItem(ROLE_KEY) as Role | null;
      const e = window.localStorage.getItem(EMP_KEY);
      const s = window.localStorage.getItem(ACTIVE_SHIFT_KEY);
      if (r) _setRole(r);
      if (e) _setActiveEmployeeId(e);
      if (s) setActiveShift(JSON.parse(s));
    } catch {}
    setHydrated(true);
  }, []);

  const setRole = React.useCallback((r: Role | null) => {
    _setRole(r);
    try {
      if (r) window.localStorage.setItem(ROLE_KEY, r);
      else window.localStorage.removeItem(ROLE_KEY);
    } catch {}
  }, []);

  const setActiveEmployeeId = React.useCallback((id: string | null) => {
    _setActiveEmployeeId(id);
    try {
      if (id) window.localStorage.setItem(EMP_KEY, id);
      else window.localStorage.removeItem(EMP_KEY);
    } catch {}
  }, []);

  const logout = React.useCallback(() => {
    _setRole(null);
    _setActiveEmployeeId(null);
    try {
      window.localStorage.removeItem(ROLE_KEY);
      window.localStorage.removeItem(EMP_KEY);
    } catch {}
  }, []);

  const createProject = React.useCallback(
    (input: CreateProjectInput): Project => {
      const cid = `cust-${Date.now().toString(36)}`;
      const newCustomer: Customer = {
        id: cid,
        name: input.customer.name,
        phone: input.customer.phone,
        email: input.customer.email,
        address: {
          street: input.customer.street,
          city: input.customer.city,
          postalCode: input.customer.postalCode,
          // Center-Winnipeg fallback; real geocoding would happen client-side
          coords: [-97.1384 + (Math.random() - 0.5) * 0.08, 49.8951 + (Math.random() - 0.5) * 0.05],
        },
      };
      const pid = `proj-${Date.now().toString(36)}`;
      const newProject: Project = {
        id: pid,
        customerId: cid,
        status: "needs_assignment",
        serviceType: input.serviceType,
        installDate: input.installDate,
        takedownDate: input.takedownDate || undefined,
        crewSize: input.crewSize,
        estimatedHours: input.estimatedHours,
        packageType: input.packageType,
        sqft: input.sqft,
        price: input.price,
        notes: input.notes,
        specialInstructions: input.specialInstructions,
        assignedEmployeeIds: [],
        scheduledStart: `${input.installDate}T09:00:00`,
        checklist: defaultChecklist(input.serviceType),
        createdAt: new Date().toISOString(),
      };
      setCustomers((c) => [newCustomer, ...c]);
      setProjects((p) => [newProject, ...p]);
      return newProject;
    },
    []
  );

  const assignCrew = React.useCallback(
    (projectId: string, employeeIds: string[], scheduledStart: string) => {
      setProjects((all) =>
        all.map((p) =>
          p.id === projectId
            ? {
                ...p,
                assignedEmployeeIds: employeeIds,
                scheduledStart,
                status: employeeIds.length > 0 ? "scheduled" : "needs_assignment",
              }
            : p
        )
      );
    },
    []
  );

  const setProjectStatus = React.useCallback((projectId: string, status: ProjectStatus) => {
    setProjects((all) => all.map((p) => (p.id === projectId ? { ...p, status } : p)));
  }, []);

  const toggleChecklistItem = React.useCallback((projectId: string, itemId: string) => {
    setProjects((all) =>
      all.map((p) =>
        p.id === projectId
          ? {
              ...p,
              checklist: p.checklist.map((c) => (c.id === itemId ? { ...c, done: !c.done } : c)),
            }
          : p
      )
    );
  }, []);

  const markJobComplete = React.useCallback((projectId: string) => {
    setProjects((all) =>
      all.map((p) =>
        p.id === projectId
          ? {
              ...p,
              status: "completed",
              checklist: p.checklist.map((c) => ({ ...c, done: true })),
            }
          : p
      )
    );
  }, []);

  const acceptQuote = React.useCallback(
    (quoteId: string): Project | null => {
      const q = quotes.find((x) => x.id === quoteId);
      if (!q) return null;
      if (q.convertedProjectId) return projects.find((p) => p.id === q.convertedProjectId) ?? null;
      const pid = `proj-${Date.now().toString(36)}`;
      const newProject: Project = {
        id: pid,
        customerId: q.customerId,
        status: "needs_assignment",
        serviceType: q.serviceType,
        installDate: addDays(TODAY, 14),
        takedownDate: addDays(TODAY, 14 + 60),
        crewSize: 2,
        estimatedHours: Math.max(2, Math.round(q.sqft / 450)),
        packageType: q.packageType,
        sqft: q.sqft,
        price: q.subtotal,
        notes: q.notes ?? "",
        specialInstructions: "",
        assignedEmployeeIds: [],
        scheduledStart: `${addDays(TODAY, 14)}T09:00:00`,
        checklist: defaultChecklist(q.serviceType),
        createdAt: new Date().toISOString(),
      };
      setProjects((p) => [newProject, ...p]);
      setQuotes((qs) =>
        qs.map((x) =>
          x.id === quoteId
            ? { ...x, status: "accepted", acceptedAt: new Date().toISOString(), convertedProjectId: pid }
            : x
        )
      );
      return newProject;
    },
    [quotes, projects]
  );

  const markMessageRead = React.useCallback((id: string) => {
    setMessages((m) => m.map((x) => (x.id === id ? { ...x, read: true } : x)));
  }, []);

  const clockIn = React.useCallback((employeeId: string) => {
    const now = new Date().toISOString();
    const state = { employeeId, clockIn: now };
    setActiveShift(state);
    try {
      window.localStorage.setItem(ACTIVE_SHIFT_KEY, JSON.stringify(state));
    } catch {}
  }, []);

  const clockOut = React.useCallback(
    (employeeId: string) => {
      if (!activeShift || activeShift.employeeId !== employeeId) return;
      const now = new Date().toISOString();
      const newShift: ShiftLog = {
        id: `sh-${Date.now().toString(36)}`,
        employeeId,
        date: now.slice(0, 10),
        clockIn: activeShift.clockIn,
        clockOut: now,
      };
      setShifts((s) => [newShift, ...s]);
      setActiveShift(null);
      try {
        window.localStorage.removeItem(ACTIVE_SHIFT_KEY);
      } catch {}
    },
    [activeShift]
  );

  const value: AppState = {
    role: hydrated ? role : null,
    activeEmployeeId: hydrated ? activeEmployeeId : null,
    setRole,
    setActiveEmployeeId,
    logout,
    employees,
    customers,
    projects,
    quotes,
    messages,
    shifts,
    createProject,
    assignCrew,
    setProjectStatus,
    toggleChecklistItem,
    markJobComplete,
    acceptQuote,
    markMessageRead,
    activeShift: hydrated ? activeShift : null,
    clockIn,
    clockOut,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState(): AppState {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useAppState must be used inside AppStateProvider");
  return ctx;
}

// helpers
function addDays(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function defaultChecklist(serviceType: ServiceType) {
  if (serviceType === "install") {
    return [
      { id: "ck1", label: "Confirm power source with customer", done: false },
      { id: "ck2", label: "Set up ladder safely + spotter", done: false },
      { id: "ck3", label: "Inspect & test light strings", done: false },
      { id: "ck4", label: "Install roofline clips", done: false },
      { id: "ck5", label: "Hang lights + secure connections", done: false },
      { id: "ck6", label: "Tree wrap (if applicable)", done: false },
      { id: "ck7", label: "Test full system after dark check", done: false },
      { id: "ck8", label: "Customer walkthrough + sign-off", done: false },
      { id: "ck9", label: "Clean site + collect packaging", done: false },
    ];
  }
  if (serviceType === "takedown") {
    return [
      { id: "ck1", label: "Unplug + power down system", done: false },
      { id: "ck2", label: "Set up ladder safely + spotter", done: false },
      { id: "ck3", label: "Remove roofline strands", done: false },
      { id: "ck4", label: "Remove clips + tree wrap", done: false },
      { id: "ck5", label: "Coil + label customer's set (if owned)", done: false },
      { id: "ck6", label: "Inspect for damage + photo report", done: false },
      { id: "ck7", label: "Load truck + return to shop", done: false },
    ];
  }
  return [
    { id: "ck1", label: "Diagnose reported issue", done: false },
    { id: "ck2", label: "Replace failed strand / fuse", done: false },
    { id: "ck3", label: "Test full circuit", done: false },
    { id: "ck4", label: "Customer sign-off", done: false },
  ];
}
