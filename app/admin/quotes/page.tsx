"use client";

import * as React from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Plus, ArrowUpRight, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/input";
import { Label, FieldGroup, FieldHelp } from "@/components/ui/label";
import { useAppState } from "@/lib/state";
import { getCustomer } from "@/lib/mock-data/customers";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "@/components/ui/toaster";
import type { LightsPackage, Quote } from "@/lib/types";

const PACKAGES: { value: LightsPackage; pricePerSqft: number }[] = [
  { value: "Classic Warm White", pricePerSqft: 0.78 },
  { value: "Multicolor Pro", pricePerSqft: 0.82 },
  { value: "C9 Premium", pricePerSqft: 0.92 },
];

export default function QuotesPage() {
  const { quotes, customers, acceptQuote } = useAppState();
  const [showForm, setShowForm] = React.useState(false);

  const sorted = [...quotes].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="p-5 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <h1 className="text-display-md">Quotes</h1>
          <p className="text-sm text-ink-muted mt-0.5">Send estimates. Accepted quotes convert to projects.</p>
        </div>
        <Button variant="primary" size="lg" onClick={() => setShowForm((v) => !v)}>
          <Plus size={18} /> New Quote
        </Button>
      </div>

      {showForm && <NewQuoteForm customers={customers} onDone={() => setShowForm(false)} />}

      <Card className="overflow-hidden">
        <ul className="divide-y divide-line">
          {sorted.length === 0 && (
            <li className="p-8 text-center text-sm text-ink-muted">No quotes yet.</li>
          )}
          {sorted.map((q) => {
            const c = getCustomer(q.customerId);
            return (
              <li key={q.id} className="px-5 py-4 flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <QuoteStatusBadge q={q} />
                    <span className="text-xs text-ink-muted">
                      {format(parseISO(q.createdAt), "MMM d")} · {q.packageType}
                    </span>
                  </div>
                  <p className="font-semibold text-ink truncate">{c?.name ?? "Customer"}</p>
                  <p className="text-xs text-ink-muted truncate">
                    {q.sqft.toLocaleString()} sq ft @ {formatCurrency(q.pricePerSqft)}/ft²
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-ink">{formatCurrency(q.subtotal)}</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Link href={`/quote/${q.id}`} target="_blank" className="flex-1 sm:flex-initial">
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink size={14} /> Public link
                    </Button>
                  </Link>
                  {q.status === "sent" && (
                    <Button
                      variant="pine"
                      size="sm"
                      onClick={() => {
                        const p = acceptQuote(q.id);
                        if (p) {
                          toast({ message: "Quote accepted — project created.", tone: "success" });
                        }
                      }}
                    >
                      Accept → Project
                    </Button>
                  )}
                  {q.convertedProjectId && (
                    <Link href={`/admin/projects/${q.convertedProjectId}`}>
                      <Button variant="subtle" size="sm">
                        Project <ArrowUpRight size={14} />
                      </Button>
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}

function QuoteStatusBadge({ q }: { q: Quote }) {
  if (q.status === "accepted") return <Badge tone="pine">Accepted</Badge>;
  if (q.status === "sent") return <Badge tone="amber">Sent</Badge>;
  if (q.status === "rejected") return <Badge tone="outline">Rejected</Badge>;
  return <Badge tone="neutral">Draft</Badge>;
}

function NewQuoteForm({
  customers,
  onDone,
}: {
  customers: Array<{ id: string; name: string }>;
  onDone: () => void;
}) {
  const [customerId, setCustomerId] = React.useState(customers[0]?.id ?? "");
  const [pkg, setPkg] = React.useState<LightsPackage>("Classic Warm White");
  const [sqft, setSqft] = React.useState(2000);

  const pricePerSqft = PACKAGES.find((p) => p.value === pkg)?.pricePerSqft ?? 0.8;
  const subtotal = Math.round(sqft * pricePerSqft);

  return (
    <Card className="mb-5">
      <CardContent className="p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.12em] text-ink-muted font-bold mb-4">
          Build a new quote
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <FieldGroup>
            <Label>Customer</Label>
            <Select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </FieldGroup>
          <FieldGroup>
            <Label>Lights package</Label>
            <Select value={pkg} onChange={(e) => setPkg(e.target.value as LightsPackage)}>
              {PACKAGES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.value} — {formatCurrency(p.pricePerSqft)}/ft²
                </option>
              ))}
            </Select>
          </FieldGroup>
          <FieldGroup>
            <Label>Square footage</Label>
            <Input type="number" value={sqft} onChange={(e) => setSqft(Number(e.target.value))} />
            <FieldHelp>Roofline + tree wraps + façade</FieldHelp>
          </FieldGroup>
          <FieldGroup>
            <Label>Estimated total</Label>
            <div className={cn("h-11 px-4 rounded-md border-2 border-pine bg-pine-soft/40 flex items-center justify-between")}>
              <span className="text-xs text-ink-muted font-semibold uppercase tracking-wide">
                {formatCurrency(pricePerSqft)} × {sqft.toLocaleString()}
              </span>
              <span className="text-xl font-extrabold text-ink">{formatCurrency(subtotal)}</span>
            </div>
          </FieldGroup>
        </div>
        <div className="flex gap-2">
          <Button
            variant="primary"
            onClick={() => {
              toast({ message: "Quote drafted — public link is the next step.", tone: "info" });
              onDone();
            }}
          >
            <Sparkles size={14} /> Save & send (demo)
          </Button>
          <Button variant="outline" onClick={onDone}>
            Cancel
          </Button>
        </div>
        <p className="text-xs text-ink-muted mt-3">
          Demo prototype — uses the seeded quotes list. Full save flow is wired up but persists in memory only.
        </p>
      </CardContent>
    </Card>
  );
}
