import type { WorkflowFrontmatter } from "@/lib/types";
import type { WorkflowReadinessResult } from "@/lib/workflowReadiness";
import { ReadinessBadge } from "@/components/workflows/ReadinessBadge";
import { ReadinessBreakdown } from "@/components/workflows/ReadinessBreakdown";

interface ReadinessPanelProps {
  workflow: WorkflowFrontmatter;
  readiness: WorkflowReadinessResult;
}

const maintenanceDescription: Record<"Low" | "Medium" | "High", string> = {
  Low: "minimal upkeep expected",
  Medium: "regular updates likely",
  High: "frequent upkeep expected",
};

export function ReadinessPanel({ workflow, readiness }: ReadinessPanelProps) {
  const prerequisites = workflow.prerequisites ?? [];
  const failurePoints = workflow.failurePoints ?? [];

  return (
    <section className="mt-8 border border-gray-300 p-4 dark:border-gray-700">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">
          Workflow readiness
        </h2>
        <ReadinessBadge score={readiness.score} tier={readiness.tier} />
      </div>

      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Readiness estimates how quickly a team can execute this workflow with low setup overhead and fewer failure points.
      </p>

      <dl className="grid gap-3 text-sm md:grid-cols-2">
        <div className="border border-gray-200 p-3 dark:border-gray-800">
          <dt className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Estimated effort</dt>
          <dd className="mt-1 font-semibold">{Math.round(readiness.inputs.estimatedHours)} hour(s)</dd>
        </div>
        <div className="border border-gray-200 p-3 dark:border-gray-800">
          <dt className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Setup complexity</dt>
          <dd className="mt-1 font-semibold">{readiness.inputs.setupComplexity}/5</dd>
        </div>
        <div className="border border-gray-200 p-3 dark:border-gray-800">
          <dt className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Dependency risk</dt>
          <dd className="mt-1 font-semibold">{readiness.inputs.dependencyRisk}/5</dd>
        </div>
        <div className="border border-gray-200 p-3 dark:border-gray-800">
          <dt className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Observability</dt>
          <dd className="mt-1 font-semibold">{readiness.inputs.observability}/5</dd>
        </div>
        <div className="border border-gray-200 p-3 dark:border-gray-800 md:col-span-2">
          <dt className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Maintenance load</dt>
          <dd className="mt-1 font-semibold">
            {readiness.inputs.maintenanceLevel} ({maintenanceDescription[readiness.inputs.maintenanceLevel]})
          </dd>
        </div>
      </dl>

      <div className="mt-4">
        <ReadinessBreakdown readiness={readiness} />
      </div>

      {prerequisites.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Prerequisites</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-300">
            {prerequisites.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {failurePoints.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Likely failure points</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-300">
            {failurePoints.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}