"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { format, parseISO } from "date-fns";
import { ChevronLeft, MapPin, Calendar, Clock, Package2, DollarSign, FileText, AlertTriangle, History, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/lib/state";
import { getCustomer } from "@/lib/mock-data/customers";
import { ServiceTypeBadge } from "@/components/shared/ServiceTypeBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MapBase } from "@/components/map/MapBase";
import { formatCurrency, formatHours, initials, cn } from "@/lib/utils";
import { toast } from "@/components/ui/toaster";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { projects, employees, assignCrew, markJobComplete, setProjectStatus } = useAppState();

  const project = projects.find((p) => p.id === id);
  const customer = project ? getCustomer(project.customerId) : null;

  const [selected, setSelected] = React.useState<string[]>(project?.assignedEmployeeIds ?? []);
  const [scheduledStart, setScheduledStart] = React.useState(project?.scheduledStart ?? "");

  React.useEffect(() => {
    if (project) {
      setSelected(project.assignedEmployeeIds);
      setScheduledStart(project.scheduledStart);
    }
  }, [project]);

  if (!project || !customer) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <p className="text-ink-muted">Project not found.</p>
        <Link href="/admin/projects" className="text-brand font-semibold mt-2 inline-block">
          Back to projects
        </Link>
      </div>
    );
  }

  const toggle = (eid: string) =>
    setSelected((s) => (s.includes(eid) ? s.filter((x) => x !== eid) : [...s, eid]));

  const handleAssign = () => {
    assignCrew(project.id, selected, scheduledStart);
    toast({ message: `Crew updated — ${selected.length} assigned.`, tone: "success" });
  };

  const handleComplete = () => {
    markJobComplete(project.id);
    toast({ message: "Job marked complete.", tone: "success" });
  };

  return (
    <div className="p-5 lg:p-8 max-w-5xl mx-auto">
      <Link href="/admin/projects" className="inline-flex items-center text-sm text-ink-muted hover:text-ink gap-1 mb-4">
        <ChevronLeft size={16} /> All projects
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <ServiceTypeBadge type={project.serviceType} />
            <StatusBadge status={project.status} />
          </div>
          <h1 className="text-display-md">{customer.name}</h1>
          <p className="text-ink-muted text-sm mt-1 flex items-center gap-1">
            <MapPin size={14} /> {customer.address.street}, {customer.address.city}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {project.status !== "completed" && (
            <Button variant="pine" size="lg" onClick={handleComplete} className="flex-1 sm:flex-initial">
              <CheckCircle2 size={16} /> Mark complete
            </Button>
          )}
          {project.status === "scheduled" && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                setProjectStatus(project.id, "in_progress");
                toast("Set to in progress");
              }}
            >
              Start
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardContent className="p-5">
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <Item icon={<Calendar size={14} />} label="Install date">
                  {format(parseISO(project.installDate + "T00:00:00"), "EEE, MMM d, yyyy")}
                </Item>
                {project.takedownDate && (
                  <Item icon={<Calendar size={14} />} label="Takedown date">
                    {format(parseISO(project.takedownDate + "T00:00:00"), "EEE, MMM d, yyyy")}
                  </Item>
                )}
                <Item icon={<Clock size={14} />} label="Scheduled start">
                  {format(parseISO(project.scheduledStart), "h:mm a")}
                </Item>
                <Item icon={<Clock size={14} />} label="Estimated hours">
                  {formatHours(project.estimatedHours)} · crew of {project.crewSize}
                </Item>
                <Item icon={<Package2 size={14} />} label="Package">
                  {project.packageType} · {project.sqft.toLocaleString()} sq ft
                </Item>
                <Item icon={<DollarSign size={14} />} label="Price">
                  <span className="font-bold text-ink">{formatCurrency(project.price)}</span>
                </Item>
              </div>
            </CardContent>
          </Card>

          {project.specialInstructions && (
            <Card>
              <CardContent className="p-5 flex gap-3">
                <AlertTriangle size={20} className="text-amber flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-ink-muted font-bold mb-1">
                    Special instructions
                  </p>
                  <p className="text-sm text-ink leading-relaxed">{project.specialInstructions}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {project.notes && (
            <Card>
              <CardContent className="p-5 flex gap-3">
                <FileText size={20} className="text-ink-muted flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-ink-muted font-bold mb-1">Notes</p>
                  <p className="text-sm text-ink leading-relaxed">{project.notes}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {customer.lastYear && (
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <History size={16} className="text-pine" />
                  <p className="text-xs uppercase tracking-wide text-ink-muted font-bold">
                    Last year — {customer.lastYear.season}
                  </p>
                </div>
                <div className="grid sm:grid-cols-3 gap-3 text-sm mb-3">
                  <div>
                    <p className="text-ink-muted text-xs">Package</p>
                    <p className="font-semibold text-ink">{customer.lastYear.packageType}</p>
                  </div>
                  <div>
                    <p className="text-ink-muted text-xs">Sq ft</p>
                    <p className="font-semibold text-ink">{customer.lastYear.sqft.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-ink-muted text-xs">Charged</p>
                    <p className="font-semibold text-ink">{formatCurrency(customer.lastYear.priceCharged)}</p>
                  </div>
                </div>
                <p className="text-sm text-ink-muted leading-relaxed border-l-2 border-pine pl-3">
                  {customer.lastYear.notes}
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-0">
              <MapBase
                pins={[
                  {
                    id: project.id,
                    coords: customer.address.coords,
                    label: customer.name,
                    sublabel: customer.address.street,
                  },
                ]}
                height="280px"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wide text-ink-muted font-bold mb-3">Customer</p>
              <p className="font-semibold text-ink">{customer.name}</p>
              {customer.phone && <a href={`tel:${customer.phone}`} className="text-sm text-brand font-medium block mt-1">{customer.phone}</a>}
              {customer.email && <a href={`mailto:${customer.email}`} className="text-sm text-ink-muted block mt-0.5 truncate">{customer.email}</a>}
              <div className="mt-3 pt-3 border-t border-line text-sm text-ink-muted">
                {customer.address.street}
                <br />
                {customer.address.city}, {customer.address.postalCode}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wide text-ink-muted font-bold mb-3">Assign crew</p>
              <div className="space-y-2 mb-4">
                {employees.map((e) => {
                  const isSelected = selected.includes(e.id);
                  return (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => toggle(e.id)}
                      className={cn(
                        "w-full flex items-center gap-3 p-2.5 rounded-md border-2 transition text-left",
                        isSelected
                          ? "border-pine bg-pine-soft/60"
                          : "border-line bg-white hover:bg-bg-subtle"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                        isSelected ? "bg-pine text-white" : "bg-bg-subtle text-ink"
                      )}>
                        {e.initials ?? initials(e.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-ink truncate">{e.name}</p>
                        <p className="text-xs text-ink-muted capitalize">{e.role}</p>
                      </div>
                      <div className={cn(
                        "w-5 h-5 rounded border-2 flex items-center justify-center",
                        isSelected ? "border-pine bg-pine" : "border-line-strong"
                      )}>
                        {isSelected && <CheckCircle2 size={12} className="text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
              <label className="text-xs text-ink-muted font-semibold uppercase tracking-wide mb-1.5 block">
                Scheduled start
              </label>
              <Input
                type="datetime-local"
                value={scheduledStart.slice(0, 16)}
                onChange={(e) => setScheduledStart(e.target.value + ":00")}
              />
              <Button variant="primary" size="md" className="w-full mt-4" onClick={handleAssign}>
                Save assignment
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wide text-ink-muted font-bold mb-3">
                Job checklist
              </p>
              <ul className="space-y-2">
                {project.checklist.map((c) => (
                  <li key={c.id} className="flex items-center gap-2 text-sm">
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border-2 flex-shrink-0",
                        c.done ? "border-pine bg-pine" : "border-line-strong"
                      )}
                    />
                    <span className={c.done ? "text-ink-muted line-through" : "text-ink"}>
                      {c.label}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-ink-muted mt-3">
                Crew checks these off on the job in the employee app.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Item({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-ink-muted flex items-center gap-1 mb-0.5">
        {icon} {label}
      </p>
      <p className="text-sm text-ink">{children}</p>
    </div>
  );
}
