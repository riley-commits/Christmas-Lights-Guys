"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ClipboardList, CalendarDays, FileSignature, Clock4, LogOut, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/lib/state";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, match: (p: string) => p === "/admin" },
  { href: "/admin/projects", label: "Projects", icon: ClipboardList, match: (p: string) => p.startsWith("/admin/projects") },
  { href: "/admin/schedule", label: "Schedule", icon: CalendarDays, match: (p: string) => p.startsWith("/admin/schedule") },
  { href: "/admin/quotes", label: "Quotes", icon: FileSignature, match: (p: string) => p.startsWith("/admin/quotes") },
  { href: "/admin/timesheets", label: "Timesheets", icon: Clock4, match: (p: string) => p.startsWith("/admin/timesheets") },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, logout } = useAppState();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (role !== null && role !== "admin") {
      router.replace("/");
    }
  }, [role, router]);

  const handleSwitch = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-bg">
      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-line px-4 py-3 flex items-center justify-between">
        <Logo />
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Open menu"
          className="w-11 h-11 -mr-2 flex items-center justify-center rounded-md hover:bg-bg-subtle"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-b border-line bg-white px-3 py-3 animate-fade-in">
          <nav className="flex flex-col gap-1">
            {NAV.map((n) => {
              const Active = n.match(pathname);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-[15px] font-medium",
                    Active ? "bg-brand-soft text-brand-dark" : "text-ink hover:bg-bg-subtle"
                  )}
                >
                  <n.icon size={18} /> {n.label}
                </Link>
              );
            })}
            <button
              onClick={handleSwitch}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[15px] font-medium text-ink-muted hover:bg-bg-subtle mt-1"
            >
              <LogOut size={18} /> Switch role
            </button>
          </nav>
        </div>
      )}

      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-line bg-white px-4 py-5 sticky top-0 h-screen">
        <div className="px-1 mb-7">
          <Logo />
        </div>
        <nav className="flex-1 flex flex-col gap-0.5">
          {NAV.map((n) => {
            const Active = n.match(pathname);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-[14.5px] font-medium",
                  Active ? "bg-brand-soft text-brand-dark" : "text-ink hover:bg-bg-subtle"
                )}
              >
                <n.icon size={18} /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="pt-4 border-t border-line">
          <Button variant="ghost" size="sm" onClick={handleSwitch} className="w-full justify-start">
            <LogOut size={16} /> Switch role
          </Button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
