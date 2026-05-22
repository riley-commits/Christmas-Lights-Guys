"use client";

import * as React from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { MapPin, Clock, Play, Square, ChevronRight, CheckCircle2, Sun, Cloud, CloudRain, Wind, Snowflake, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppState } from "@/lib/state";
import { TODAY_ISO, jobsForEmployeeOnDate, today } from "@/lib/derive";
import { getEmployee } from "@/lib/mock-data/employees";
import { getCustomer } from "@/lib/mock-data/customers";
import { getWeather } from "@/lib/mock-data/weather";
import { ServiceTypeBadge } from "@/components/shared/ServiceTypeBadge";
import { DayRoute } from "@/components/map/DayRoute";
import { Empty } from "@/components/ui/empty";
import { toast } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function EmployeeTodayPage() {
  const router = useRouter();
  const { activeEmployeeId, projects, activeShift, clockIn } = useAppState();
  const me = activeEmployeeId ? getEmployee(activeEmployeeId) : null;
  const [orderedIds, setOrderedIds] = React.useState<string[]>([]);

  if (!me) return null;

  const jobs = jobsForEmployeeOnDate(projects, me.id, TODAY_ISO);
  const stops = jobs.map((p) => {
    const c = getCustomer(p.customerId);
    return {
      id: p.id,
      coords: c!.address.coords,
      label: c?.name ?? "",
      sublabel: c?.address.street ?? "",
    };
  });

  // Compose ordered job list — if router returned an order, use it
  const orderedJobs = orderedIds.length === jobs.length
    ? orderedIds.map((id) => jobs.find((j) => j.id === id)!).filter(Boolean)
    : jobs;

  const onShift = activeShift?.employeeId === me.id;
  const w = getWeather(TODAY_ISO);

  return (
    <div className="px-4 pt-4 pb-2 space-y-4 max-w-2xl mx-auto">
      <div>
        <p className="text-xs uppercase tracking-[0.14em] text-pine font-semibold">
          {format(today(), "EEEE, MMM d")}
        </p>
        <h1 className="text-display-md mt-0.5">Hey {me.name.split(" ")[0]}.</h1>
        <p className="text-sm text-ink-muted mt-0.5">
          {jobs.length === 0
            ? "No jobs on the route today."
            : `${jobs.length} stop${jobs.length === 1 ? "" : "s"} on the route.`}
        </p>
      </div>

      {/* Today's weather banner */}
      {w && (
        <Card className={cn(w.warning && "border-brand/30 bg-brand-soft/40")}>
          <CardContent className="p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white border border-line flex items-center justify-center">
              <WeatherIcon condition={w.condition} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-ink text-sm">
                {w.highC}° / {w.lowC}° · {w.condition} · {w.windKph} km/h
              </p>
              {w.warning && (
                <p className="text-xs text-brand-dark font-medium flex items-center gap-1 mt-0.5">
                  <AlertTriangle size={12} /> {w.warning}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Clock-in CTA */}
      {!onShift ? (
        <Button
          variant="primary"
          size="xl"
          className="w-full text-lg"
          onClick={() => {
            clockIn(me.id);
            toast({ message: "Clocked in — let's go.", tone: "success" });
          }}
        >
          <Play size={20} /> Start Day · Clock In
        </Button>
      ) : (
        <Card className="border-pine/40 bg-pine-soft/40">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pine text-white flex items-center justify-center">
              <Clock size={20} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-ink">You&apos;re on the clock</p>
              <p className="text-xs text-ink-muted">
                Since {format(parseISO(activeShift!.clockIn), "h:mm a")}
              </p>
            </div>
            <Link href="/employee/time-clock">
              <Button variant="outline" size="sm">
                <Square size={14} /> Clock out
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Map */}
      {jobs.length === 0 ? (
        <Empty
          icon={<MapPin />}
          title="Nothing on your route"
          description="Enjoy the day — or check the calendar for upcoming jobs."
        />
      ) : (
        <>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <DayRoute
                start={me.startLocation.coords}
                stops={stops}
                height="280px"
                onChange={(ordered) => setOrderedIds(ordered.map((s) => s.id))}
                onPinClick={(id) => router.push(`/employee/jobs/${id}`)}
              />
            </CardContent>
          </Card>

          {/* Ordered list */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-ink-muted font-bold">Your route</p>
              <p className="text-xs text-ink-muted">Optimized · tap to open</p>
            </div>
            {orderedJobs.map((p, idx) => {
              const c = getCustomer(p.customerId);
              return (
                <Link
                  key={p.id}
                  href={`/employee/jobs/${p.id}`}
                  className="flex items-center gap-3 bg-white rounded-lg border border-line p-3 hover:border-brand/40 transition active:scale-[0.99]"
                >
                  <div className="w-9 h-9 rounded-full bg-brand text-white flex items-center justify-center font-extrabold text-sm flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <ServiceTypeBadge type={p.serviceType} />
                      <span className="text-xs text-ink-muted">
                        {format(parseISO(p.scheduledStart), "h:mm a")}
                      </span>
                      {p.status === "completed" && (
                        <Badge tone="pine">
                          <CheckCircle2 size={10} /> Done
                        </Badge>
                      )}
                    </div>
                    <p className="font-semibold text-ink truncate">{c?.name}</p>
                    <p className="text-xs text-ink-muted truncate flex items-center gap-1">
                      <MapPin size={11} /> {c?.address.street}
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-ink-subtle flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function WeatherIcon({ condition }: { condition?: string }) {
  const sz = 22;
  switch (condition) {
    case "clear":
      return <Sun size={sz} className="text-amber" />;
    case "cloudy":
      return <Cloud size={sz} className="text-ink-muted" />;
    case "snow":
      return <Snowflake size={sz} className="text-ink-muted" />;
    case "wind":
      return <Wind size={sz} className="text-brand" />;
    case "rain":
      return <CloudRain size={sz} className="text-brand" />;
    default:
      return <Sun size={sz} className="text-amber" />;
  }
}
