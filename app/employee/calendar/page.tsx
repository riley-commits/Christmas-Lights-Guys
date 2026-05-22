"use client";

import * as React from "react";
import Link from "next/link";
import { addMonths, format, parseISO, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth } from "date-fns";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/lib/state";
import { today } from "@/lib/derive";
import { getEmployee } from "@/lib/mock-data/employees";
import { getCustomer } from "@/lib/mock-data/customers";
import { ServiceTypeBadge } from "@/components/shared/ServiceTypeBadge";
import { cn } from "@/lib/utils";

export default function EmployeeCalendarPage() {
  const { activeEmployeeId, projects } = useAppState();
  const me = activeEmployeeId ? getEmployee(activeEmployeeId) : null;
  const [month, setMonth] = React.useState(today());
  const [selected, setSelected] = React.useState<string>(format(today(), "yyyy-MM-dd"));

  if (!me) return null;

  const myJobs = projects.filter((p) => p.assignedEmployeeIds.includes(me.id));
  const jobDates = new Set(myJobs.map((j) => j.installDate));
  const selectedJobs = myJobs
    .filter((j) => j.installDate === selected)
    .sort((a, b) => a.scheduledStart.localeCompare(b.scheduledStart));

  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  return (
    <div className="px-4 pt-4 pb-2 space-y-4 max-w-2xl mx-auto">
      <h1 className="text-display-md">Calendar</h1>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Button variant="outline" size="sm" onClick={() => setMonth(addMonths(month, -1))} aria-label="Previous month">
            <ChevronLeft size={16} />
          </Button>
          <p className="font-bold text-ink">{format(month, "MMMM yyyy")}</p>
          <Button variant="outline" size="sm" onClick={() => setMonth(addMonths(month, 1))} aria-label="Next month">
            <ChevronRight size={16} />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-wider text-ink-muted font-bold mb-1">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((d) => {
            const iso = format(d, "yyyy-MM-dd");
            const hasJob = jobDates.has(iso);
            const isSel = iso === selected;
            const isTod = isSameDay(d, today());
            const inMonth = isSameMonth(d, month);
            return (
              <button
                key={iso}
                onClick={() => setSelected(iso)}
                className={cn(
                  "aspect-square rounded-md flex flex-col items-center justify-center text-sm relative font-semibold",
                  !inMonth && "text-ink-subtle",
                  isSel && "bg-brand text-white",
                  !isSel && isTod && "bg-brand-soft text-brand-dark",
                  !isSel && !isTod && inMonth && "hover:bg-bg-subtle text-ink"
                )}
              >
                {format(d, "d")}
                {hasJob && (
                  <span
                    className={cn(
                      "absolute bottom-1 w-1.5 h-1.5 rounded-full",
                      isSel ? "bg-white" : "bg-brand"
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
      </Card>

      <div>
        <p className="text-xs uppercase tracking-wider text-ink-muted font-bold mb-2">
          {format(parseISO(selected + "T00:00:00"), "EEEE, MMMM d")}
        </p>
        {selectedJobs.length === 0 ? (
          <Card className="p-6 text-center text-sm text-ink-muted">No jobs scheduled.</Card>
        ) : (
          <div className="space-y-2">
            {selectedJobs.map((p) => {
              const c = getCustomer(p.customerId);
              return (
                <Link
                  key={p.id}
                  href={`/employee/jobs/${p.id}`}
                  className="block bg-white rounded-lg border border-line p-3.5 active:scale-[0.99]"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <ServiceTypeBadge type={p.serviceType} />
                    <span className="text-xs text-ink-muted">
                      {format(parseISO(p.scheduledStart), "h:mm a")} · {p.estimatedHours}h
                    </span>
                  </div>
                  <p className="font-semibold text-ink">{c?.name}</p>
                  <p className="text-xs text-ink-muted flex items-center gap-1 mt-0.5">
                    <MapPin size={11} /> {c?.address.street}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
