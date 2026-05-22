import { Badge } from "@/components/ui/badge";
import type { ProjectStatus } from "@/lib/types";

const META: Record<ProjectStatus, { label: string; tone: "neutral" | "pine" | "amber" | "brand" | "ink" }> = {
  needs_assignment: { label: "Needs crew", tone: "amber" },
  scheduled: { label: "Scheduled", tone: "neutral" },
  in_progress: { label: "In progress", tone: "brand" },
  completed: { label: "Complete", tone: "pine" },
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const m = META[status];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}
