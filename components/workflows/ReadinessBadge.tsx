import type { WorkflowReadinessTier } from "@/lib/workflowReadiness";

interface ReadinessBadgeProps {
  score: number;
  tier: WorkflowReadinessTier;
}

const tierClasses: Record<WorkflowReadinessTier, string> = {
  High: "border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  Medium:
    "border-amber-500 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  Low: "border-rose-500 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
};

export function ReadinessBadge({ score, tier }: ReadinessBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 border px-2 py-1 text-xs font-bold uppercase tracking-wide ${tierClasses[tier]}`}
      aria-label={`readiness score ${score}`}
      title={`Readiness score: ${score}`}
    >
      readiness {score}
    </span>
  );
}