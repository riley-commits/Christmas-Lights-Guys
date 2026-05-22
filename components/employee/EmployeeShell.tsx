"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, CalendarDays, Clock, MessageSquare, LogOut } from "lucide-react";
import { useAppState } from "@/lib/state";
import { getEmployee } from "@/lib/mock-data/employees";
import { Logo } from "@/components/ui/logo";
import { cn, initials } from "@/lib/utils";

const TABS = [
  { href: "/employee", label: "Today", icon: Home, match: (p: string) => p === "/employee" || p.startsWith("/employee/jobs") },
  { href: "/employee/calendar", label: "Calendar", icon: CalendarDays, match: (p: string) => p.startsWith("/employee/calendar") },
  { href: "/employee/time-clock", label: "Time Clock", icon: Clock, match: (p: string) => p.startsWith("/employee/time-clock") },
  { href: "/employee/messages", label: "Messages", icon: MessageSquare, match: (p: string) => p.startsWith("/employee/messages") },
];

export function EmployeeShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, activeEmployeeId, logout, messages } = useAppState();
  const me = activeEmployeeId ? getEmployee(activeEmployeeId) : null;

  React.useEffect(() => {
    if (role === null) return;
    if (role !== "employee" || !activeEmployeeId) {
      router.replace("/");
    }
  }, [role, activeEmployeeId, router]);

  const unreadCount = me
    ? messages.filter((m) => m.employeeId === me.id && !m.read).length
    : 0;

  const handleSwitch = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-line px-4 py-3 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2">
          {me && (
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-pine-soft text-pine-dark flex items-center justify-center text-xs font-bold">
                {me.initials ?? initials(me.name)}
              </div>
            </div>
          )}
          <button
            onClick={handleSwitch}
            aria-label="Switch role"
            className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-bg-subtle text-ink-muted"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="flex-1 pb-24">{children}</main>

      {/* Bottom tabs */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-white shadow-pop safe-bottom">
        <div className="grid grid-cols-4">
          {TABS.map((t) => {
            const active = t.match(pathname);
            const isMessages = t.href === "/employee/messages";
            return (
              <Link
                key={t.href}
                href={t.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 py-2.5 relative",
                  active ? "text-brand" : "text-ink-muted"
                )}
              >
                <div className="relative">
                  <t.icon size={22} />
                  {isMessages && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-semibold">{t.label}</span>
                {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-brand rounded-full" />}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
