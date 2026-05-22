"use client";

import * as React from "react";
import Link from "next/link";
import { addDays, format, parseISO, startOfWeek, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/lib/state";
import { today } from "@/lib/derive";
import { getCustomer } from "@/lib/mock-data/customers";
import { ServiceTypeBadge } from "@/components/shared/ServiceTypeBadge";
import { cn, initials } from "@/lib/utils";
import { getWeather } from "@/lib/mock-data/weather";
import { Snowflake, Sun, Cloud, CloudRain, Wind, AlertTriangle } from "lucide-react";

export default function SchedulePage() {
  const { projects, employees } = useAppState();
  const [weekStart, setWeekStart] = React.useState(() => startOfWeek(today(), { weekStartsOn: 1 }));

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h1 className="text-display-md">Schedule</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWeekStart((d) => addDays(d, -7))}
            aria-label="Previous week"
          >
            <ChevronLeft size={16} />
          </Button>
          <p className="font-semibold text-ink text-sm min-w-[170px] text-center">
            {format(weekStart, "MMM d")} – {format(addDays(weekStart, 6), "MMM d, yyyy")}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWeekStart((d) => addDays(d, 7))}
            aria-label="Next week"
          >
            <ChevronRight size={16} />
          </Button>
          <Button
            variant="subtle"
            size="sm"
            onClick={() => setWeekStart(startOfWeek(today(), { weekStartsOn: 1 }))}
          >
            This week
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-7 divide-y lg:divide-y-0 lg:divide-x divide-line">
          {weekDays.map((d) => {
            const iso = format(d, "yyyy-MM-dd");
            const dayProjects = projects
              .filter((p) => p.installDate === iso)
              .sort((a, b) => a.scheduledStart.localeCompare(b.scheduledStart));
            const w = getWeather(iso);
            const isToday = isSameDay(d, today());
            return (
              <div key={iso} className={cn("min-h-[180px] flex flex-col", isToday && "bg-brand-soft/30")}>
                <div className={cn("px-3 py-2.5 border-b border-line flex items-center justify-between", isToday && "bg-brand-soft")}>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-ink-muted font-semibold">
                      {format(d, "EEE")}
                    </p>
                    <p className="font-extrabold text-base text-ink leading-tight">
                      {format(d, "d")}
                    </p>
                  </div>
                  <DayWeather iso={iso} />
                </div>
                {w?.warning && (
                  <div className="px-3 py-1.5 bg-amber-soft text-amber border-b border-amber/20 text-[10px] font-semibold flex items-center gap-1">
                    <AlertTriangle size={10} /> {w.warning}
                  </div>
                )}
                <div className="p-2 space-y-1.5 flex-1">
                  {dayProjects.length === 0 ? (
                    <p className="text-[11px] text-ink-subtle italic px-1.5 pt-1">No jobs</p>
                  ) : (
                    dayProjects.map((p) => {
                      const c = getCustomer(p.customerId);
                      const tone =
                        p.serviceType === "install"
                          ? "border-l-brand bg-brand-soft/40"
                          : p.serviceType === "takedown"
                          ? "border-l-pine bg-pine-soft/40"
                          : "border-l-amber bg-amber-soft/40";
                      return (
                        <Link
                          key={p.id}
                          href={`/admin/projects/${p.id}`}
                          className={cn(
                            "block rounded-md border-l-4 border border-line-strong/40 bg-white p-2 hover:shadow-sm transition",
                            tone
                          )}
                        >
                          <p className="text-[10px] text-ink-muted font-semibold uppercase tracking-wider">
                            {format(parseISO(p.scheduledStart), "h:mm a")}
                          </p>
                          <p className="text-xs font-bold text-ink truncate">{c?.name}</p>
                          <p className="text-[10px] text-ink-muted truncate flex items-center gap-0.5">
                            <MapPin size={9} /> {c?.address.street}
                          </p>
                          <div className="flex items-center justify-between mt-1.5">
                            <ServiceTypeBadge type={p.serviceType} />
                            <div className="flex -space-x-1">
                              {p.assignedEmployeeIds.slice(0, 3).map((eid) => {
                                const e = employees.find((x) => x.id === eid);
                                if (!e) return null;
                                return (
                                  <div
                                    key={eid}
                                    className="w-4 h-4 rounded-full bg-pine border border-white text-[8px] font-bold text-white flex items-center justify-center"
                                    title={e.name}
                                  >
                                    {(e.initials ?? initials(e.name))[0]}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function DayWeather({ iso }: { iso: string }) {
  const w = getWeather(iso);
  if (!w) return null;
  const sz = 14;
  const icon =
    w.condition === "clear" ? (
      <Sun size={sz} className="text-amber" />
    ) : w.condition === "cloudy" ? (
      <Cloud size={sz} className="text-ink-muted" />
    ) : w.condition === "snow" ? (
      <Snowflake size={sz} className="text-ink-muted" />
    ) : w.condition === "wind" ? (
      <Wind size={sz} className="text-brand" />
    ) : (
      <CloudRain size={sz} className="text-brand" />
    );
  return (
    <div className="flex items-center gap-1 text-[10px] text-ink-muted font-semibold">
      {icon} <span>{w.highC}°</span>
    </div>
  );
}
