import * as React from "react";
import { cn } from "@/lib/utils";

export function Empty({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-dashed border-line-strong bg-bg-subtle/40 px-6 py-10 text-center", className)}>
      {icon && <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-white border border-line flex items-center justify-center text-ink-muted">{icon}</div>}
      <p className="font-semibold text-ink">{title}</p>
      {description && <p className="text-sm text-ink-muted mt-1 max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
