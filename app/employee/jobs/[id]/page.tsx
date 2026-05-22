"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { ChevronLeft, MapPin, Phone, Clock, Package2, CheckCircle2, AlertTriangle, History, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppState } from "@/lib/state";
import { getCustomer } from "@/lib/mock-data/customers";
import { ServiceTypeBadge } from "@/components/shared/ServiceTypeBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MapBase } from "@/components/map/MapBase";
import { cn, formatHours } from "@/lib/utils";
import { toast } from "@/components/ui/toaster";

export default function EmployeeJobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { projects, toggleChecklistItem, markJobComplete } = useAppState();

  const project = projects.find((p) => p.id === id);
  const customer = project ? getCustomer(project.customerId) : null;
  const [showCompleteAnim, setShowCompleteAnim] = React.useState(false);

  if (!project || !customer) {
    return (
      <div className="p-6">
        <p className="text-ink-muted">Job not found.</p>
        <Link href="/employee" className="text-brand font-semibold mt-2 inline-block">
          Back to today
        </Link>
      </div>
    );
  }

  const allDone = project.checklist.every((c) => c.done);

  const handleComplete = () => {
    markJobComplete(project.id);
    setShowCompleteAnim(true);
    setTimeout(() => {
      setShowCompleteAnim(false);
      toast({ message: "Nice work — job marked complete.", tone: "success" });
      router.push("/employee");
    }, 1100);
  };

  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${customer.address.coords[1]},${customer.address.coords[0]}`;

  return (
    <div className="px-4 pt-4 pb-2 space-y-4 max-w-2xl mx-auto">
      <Link href="/employee" className="inline-flex items-center text-sm text-ink-muted hover:text-ink gap-1">
        <ChevronLeft size={16} /> Route
      </Link>

      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <ServiceTypeBadge type={project.serviceType} />
          <StatusBadge status={project.status} />
        </div>
        <h1 className="text-display-md leading-tight">{customer.name}</h1>
        <p className="text-sm text-ink-muted mt-1 flex items-center gap-1">
          <MapPin size={14} /> {customer.address.street}, {customer.address.city}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <a href={`tel:${customer.phone}`} className="flex-1">
          <Button variant="outline" size="lg" className="w-full">
            <Phone size={16} /> Call
          </Button>
        </a>
        <a href={directionsHref} target="_blank" rel="noreferrer" className="flex-1">
          <Button variant="pine" size="lg" className="w-full">
            <Navigation size={16} /> Directions
          </Button>
        </a>
      </div>

      <Card className="overflow-hidden">
        <MapBase
          pins={[
            { id: project.id, coords: customer.address.coords, label: customer.name, sublabel: customer.address.street },
          ]}
          height="220px"
        />
      </Card>

      <Card>
        <CardContent className="p-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-ink-muted flex items-center gap-1 mb-0.5">
              <Clock size={12} /> Start
            </p>
            <p className="font-semibold">{format(parseISO(project.scheduledStart), "h:mm a")}</p>
          </div>
          <div>
            <p className="text-xs text-ink-muted flex items-center gap-1 mb-0.5">
              <Clock size={12} /> Estimated
            </p>
            <p className="font-semibold">{formatHours(project.estimatedHours)}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-ink-muted flex items-center gap-1 mb-0.5">
              <Package2 size={12} /> Package
            </p>
            <p className="font-semibold">
              {project.packageType} · {project.sqft.toLocaleString()} sq ft
            </p>
          </div>
        </CardContent>
      </Card>

      {project.specialInstructions && (
        <Card className="border-amber/30 bg-amber-soft/60">
          <CardContent className="p-4 flex gap-3">
            <AlertTriangle size={18} className="text-amber flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs uppercase tracking-wide text-amber font-bold mb-0.5">
                Heads up
              </p>
              <p className="text-sm text-ink leading-relaxed">{project.specialInstructions}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {customer.lastYear && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <History size={14} className="text-pine" />
              <p className="text-xs uppercase tracking-wide text-pine font-bold">
                Last year ({customer.lastYear.season})
              </p>
            </div>
            <p className="text-sm text-ink leading-relaxed">{customer.lastYear.notes}</p>
          </CardContent>
        </Card>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs uppercase tracking-wide text-ink-muted font-bold">Checklist</p>
          <p className="text-xs text-ink-muted">
            {project.checklist.filter((c) => c.done).length} / {project.checklist.length}
          </p>
        </div>
        <Card>
          <ul className="divide-y divide-line">
            {project.checklist.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => toggleChecklistItem(project.id, c.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-bg-subtle"
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition",
                      c.done ? "border-pine bg-pine" : "border-line-strong bg-white"
                    )}
                  >
                    {c.done && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                  <span
                    className={cn(
                      "text-[15px] flex-1",
                      c.done ? "text-ink-muted line-through" : "text-ink"
                    )}
                  >
                    {c.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {project.status !== "completed" && (
        <Button
          variant="primary"
          size="xl"
          className="w-full text-lg sticky bottom-24"
          onClick={handleComplete}
          disabled={!allDone}
        >
          <CheckCircle2 size={20} />
          {allDone ? "Mark complete" : `${project.checklist.length - project.checklist.filter((c) => c.done).length} steps left`}
        </Button>
      )}

      {showCompleteAnim && (
        <div className="fixed inset-0 z-50 bg-pine/90 backdrop-blur-sm flex items-center justify-center animate-fade-in">
          <div className="text-center animate-scale-in">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={56} className="text-pine" />
            </div>
            <p className="text-white text-2xl font-extrabold">Job complete!</p>
          </div>
        </div>
      )}
    </div>
  );
}
