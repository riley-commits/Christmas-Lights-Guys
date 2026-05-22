"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Label, FieldGroup, FieldHelp } from "@/components/ui/label";
import { useAppState } from "@/lib/state";
import { toast } from "@/components/ui/toaster";
import type { LightsPackage, ServiceType } from "@/lib/types";

const PACKAGES: { value: LightsPackage; label: string; pricePerSqft: number }[] = [
  { value: "Classic Warm White", label: "Classic Warm White", pricePerSqft: 0.78 },
  { value: "Multicolor Pro", label: "Multicolor Pro", pricePerSqft: 0.82 },
  { value: "C9 Premium", label: "C9 Premium — large bulbs", pricePerSqft: 0.92 },
  { value: "Custom", label: "Custom (manual pricing)", pricePerSqft: 0 },
];

export default function NewProjectPage() {
  const router = useRouter();
  const { createProject } = useAppState();

  const [form, setForm] = React.useState({
    name: "",
    phone: "",
    email: "",
    street: "",
    city: "Winnipeg",
    postalCode: "",
    installDate: "",
    takedownDate: "",
    serviceType: "install" as ServiceType,
    crewSize: 2,
    estimatedHours: 4,
    packageType: "Classic Warm White" as LightsPackage,
    sqft: 1800,
    price: 1400,
    notes: "",
    specialInstructions: "",
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const autoPrice = () => {
    const pkg = PACKAGES.find((p) => p.value === form.packageType);
    if (!pkg || pkg.pricePerSqft === 0) return;
    const computed = Math.round(form.sqft * pkg.pricePerSqft);
    set("price", computed);
    toast({ message: `Auto-priced at ${pkg.label}: $${computed.toLocaleString()}`, tone: "info" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.street || !form.installDate) {
      toast({ message: "Customer name, address, and install date are required.", tone: "error" });
      return;
    }
    const p = createProject({
      customer: {
        name: form.name,
        phone: form.phone,
        email: form.email,
        street: form.street,
        city: form.city,
        postalCode: form.postalCode,
      },
      installDate: form.installDate,
      takedownDate: form.takedownDate,
      serviceType: form.serviceType,
      crewSize: form.crewSize,
      estimatedHours: form.estimatedHours,
      packageType: form.packageType,
      sqft: form.sqft,
      price: form.price,
      notes: form.notes,
      specialInstructions: form.specialInstructions,
    });
    toast({ message: `Project created for ${form.name}. Assign a crew next.`, tone: "success" });
    router.push(`/admin/projects/${p.id}`);
  };

  return (
    <div className="p-5 lg:p-8 max-w-3xl mx-auto">
      <Link href="/admin" className="inline-flex items-center text-sm text-ink-muted hover:text-ink gap-1 mb-4">
        <ChevronLeft size={16} /> Back to dashboard
      </Link>
      <h1 className="text-display-md mb-1">New project</h1>
      <p className="text-sm text-ink-muted mb-6">Book a new install, takedown, or repair.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Section title="Customer">
          <div className="grid sm:grid-cols-2 gap-4">
            <FieldGroup>
              <Label>Full name *</Label>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Daniel Roberts" />
            </FieldGroup>
            <FieldGroup>
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="204-555-0000" inputMode="tel" />
            </FieldGroup>
            <FieldGroup className="sm:col-span-2">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="customer@example.com" />
            </FieldGroup>
          </div>
        </Section>

        <Section title="Service address">
          <FieldGroup>
            <Label>Street *</Label>
            <Input value={form.street} onChange={(e) => set("street", e.target.value)} placeholder="812 Oakenwald Ave" />
            <FieldHelp>Used to geocode + add to the daily route map.</FieldHelp>
          </FieldGroup>
          <div className="grid sm:grid-cols-2 gap-4">
            <FieldGroup>
              <Label>City</Label>
              <Input value={form.city} onChange={(e) => set("city", e.target.value)} />
            </FieldGroup>
            <FieldGroup>
              <Label>Postal code</Label>
              <Input value={form.postalCode} onChange={(e) => set("postalCode", e.target.value)} placeholder="R3T 1L6" />
            </FieldGroup>
          </div>
        </Section>

        <Section title="Dates">
          <div className="grid sm:grid-cols-2 gap-4">
            <FieldGroup>
              <Label>Install date *</Label>
              <Input type="date" value={form.installDate} onChange={(e) => set("installDate", e.target.value)} />
            </FieldGroup>
            <FieldGroup>
              <Label>Takedown date</Label>
              <Input type="date" value={form.takedownDate} onChange={(e) => set("takedownDate", e.target.value)} />
            </FieldGroup>
          </div>
        </Section>

        <Section title="Service">
          <FieldGroup>
            <Label>Service type</Label>
            <div className="grid grid-cols-3 gap-2">
              {(["install", "takedown", "repair"] as ServiceType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set("serviceType", t)}
                  className={`h-11 rounded-md border-2 text-sm font-semibold capitalize transition ${
                    form.serviceType === t
                      ? "border-brand bg-brand-soft text-brand-dark"
                      : "border-line-strong bg-white text-ink-muted hover:bg-bg-subtle"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </FieldGroup>
          <div className="grid sm:grid-cols-2 gap-4">
            <FieldGroup>
              <Label>Crew size</Label>
              <Select value={form.crewSize} onChange={(e) => set("crewSize", Number(e.target.value))}>
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "person" : "people"}
                  </option>
                ))}
              </Select>
            </FieldGroup>
            <FieldGroup>
              <Label>Estimated hours</Label>
              <Input
                type="number"
                min={0.5}
                step={0.5}
                value={form.estimatedHours}
                onChange={(e) => set("estimatedHours", Number(e.target.value))}
              />
            </FieldGroup>
          </div>
        </Section>

        <Section title="Materials & price">
          <div className="grid sm:grid-cols-2 gap-4">
            <FieldGroup>
              <Label>Lights package</Label>
              <Select value={form.packageType} onChange={(e) => set("packageType", e.target.value as LightsPackage)}>
                {PACKAGES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </Select>
            </FieldGroup>
            <FieldGroup>
              <Label>Square footage</Label>
              <Input
                type="number"
                min={0}
                value={form.sqft}
                onChange={(e) => set("sqft", Number(e.target.value))}
              />
            </FieldGroup>
          </div>
          <FieldGroup>
            <Label>Price (CAD)</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => set("price", Number(e.target.value))}
              />
              <Button type="button" variant="outline" onClick={autoPrice}>
                <Sparkles size={14} /> Auto-price
              </Button>
            </div>
            <FieldHelp>Auto-price uses package &times; sq ft. Override anytime.</FieldHelp>
          </FieldGroup>
        </Section>

        <Section title="Notes & instructions">
          <FieldGroup>
            <Label>Notes</Label>
            <Textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Two-story, west garage outlet, repeat customer..."
            />
          </FieldGroup>
          <FieldGroup>
            <Label>Special instructions for the crew</Label>
            <Textarea
              value={form.specialInstructions}
              onChange={(e) => set("specialInstructions", e.target.value)}
              placeholder="Heritage home — no nails, clips only..."
            />
          </FieldGroup>
          <FieldGroup>
            <Label>Site photos</Label>
            <div className="border-2 border-dashed border-line-strong rounded-md p-6 text-center bg-bg-subtle/40">
              <Upload size={20} className="mx-auto text-ink-subtle mb-1.5" />
              <p className="text-sm text-ink-muted">Drop photos here or tap to upload</p>
              <p className="text-xs text-ink-subtle mt-1">Coming soon — placeholder only</p>
            </div>
          </FieldGroup>
        </Section>

        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
          <Link href="/admin" className="sm:w-auto">
            <Button type="button" variant="outline" size="lg" className="w-full sm:w-auto">
              Cancel
            </Button>
          </Link>
          <Button type="submit" size="lg" className="flex-1">
            Create project
          </Button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.12em] text-ink-muted font-bold mb-4">{title}</p>
        <div className="space-y-4">{children}</div>
      </CardContent>
    </Card>
  );
}
