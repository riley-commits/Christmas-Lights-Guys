"use client";

import * as React from "react";
import { format, parseISO } from "date-fns";
import { Clock4, CheckCircle2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppState } from "@/lib/state";
import { employeeWeekHours, shiftDurationHours } from "@/lib/derive";
import { formatCurrency, formatHours, cn, initials } from "@/lib/utils";
import { toast } from "@/components/ui/toaster";

export default function TimesheetsPage() {
  const { employees, shifts, activeShift } = useAppState();

  const totals = employees.map((e) => {
    const hours = employeeWeekHours(shifts, e.id);
    const cost = hours * e.hourlyRate;
    return { e, hours, cost };
  });

  const totalPayroll = totals.reduce((s, t) => s + t.cost, 0);
  const totalHours = totals.reduce((s, t) => s + t.hours, 0);

  return (
    <div className="p-5 lg:p-8 max-w-5xl mx-auto">
      <h1 className="text-display-md mb-1">Timesheets</h1>
      <p className="text-sm text-ink-muted mb-5">Current pay period — review and approve crew hours.</p>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <KpiCard icon={<Clock4 size={16} />} label="Total hours" value={formatHours(totalHours)} tone="ink" />
        <KpiCard icon={<DollarSign size={16} />} label="Payroll cost" value={formatCurrency(totalPayroll)} tone="brand" />
        <KpiCard icon={<CheckCircle2 size={16} />} label="Ready to approve" value={`${employees.length}`} tone="pine" />
      </div>

      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-line">
          <h2 className="font-semibold text-ink">Crew this week</h2>
        </div>
        <ul className="divide-y divide-line">
          {totals.map(({ e, hours, cost }) => {
            const onShift = activeShift?.employeeId === e.id;
            const empShifts = shifts.filter((s) => s.employeeId === e.id).slice(0, 5);
            return (
              <li key={e.id} className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-10 h-10 rounded-full bg-pine-soft text-pine-dark flex items-center justify-center font-bold text-sm">
                    {e.initials ?? initials(e.name)}
                    {onShift && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-pine border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink">{e.name}</p>
                    <p className="text-xs text-ink-muted capitalize">
                      {e.role} · {formatCurrency(e.hourlyRate)}/h
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-ink">{formatHours(hours)}</p>
                    <p className="text-xs text-ink-muted">{formatCurrency(cost)}</p>
                  </div>
                  <Button
                    variant="pine"
                    size="sm"
                    onClick={() => toast({ message: `${e.name}'s hours approved.`, tone: "success" })}
                  >
                    <CheckCircle2 size={14} /> Approve
                  </Button>
                </div>
                <div className="overflow-x-auto scrollbar-hide">
                  <table className="w-full text-sm min-w-[480px]">
                    <thead>
                      <tr className="text-xs text-ink-muted text-left">
                        <th className="font-medium pb-1.5">Date</th>
                        <th className="font-medium pb-1.5">In</th>
                        <th className="font-medium pb-1.5">Out</th>
                        <th className="font-medium pb-1.5 text-right">Hours</th>
                        <th className="font-medium pb-1.5 text-right">Pay</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line/60">
                      {empShifts.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-ink-subtle italic py-2">
                            No shifts logged.
                          </td>
                        </tr>
                      ) : (
                        empShifts.map((s) => {
                          const h = shiftDurationHours(s);
                          return (
                            <tr key={s.id}>
                              <td className="py-1.5 text-ink">
                                {format(parseISO(s.date + "T00:00:00"), "EEE MMM d")}
                              </td>
                              <td className="py-1.5 text-ink-muted">
                                {s.clockIn ? format(parseISO(s.clockIn), "h:mm a") : "—"}
                              </td>
                              <td className="py-1.5 text-ink-muted">
                                {s.clockOut ? format(parseISO(s.clockOut), "h:mm a") : <Badge tone="pine">Active</Badge>}
                              </td>
                              <td className="py-1.5 text-right font-semibold">{formatHours(h)}</td>
                              <td className="py-1.5 text-right text-ink">
                                {formatCurrency(h * e.hourlyRate)}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
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
