"use client";

import * as React from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Plus, ClipboardList, CalendarDays, TrendingUp, Users, ArrowUpRight, MapPin, AlertTriangle, Snowflake, CloudRain, Wind, Cloud, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppState } from "@/lib/state";
import { TODAY_ISO, projectsThisWeek, activeProjects, revenueMTD, crewHoursThisWeek, crewHoursAvailable, today, nextNDays } from "@/lib/derive";
import { formatCurrency, cn, initials } from "@/lib/utils";
import { getCustomer } from "@/lib/mock-data/customers";
import { getWeather } from "@/lib/mock-data/weather";
import { ServiceTypeBadge } from "@/components/shared/ServiceTypeBadge";

export default function AdminDashboard() {
  const { projects, employees, activeShift } = useAppState();

  const active = activeProjects(projects);
  const thisWeek = projectsThisWeek(projects);
  const mtd = revenueMTD(projects);
  const scheduled = crewHoursThisWeek(projects);
  const available = crewHoursAvailable(employees);
  const utilization = available > 0 ? Math.min(100, Math.round((scheduled / available) * 100)) : 0;

  const upcoming = active
    .filter((p) => p.installDate >= TODAY_ISO)
    .sort((a, b) => a.scheduledStart.localeCompare(b.scheduledStart))
    .slice(0, 7);

  const todaysJobs = active.filter((p) => p.installDate === TODAY_ISO);

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-pine font-semibold">
            {format(today(), "EEEE, MMMM d")}
          </p>
          <h1 className="text-display-md mt-1">Dashboard</h1>
        </div>
        <Link href="/admin/projects/new">
          <Button variant="primary" size="lg" className="shadow-sm">
            <Plus size={18} /> New Project
          </Button>
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <KpiCard icon={<ClipboardList size={16} />} label="Active projects" value={active.length.toString()} tone="brand" />
        <KpiCard icon={<CalendarDays size={16} />} label="This week" value={thisWeek.length.toString()} tone="pine" />
        <KpiCard icon={<TrendingUp size={16} />} label="Revenue MTD" value={formatCurrency(mtd)} tone="ink" />
        <KpiCard icon={<Users size={16} />} label="Crew utilization" value={`${utilization}%`} tone="pine" />
      </div>

      {/* Utilization bar */}
      <Card className="mb-6">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-ink">Crew hours this week</p>
            <p className="text-sm text-ink-muted">
              <span className="font-semibold text-ink">{Math.round(scheduled)}h</span> scheduled / {available}h available
            </p>
          </div>
          <div className="h-2.5 bg-bg-subtle rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                utilization > 90 ? "bg-brand" : utilization > 60 ? "bg-pine" : "bg-amber"
              )}
              style={{ width: `${utilization}%` }}
            />
          </div>
          {utilization > 90 && (
            <p className="text-xs text-brand-dark mt-2 flex items-center gap-1">
              <AlertTriangle size={12} /> Crew nearing capacity — schedule carefully.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Weather strip */}
          <WeatherStrip />

          {/* Upcoming this week */}
          <Card>
            <div className="px-5 py-4 border-b border-line flex items-center justify-between">
              <h2 className="font-semibold text-ink">Upcoming this week</h2>
              <Link href="/admin/schedule" className="text-sm text-brand font-semibold hover:underline">
                Full schedule →
              </Link>
            </div>
            {upcoming.length === 0 ? (
              <div className="p-8 text-center text-sm text-ink-muted">No upcoming jobs in the next week.</div>
            ) : (
              <ul className="divide-y divide-line">
                {upcoming.map((p) => {
                  const cust = getCustomer(p.customerId);
                  return (
                    <li key={p.id}>
                      <Link
                        href={`/admin/projects/${p.id}`}
                        className="flex items-center gap-4 px-5 py-3.5 hover:bg-bg-subtle/60 transition"
                      >
                        <div className="text-center w-12 flex-shrink-0">
                          <p className="text-[10px] uppercase tracking-wider text-ink-muted font-semibold">
                            {format(parseISO(p.installDate + "T00:00:00"), "EEE")}
                          </p>
                          <p className="font-extrabold text-lg text-ink leading-tight">
                            {format(parseISO(p.installDate + "T00:00:00"), "d")}
                          </p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <ServiceTypeBadge type={p.serviceType} />
                            <span className="text-xs text-ink-muted">
                              {format(parseISO(p.scheduledStart), "h:mm a")} · {p.estimatedHours}h
                            </span>
                          </div>
                          <p className="font-semibold text-ink truncate">{cust?.name}</p>
                          <p className="text-xs text-ink-muted truncate flex items-center gap-1">
                            <MapPin size={11} /> {cust?.address.street}
                          </p>
                        </div>
                        <div className="hidden sm:flex -space-x-1.5">
                          {p.assignedEmployeeIds.slice(0, 3).map((eid) => {
                            const e = employees.find((x) => x.id === eid);
                            if (!e) return null;
                            return (
                              <div
                                key={eid}
                                className="w-7 h-7 rounded-full bg-pine-soft border-2 border-white text-[10px] font-bold text-pine-dark flex items-center justify-center"
                                title={e.name}
                              >
                                {e.initials ?? initials(e.name)}
                              </div>
                            );
                          })}
                        </div>
                        <ArrowUpRight size={16} className="text-ink-subtle flex-shrink-0" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </div>

        {/* Crew status today */}
        <div>
          <Card>
            <div className="px-5 py-4 border-b border-line">
              <h2 className="font-semibold text-ink">Crew status today</h2>
              <p className="text-xs text-ink-muted mt-0.5">
                {todaysJobs.length} job{todaysJobs.length === 1 ? "" : "s"} on the schedule
              </p>
            </div>
            <ul className="divide-y divide-line">
              {employees.map((e) => {
                const todaysAssignments = todaysJobs.filter((p) => p.assignedEmployeeIds.includes(e.id));
                const onShift = activeShift?.employeeId === e.id;
                return (
                  <li key={e.id} className="px-5 py-3 flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full bg-pine-soft text-pine-dark flex items-center justify-center font-bold text-sm">
                      {e.initials ?? initials(e.name)}
                      {onShift && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-pine border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-ink truncate">{e.name}</p>
                      <p className="text-xs text-ink-muted truncate">
                        {todaysAssignments.length > 0
                          ? `${todaysAssignments.length} stop${todaysAssignments.length === 1 ? "" : "s"} today`
                          : "Off today"}
                      </p>
                    </div>
                    {onShift ? <Badge tone="pine">On shift</Badge> : null}
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: "brand" | "pine" | "ink" }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div
          className={cn(
            "w-8 h-8 rounded-md flex items-center justify-center mb-2",
            tone === "brand" && "bg-brand-soft text-brand-dark",
            tone === "pine" && "bg-pine-soft text-pine-dark",
            tone === "ink" && "bg-bg-subtle text-ink"
          )}
        >
          {icon}
        </div>
        <p className="text-xs text-ink-muted font-medium">{label}</p>
        <p className="text-2xl font-extrabold text-ink mt-0.5 leading-tight">{value}</p>
      </CardContent>
    </Card>
  );
}

function WeatherStrip() {
  const days = nextNDays(7);
  return (
    <Card>
      <div className="px-5 py-4 border-b border-line flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-ink">Weather window — next 7 days</h2>
          <p className="text-xs text-ink-muted mt-0.5">Flagged days impact ladder safety + install conditions.</p>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 px-3 py-3 overflow-x-auto scrollbar-hide">
        {days.map((d) => {
          const iso = format(d, "yyyy-MM-dd");
          const w = getWeather(iso);
          const hasWarning = !!w?.warning;
          return (
            <div
              key={iso}
              className={cn(
                "rounded-md p-2 text-center min-w-0",
                hasWarning ? "bg-brand-soft/70 border border-brand/20" : "bg-bg-subtle"
              )}
              title={w?.warning}
            >
              <p className="text-[10px] uppercase tracking-wider text-ink-muted font-semibold">
                {format(d, "EEE")}
              </p>
              <p className="text-sm font-bold text-ink mt-0.5">{format(d, "d")}</p>
              <div className="flex justify-center mt-1 text-ink-muted">
                <WeatherIcon condition={w?.condition} className={hasWarning ? "text-brand" : ""} />
              </div>
              <p className="text-[11px] font-semibold text-ink mt-1">
                {w?.highC ?? "—"}°
              </p>
              {hasWarning && (
                <p className="text-[9px] text-brand-dark leading-tight mt-1 line-clamp-2">{w?.warning}</p>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function WeatherIcon({ condition, className }: { condition?: string; className?: string }) {
  const sz = 16;
  switch (condition) {
    case "clear":
      return <Sun size={sz} className={cn("text-amber", className)} />;
    case "cloudy":
      return <Cloud size={sz} className={className} />;
    case "snow":
      return <Snowflake size={sz} className={className} />;
    case "wind":
      return <Wind size={sz} className={className} />;
    case "rain":
      return <CloudRain size={sz} className={className} />;
    default:
      return <Sun size={sz} className={className} />;
  }
}
