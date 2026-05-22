"use client";

import * as React from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Plus, Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { useAppState } from "@/lib/state";
import { getCustomer } from "@/lib/mock-data/customers";
import { formatCurrency, initials } from "@/lib/utils";
import { ServiceTypeBadge } from "@/components/shared/ServiceTypeBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Empty } from "@/components/ui/empty";
import type { ProjectStatus, ServiceType } from "@/lib/types";

export default function ProjectsListPage() {
  const { projects, employees } = useAppState();
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<ProjectStatus | "all">("all");
  const [serviceType, setServiceType] = React.useState<ServiceType | "all">("all");

  const filtered = projects
    .filter((p) => {
      if (status !== "all" && p.status !== status) return false;
      if (serviceType !== "all" && p.serviceType !== serviceType) return false;
      if (q) {
        const c = getCustomer(p.customerId);
        const blob = `${c?.name} ${c?.address.street} ${p.notes}`.toLowerCase();
        if (!blob.includes(q.toLowerCase())) return false;
      }
      return true;
    })
    .sort((a, b) => a.installDate.localeCompare(b.installDate));

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h1 className="text-display-md">Projects</h1>
          <p className="text-sm text-ink-muted mt-0.5">
            {filtered.length} of {projects.length} project{projects.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link href="/admin/projects/new">
          <Button variant="primary" size="lg">
            <Plus size={18} /> New Project
          </Button>
        </Link>
      </div>

      <Card className="p-4 mb-5">
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search customer, address, notes..."
              className="pl-9"
            />
          </div>
          <Select value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus | "all")}>
            <option value="all">All statuses</option>
            <option value="needs_assignment">Needs crew</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
          </Select>
          <Select value={serviceType} onChange={(e) => setServiceType(e.target.value as ServiceType | "all")}>
            <option value="all">All service types</option>
            <option value="install">Install</option>
            <option value="takedown">Takedown</option>
            <option value="repair">Repair</option>
          </Select>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Empty title="No projects match" description="Try clearing filters or creating a new project." />
      ) : (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-line">
            {filtered.map((p) => {
              const c = getCustomer(p.customerId);
              return (
                <li key={p.id}>
                  <Link
                    href={`/admin/projects/${p.id}`}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-bg-subtle/60 transition"
                  >
                    <div className="text-center w-12 flex-shrink-0">
                      <p className="text-[10px] uppercase tracking-wider text-ink-muted font-semibold">
                        {format(parseISO(p.installDate + "T00:00:00"), "MMM")}
                      </p>
                      <p className="font-extrabold text-lg leading-tight">
                        {format(parseISO(p.installDate + "T00:00:00"), "d")}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <ServiceTypeBadge type={p.serviceType} />
                        <StatusBadge status={p.status} />
                      </div>
                      <p className="font-semibold text-ink truncate">{c?.name}</p>
                      <p className="text-xs text-ink-muted truncate flex items-center gap-1">
                        <MapPin size={11} /> {c?.address.street}
                      </p>
                    </div>
                    <div className="hidden md:flex flex-col items-end gap-1">
                      <p className="font-bold text-ink text-sm">{formatCurrency(p.price)}</p>
                      <div className="flex -space-x-1.5">
                        {p.assignedEmployeeIds.slice(0, 3).map((eid) => {
                          const e = employees.find((x) => x.id === eid);
                          if (!e) return null;
                          return (
                            <div
                              key={eid}
                              className="w-6 h-6 rounded-full bg-pine-soft border-2 border-white text-[9px] font-bold text-pine-dark flex items-center justify-center"
                              title={e.name}
                            >
                              {e.initials ?? initials(e.name)}
                            </div>
                          );
                        })}
                        {p.assignedEmployeeIds.length === 0 && (
                          <span className="text-[10px] text-amber font-semibold">No crew</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}
