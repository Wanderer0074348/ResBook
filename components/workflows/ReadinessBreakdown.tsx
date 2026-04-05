import type { WorkflowReadinessResult } from "@/lib/workflowReadiness";

interface ReadinessBreakdownProps {
  readiness: WorkflowReadinessResult;
}

interface MetricConfig {
  label: string;
  rawLabel: string;
  value: number;
  max: number;
  lowerIsBetter: boolean;
}

const maintenanceToScale: Record<"Low" | "Medium" | "High", number> = {
  Low: 1,
  Medium: 3,
  High: 5,
};

function toneClass(value: number, max: number, lowerIsBetter: boolean): string {
  const normalized = value / max;

  if (lowerIsBetter) {
    if (normalized <= 0.4) return "bg-emerald-500";
    if (normalized <= 0.65) return "bg-amber-500";
    return "bg-rose-500";
  }

  if (normalized >= 0.75) return "bg-emerald-500";
  if (normalized >= 0.5) return "bg-amber-500";
  return "bg-rose-500";
}

export function ReadinessBreakdown({ readiness }: ReadinessBreakdownProps) {
  const metrics: MetricConfig[] = [
    {
      label: "Setup Complexity",
      rawLabel: `${readiness.inputs.setupComplexity}/5`,
      value: readiness.inputs.setupComplexity,
      max: 5,
      lowerIsBetter: true,
    },
    {
      label: "Dependency Risk",
      rawLabel: `${readiness.inputs.dependencyRisk}/5`,
      value: readiness.inputs.dependencyRisk,
      max: 5,
      lowerIsBetter: true,
    },
    {
      label: "Observability",
      rawLabel: `${readiness.inputs.observability}/5`,
      value: readiness.inputs.observability,
      max: 5,
      lowerIsBetter: false,
    },
    {
      label: "Maintenance Load",
      rawLabel: readiness.inputs.maintenanceLevel,
      value: maintenanceToScale[readiness.inputs.maintenanceLevel],
      max: 5,
      lowerIsBetter: true,
    },
  ];

  return (
    <section className="border border-gray-200 p-4 dark:border-gray-800">
      <p className="mb-3 text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
        Readiness breakdown
      </p>
      <div className="space-y-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="grid grid-cols-[minmax(0,120px)_1fr_auto] items-center gap-3">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">{metric.label}</p>
            <div className="h-2 overflow-hidden rounded bg-gray-200 dark:bg-gray-800">
              <div
                className={`h-full ${toneClass(metric.value, metric.max, metric.lowerIsBetter)}`}
                style={{ width: `${Math.max(8, Math.round((metric.value / metric.max) * 100))}%` }}
              />
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">{metric.rawLabel}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        Lower is better for setup, risk, and maintenance. Higher is better for observability.
      </p>
    </section>
  );
}