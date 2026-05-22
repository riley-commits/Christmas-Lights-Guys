"use client";

import * as React from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Mail, MailOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAppState } from "@/lib/state";
import { getEmployee } from "@/lib/mock-data/employees";
import { cn } from "@/lib/utils";

export default function EmployeeMessagesPage() {
  const { activeEmployeeId, messages, markMessageRead } = useAppState();
  const me = activeEmployeeId ? getEmployee(activeEmployeeId) : null;
  const [openId, setOpenId] = React.useState<string | null>(null);

  if (!me) return null;

  const myMessages = messages
    .filter((m) => m.employeeId === me.id)
    .sort((a, b) => b.sentAt.localeCompare(a.sentAt));

  const openMessage = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
    markMessageRead(id);
  };

  return (
    <div className="px-4 pt-4 pb-2 space-y-4 max-w-2xl mx-auto">
      <div>
        <h1 className="text-display-md">Messages</h1>
        <p className="text-sm text-ink-muted mt-0.5">
          From the office to the field.
        </p>
      </div>

      <Card className="overflow-hidden">
        <ul className="divide-y divide-line">
          {myMessages.length === 0 && (
            <li className="p-8 text-center text-sm text-ink-muted">No messages yet.</li>
          )}
          {myMessages.map((m) => {
            const isOpen = openId === m.id;
            return (
              <li key={m.id}>
                <button
                  onClick={() => openMessage(m.id)}
                  className={cn(
                    "w-full flex gap-3 px-4 py-3.5 text-left transition active:bg-bg-subtle",
                    !m.read && "bg-brand-soft/20"
                  )}
                >
                  <div
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
                      m.read ? "bg-bg-subtle text-ink-muted" : "bg-brand text-white"
                    )}
                  >
                    {m.read ? <MailOpen size={16} /> : <Mail size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={cn("font-semibold text-sm truncate", !m.read && "text-ink")}>
                        {m.subject}
                      </p>
                      <p className="text-xs text-ink-subtle flex-shrink-0 whitespace-nowrap">
                        {formatDistanceToNow(parseISO(m.sentAt), { addSuffix: true })}
                      </p>
                    </div>
                    <p className="text-xs text-ink-muted">{m.from}</p>
                    <p
                      className={cn(
                        "text-sm mt-1 leading-snug",
                        isOpen ? "text-ink" : "text-ink-muted line-clamp-1"
                      )}
                    >
                      {m.body}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
