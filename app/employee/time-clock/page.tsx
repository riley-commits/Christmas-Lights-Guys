"use client";

import * as React from "react";
import { format, parseISO } from "date-fns";
import { Play, Square, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppState } from "@/lib/state";
import { employeeTodayHours, employeeWeekHours, shiftDurationHours } from "@/lib/derive";
import { getEmployee } from "@/lib/mock-data/employees";
import { formatHours, cn } from "@/lib/utils";
import { toast } from "@/components/ui/toaster";

export default function EmployeeTimeClockPage() {
  const { activeEmployeeId, activeShift, shifts, clockIn, clockOut } = useAppState();
  const me = activeEmployeeId ? getEmployee(activeEmployeeId) : null;
  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    if (!activeShift) return;
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, [activeShift]);

  if (!me) return null;

  const onShift = activeShift?.employeeId === me.id;
  const todayHours = employeeTodayHours(shifts, me.id);
  const weekHours = employeeWeekHours(shifts, me.id);
  const currentShiftHours = onShift && activeShift
    ? (now.getTime() - parseISO(activeShift.clockIn).getTime()) / 3600000
    : 0;

  const recent = shifts
    .filter((s) => s.employeeId === me.id)
    .sort((a, b) => (b.clockIn ?? "").localeCompare(a.clockIn ?? ""))
    .slice(0, 5);

  return (
    <div className="px-4 pt-4 pb-2 space-y-4 max-w-2xl mx-auto">
      <h1 className="text-display-md">Time Clock</h1>

      {/* Big clock face */}
      <Card className={cn("border-2", onShift ? "border-pine bg-pine-soft/30" : "border-line")}>
        <CardContent className="p-6 text-center">
          <div className={cn("w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-3", onShift ? "bg-pine text-white" : "bg-bg-subtle text-ink-muted")}>
            <Clock size={36} />
          </div>
          <p className="text-xs uppercase tracking-wider font-bold text-ink-muted">
            {onShift ? "On the clock" : "Off the clock"}
          </p>
          <p className="text-4xl font-extrabold text-ink mt-1 tracking-tight">
            {onShift ? formatHours(currentShiftHours) : "—"}
          </p>
          {onShift && activeShift && (
            <p className="text-xs text-ink-muted mt-1">
              Started {format(parseISO(activeShift.clockIn), "h:mm a")}
            </p>
          )}
          <div className="mt-5">
            {!onShift ? (
              <Button
                variant="primary"
                size="xl"
                className="w-full"
                onClick={() => {
                  clockIn(me.id);
                  toast({ message: "Clocked in.", tone: "success" });
                }}
              >
                <Play size={18} /> Clock In
              </Button>
            ) : (
              <Button
                variant="outline"
                size="xl"
                className="w-full border-2"
                onClick={() => {
                  clockOut(me.id);
                  toast({ message: "Clocked out. Hours logged.", tone: "success" });
                }}
              >
                <Square size={18} /> Clock Out
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-ink-muted uppercase tracking-wider font-bold">Today</p>
            <p className="text-2xl font-extrabold text-ink mt-1">{formatHours(todayHours + currentShiftHours)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-ink-muted uppercase tracking-wider font-bold">This week</p>
            <p className="text-2xl font-extrabold text-ink mt-1">{formatHours(weekHours + currentShiftHours)}</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wider text-ink-muted font-bold mb-2">Recent shifts</p>
        <Card>
          <ul className="divide-y divide-line">
            {recent.length === 0 && <li className="p-6 text-center text-sm text-ink-muted">No shifts yet.</li>}
            {recent.map((s) => {
              const h = shiftDurationHours(s);
              return (
                <li key={s.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {format(parseISO(s.date + "T00:00:00"), "EEE, MMM d")}
                    </p>
                    <p className="text-xs text-ink-muted">
                      {s.clockIn ? format(parseISO(s.clockIn), "h:mm a") : "—"}
                      {" – "}
                      {s.clockOut ? format(parseISO(s.clockOut), "h:mm a") : "now"}
                    </p>
                  </div>
                  {s.clockOut ? (
                    <p className="font-bold text-ink text-sm">{formatHours(h)}</p>
                  ) : (
                    <Badge tone="pine">Active</Badge>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </div>
  );
}
