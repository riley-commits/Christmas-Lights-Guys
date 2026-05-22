import * as React from "react";
import { cn } from "@/lib/utils";

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("text-sm font-medium text-ink mb-1.5 block", className)}
      {...props}
    />
  )
);
Label.displayName = "Label";

export function FieldGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("space-y-1.5", className)}>{children}</div>;
}

export function FieldHelp({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-xs text-ink-muted mt-1", className)}>{children}</p>;
}
