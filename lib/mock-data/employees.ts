import type { Employee } from "@/lib/types";

export const employees: Employee[] = [
  {
    id: "emp-jordan",
    name: "Jordan Mackenzie",
    role: "lead",
    phone: "204-555-0118",
    email: "jordan@christmaslightsguys.ca",
    startLocation: {
      address: "Shop — 1455 Wall St, Winnipeg, MB",
      coords: [-97.1722, 49.8809],
    },
    hourlyRate: 32,
    hoursAvailableThisWeek: 40,
    initials: "JM",
  },
  {
    id: "emp-priya",
    name: "Priya Singh",
    role: "lead",
    phone: "204-555-0142",
    email: "priya@christmaslightsguys.ca",
    startLocation: {
      address: "1208 Pembina Hwy, Winnipeg, MB (Fort Garry)",
      coords: [-97.1518, 49.8412],
    },
    hourlyRate: 30,
    hoursAvailableThisWeek: 40,
    initials: "PS",
  },
  {
    id: "emp-marcus",
    name: "Marcus Thiessen",
    role: "installer",
    phone: "204-555-0177",
    email: "marcus@christmaslightsguys.ca",
    startLocation: {
      address: "455 Henderson Hwy, Winnipeg, MB (East Kildonan)",
      coords: [-97.1006, 49.9311],
    },
    hourlyRate: 26,
    hoursAvailableThisWeek: 36,
    initials: "MT",
  },
  {
    id: "emp-tyler",
    name: "Tyler Dueck",
    role: "installer",
    phone: "204-555-0193",
    email: "tyler@christmaslightsguys.ca",
    startLocation: {
      address: "880 Plessis Rd, Winnipeg, MB (Transcona)",
      coords: [-97.0145, 49.8956],
    },
    hourlyRate: 25,
    hoursAvailableThisWeek: 32,
    initials: "TD",
  },
  {
    id: "emp-alex",
    name: "Alex Beaulieu",
    role: "installer",
    phone: "204-555-0204",
    email: "alex@christmaslightsguys.ca",
    startLocation: {
      address: "212 Provencher Blvd, Winnipeg, MB (St. Boniface)",
      coords: [-97.1166, 49.8895],
    },
    hourlyRate: 27,
    hoursAvailableThisWeek: 40,
    initials: "AB",
  },
  {
    id: "emp-sam",
    name: "Sam Okonkwo",
    role: "installer",
    phone: "204-555-0231",
    email: "sam@christmaslightsguys.ca",
    startLocation: {
      address: "1755 Corydon Ave, Winnipeg, MB (River Heights)",
      coords: [-97.1955, 49.8662],
    },
    hourlyRate: 26,
    hoursAvailableThisWeek: 40,
    initials: "SO",
  },
];

export function getEmployee(id: string): Employee | undefined {
  return employees.find((e) => e.id === id);
}
