import { addDays, endOfWeek, isWithinInterval, parseISO, startOfWeek } from "date-fns";
import type { Employee, Project, ShiftLog } from "@/lib/types";

export const TODAY_ISO = "2026-05-22";

export function today(): Date {
  return parseISO(TODAY_ISO + "T00:00:00");
}

export function nextNDays(n: number): Date[] {
  const out: Date[] = [];
  const t = today();
  for (let i = 0; i < n; i++) out.push(addDays(t, i));
  return out;
}

export function isWithinWeek(dateStr: string): boolean {
  const d = parseISO(dateStr + "T00:00:00");
  const t = today();
  const ws = startOfWeek(t, { weekStartsOn: 1 });
  const we = endOfWeek(t, { weekStartsOn: 1 });
  return isWithinInterval(d, { start: ws, end: we });
}

export function isWithinNextNDays(dateStr: string, n: number): boolean {
  const d = parseISO(dateStr + "T00:00:00");
  const t = today();
  const end = addDays(t, n);
  return d >= t && d <= end;
}

export function projectsThisWeek(projects: Project[]): Project[] {
  return projects.filter((p) => isWithinWeek(p.installDate)).sort((a, b) => a.scheduledStart.localeCompare(b.scheduledStart));
}

export function activeProjects(projects: Project[]): Project[] {
  return projects.filter((p) => p.status !== "completed");
}

export function revenueMTD(projects: Project[]): number {
  // "Month-to-date" — using the current calendar month against TODAY
  const t = today();
  const month = t.getMonth();
  const year = t.getFullYear();
  return projects.reduce((sum, p) => {
    const d = parseISO(p.installDate + "T00:00:00");
    if (d.getFullYear() === year && d.getMonth() === month) return sum + p.price;
    return sum;
  }, 0);
}

export function crewHoursThisWeek(projects: Project[]): number {
  return projects
    .filter((p) => isWithinWeek(p.installDate))
    .reduce((sum, p) => sum + p.estimatedHours * Math.max(1, p.assignedEmployeeIds.length), 0);
}

export function crewHoursAvailable(employees: Employee[]): number {
  return employees.reduce((s, e) => s + e.hoursAvailableThisWeek, 0);
}

export function jobsForEmployeeOnDate(projects: Project[], employeeId: string, dateStr: string) {
  return projects
    .filter((p) => p.assignedEmployeeIds.includes(employeeId) && p.installDate === dateStr)
    .sort((a, b) => a.scheduledStart.localeCompare(b.scheduledStart));
}

export function jobsForEmployee(projects: Project[], employeeId: string) {
  return projects.filter((p) => p.assignedEmployeeIds.includes(employeeId));
}

export function shiftDurationHours(s: ShiftLog): number {
  if (!s.clockOut) return 0;
  return (parseISO(s.clockOut).getTime() - parseISO(s.clockIn).getTime()) / 3600000;
}

export function employeeWeekHours(shifts: ShiftLog[], employeeId: string): number {
  return shifts
    .filter((s) => s.employeeId === employeeId && isWithinWeek(s.date))
    .reduce((sum, s) => sum + shiftDurationHours(s), 0);
}

export function employeeTodayHours(shifts: ShiftLog[], employeeId: string): number {
  return shifts
    .filter((s) => s.employeeId === employeeId && s.date === TODAY_ISO)
    .reduce((sum, s) => sum + shiftDurationHours(s), 0);
}

export function clockedInToday(employeeId: string, activeShift: { employeeId: string; clockIn: string } | null) {
  return activeShift?.employeeId === employeeId;
}
