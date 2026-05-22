"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { ShieldCheck, HardHat, Snowflake, ArrowRight, ChevronLeft, MapPin } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useAppState } from "@/lib/state";
import { initials } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Step = "role" | "employee";

export default function LandingPage() {
  const router = useRouter();
  const { setRole, setActiveEmployeeId, employees } = useAppState();
  const [step, setStep] = React.useState<Step>("role");

  const goAdmin = () => {
    setRole("admin");
    setActiveEmployeeId(null);
    router.push("/admin");
  };

  const goEmployee = (id: string) => {
    setRole("employee");
    setActiveEmployeeId(id);
    router.push("/employee");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-bg to-bg-subtle">
      <header className="px-5 py-5 flex items-center justify-between max-w-3xl mx-auto">
        <Logo />
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-pine font-semibold">
          <Snowflake size={14} /> Winnipeg, MB
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-5 pt-6 sm:pt-10 pb-16">
        {step === "role" && (
          <div className="animate-fade-in">
            <div className="text-center mb-8 sm:mb-10">
              <p className="text-xs uppercase tracking-[0.18em] text-pine font-semibold mb-3">
                Field Operations Platform
              </p>
              <h1 className="text-display-lg sm:text-display-xl text-ink text-balance">
                Run every install like the boss watches every shingle.
              </h1>
              <p className="mt-3 text-base text-ink-muted max-w-md mx-auto">
                Schedule crews, route trucks, log hours — built for Christmas lights companies that take pride in the work.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <RoleCard
                title="Enter as Admin"
                description="Run the office: projects, crews, schedule, quotes."
                icon={<ShieldCheck size={22} />}
                accent="brand"
                onClick={goAdmin}
              />
              <RoleCard
                title="Enter as Employee"
                description="Today's route, jobs, time clock, messages."
                icon={<HardHat size={22} />}
                accent="pine"
                onClick={() => setStep("employee")}
              />
            </div>

            <p className="mt-8 text-center text-xs text-ink-subtle">
              Prototype • No login • Data resets on hard refresh
            </p>
          </div>
        )}

        {step === "employee" && (
          <div className="animate-fade-in">
            <button
              onClick={() => setStep("role")}
              className="inline-flex items-center text-sm font-medium text-ink-muted hover:text-ink gap-1 mb-5"
            >
              <ChevronLeft size={16} /> Back
            </button>
            <h2 className="text-display-md text-ink mb-1">Who&apos;s clocking in?</h2>
            <p className="text-sm text-ink-muted mb-6">Pick your name from the crew.</p>

            <div className="space-y-2">
              {employees.map((e) => (
                <button
                  key={e.id}
                  onClick={() => goEmployee(e.id)}
                  className="w-full flex items-center gap-3 rounded-lg border border-line bg-white p-4 hover:border-pine hover:shadow-card transition text-left"
                >
                  <div className="w-11 h-11 rounded-full bg-pine-soft text-pine-dark flex items-center justify-center font-bold text-sm">
                    {e.initials ?? initials(e.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink truncate">{e.name}</p>
                    <p className="text-xs text-ink-muted capitalize flex items-center gap-1 mt-0.5">
                      <span className="capitalize">{e.role}</span>
                      <span className="text-ink-subtle">·</span>
                      <MapPin size={11} className="text-ink-subtle" />
                      <span className="truncate">{shortLocation(e.startLocation.address)}</span>
                    </p>
                  </div>
                  <ArrowRight size={18} className="text-ink-subtle flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function shortLocation(addr: string): string {
  const paren = addr.match(/\(([^)]+)\)/);
  if (paren) return paren[1];
  const parts = addr.split(",");
  return parts.length > 1 ? parts[1].trim() : addr;
}

function RoleCard({
  title,
  description,
  icon,
  accent,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  accent: "brand" | "pine";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-white p-5 sm:p-6 text-left shadow-card hover:shadow-pop transition-all",
        accent === "brand" ? "border-brand/15 hover:border-brand/40" : "border-pine/15 hover:border-pine/40"
      )}
    >
      <div
        className={cn(
          "w-11 h-11 rounded-lg flex items-center justify-center mb-4 text-white",
          accent === "brand" ? "bg-brand" : "bg-pine"
        )}
      >
        {icon}
      </div>
      <h3 className="font-display font-extrabold text-lg text-ink mb-1">{title}</h3>
      <p className="text-sm text-ink-muted leading-snug">{description}</p>
      <div
        className={cn(
          "mt-4 flex items-center gap-1.5 text-sm font-semibold",
          accent === "brand" ? "text-brand" : "text-pine"
        )}
      >
        Continue <ArrowRight size={14} className="group-hover:translate-x-0.5 transition" />
      </div>
    </button>
  );
}
