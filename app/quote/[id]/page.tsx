"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { format, parseISO } from "date-fns";
import { CheckCircle2, Snowflake, Phone, Mail } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppState } from "@/lib/state";
import { getCustomer } from "@/lib/mock-data/customers";
import { formatCurrency } from "@/lib/utils";

const PACKAGE_INCLUDES: Record<string, string[]> = {
  "Classic Warm White": [
    "Premium LED warm-white strands",
    "Custom-cut to fit roofline",
    "Pro-grade clips (no nails)",
    "Pre-season install + post-season takedown",
    "Mid-season touch-up call included",
  ],
  "Multicolor Pro": [
    "Premium LED multicolor strands",
    "Custom roofline + tree wrap configuration",
    "Pro-grade clips (no nails)",
    "Pre-season install + post-season takedown",
    "Mid-season touch-up call included",
  ],
  "C9 Premium": [
    "Heavy-duty C9 strands (large bulbs)",
    "Custom roofline + façade lighting",
    "Pro-grade clips (no nails)",
    "Pre-season install + post-season takedown",
    "Bulb replacement during the season",
  ],
  Custom: ["Custom package — see notes below"],
};

export default function PublicQuotePage() {
  const { id } = useParams<{ id: string }>();
  const { quotes, acceptQuote } = useAppState();
  const q = quotes.find((x) => x.id === id);
  const customer = q ? getCustomer(q.customerId) : null;
  const [accepted, setAccepted] = React.useState(false);

  if (!q || !customer) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <p className="text-ink-muted">This quote link is invalid or has been removed.</p>
      </main>
    );
  }

  const isAccepted = accepted || q.status === "accepted";

  return (
    <main className="min-h-screen bg-bg pb-12">
      <header className="bg-white border-b border-line px-5 py-4 flex items-center justify-between">
        <Image src="/logo.webp" alt="The Christmas Light Guys" width={150} height={62} priority />
        <div className="hidden sm:flex items-center gap-3 text-xs">
          <a href="tel:204-555-0100" className="flex items-center gap-1 text-ink-muted hover:text-ink">
            <Phone size={12} /> 204-555-0100
          </a>
          <a href="mailto:hello@christmaslightsguys.ca" className="flex items-center gap-1 text-ink-muted hover:text-ink">
            <Mail size={12} /> hello@christmaslightsguys.ca
          </a>
        </div>
      </header>

      <section className="max-w-2xl mx-auto px-5 pt-8">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.18em] text-pine font-bold mb-2">
            Your Christmas lights quote
          </p>
          <h1 className="text-display-lg text-ink text-balance">Hey {customer.name.split(" ")[0]} — let&apos;s light it up.</h1>
          <p className="mt-3 text-base text-ink-muted">
            Here&apos;s what we put together for {customer.address.street}.
          </p>
        </div>

        {isAccepted && (
          <Card className="mb-6 border-pine bg-pine-soft animate-fade-in">
            <CardContent className="p-5 flex items-center gap-3">
              <CheckCircle2 size={28} className="text-pine flex-shrink-0" />
              <div>
                <p className="font-extrabold text-ink">Quote accepted!</p>
                <p className="text-sm text-ink-muted mt-0.5">
                  We&apos;ll reach out to confirm a date and lock in your spot on the schedule.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-5">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-3 mb-5">
              <div>
                <Badge tone="brand">{q.packageType}</Badge>
                <p className="text-sm text-ink-muted mt-3">Quote #{q.id.toUpperCase()}</p>
                <p className="text-sm text-ink-muted">
                  Issued {format(parseISO(q.createdAt), "MMMM d, yyyy")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-ink-muted font-bold">Total</p>
                <p className="text-4xl font-extrabold text-ink leading-tight">
                  {formatCurrency(q.subtotal)}
                </p>
                <p className="text-xs text-ink-muted">
                  {q.sqft.toLocaleString()} sq ft &middot; {formatCurrency(q.pricePerSqft)}/ft²
                </p>
              </div>
            </div>

            <div className="border-t border-line pt-5">
              <p className="text-xs uppercase tracking-wide text-ink-muted font-bold mb-3">
                What&apos;s included
              </p>
              <ul className="space-y-2">
                {(PACKAGE_INCLUDES[q.packageType] ?? []).map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink">
                    <CheckCircle2 size={16} className="text-pine flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {q.notes && (
              <div className="mt-5 pt-5 border-t border-line">
                <p className="text-xs uppercase tracking-wide text-ink-muted font-bold mb-2">
                  Notes
                </p>
                <p className="text-sm text-ink leading-relaxed">{q.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {!isAccepted && (
          <Button
            variant="primary"
            size="xl"
            className="w-full text-lg"
            onClick={() => {
              acceptQuote(q.id);
              setAccepted(true);
            }}
          >
            <Snowflake size={20} /> Accept this quote
          </Button>
        )}

        <p className="text-center text-xs text-ink-subtle mt-5">
          Valid for 30 days. Questions? Reply to the email we sent.
        </p>
      </section>
    </main>
  );
}
