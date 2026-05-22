import { Badge } from "@/components/ui/badge";
import type { ServiceType } from "@/lib/types";

const META: Record<ServiceType, { label: string; tone: "brand" | "pine" | "amber" }> = {
  install: { label: "Install", tone: "brand" },
  takedown: { label: "Takedown", tone: "pine" },
  repair: { label: "Repair", tone: "amber" },
};

export function ServiceTypeBadge({ type }: { type: ServiceType }) {
  const m = META[type];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}
