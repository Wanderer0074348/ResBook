import type {
  WorkflowComplexity,
  WorkflowFrontmatter,
  WorkflowMaintenanceLevel,
} from "@/lib/types";

export type WorkflowReadinessTier = "High" | "Medium" | "Low";

export interface WorkflowReadinessInputs {
  setupComplexity: 1 | 2 | 3 | 4 | 5;
  dependencyRisk: 1 | 2 | 3 | 4 | 5;
  observability: 1 | 2 | 3 | 4 | 5;
  maintenanceLevel: WorkflowMaintenanceLevel;
  estimatedHours: number;
  prerequisiteCount: number;
  failurePointCount: number;
}

export interface WorkflowReadinessResult {
  score: number;
  tier: WorkflowReadinessTier;
  inputs: WorkflowReadinessInputs;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function resolveSetupComplexity(complexity: WorkflowComplexity): 1 | 2 | 3 | 4 | 5 {
  if (complexity === "Beginner") return 2;
  if (complexity === "Intermediate") return 3;
  return 4;
}

function resolveDependencyRisk(workflow: WorkflowFrontmatter): 1 | 2 | 3 | 4 | 5 {
  const toolCount = workflow.toolsUsed.length;
  let score = toolCount <= 1 ? 2 : toolCount <= 3 ? 3 : 4;

  if (workflow.complexity === "Advanced") score += 1;
  if (workflow.complexity === "Beginner") score -= 1;

  return clamp(score, 1, 5) as 1 | 2 | 3 | 4 | 5;
}

function resolveObservability(complexity: WorkflowComplexity): 1 | 2 | 3 | 4 | 5 {
  if (complexity === "Beginner") return 4;
  if (complexity === "Intermediate") return 3;
  return 2;
}

function resolveMaintenanceLevel(complexity: WorkflowComplexity): WorkflowMaintenanceLevel {
  if (complexity === "Beginner") return "Low";
  if (complexity === "Intermediate") return "Medium";
  return "High";
}

function resolveEstimatedHours(complexity: WorkflowComplexity): number {
  if (complexity === "Beginner") return 3;
  if (complexity === "Intermediate") return 6;
  return 12;
}

function toScaleValue(value: unknown, fallback: 1 | 2 | 3 | 4 | 5): 1 | 2 | 3 | 4 | 5 {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }

  return clamp(Math.round(value), 1, 5) as 1 | 2 | 3 | 4 | 5;
}

function toPositiveNumber(value: unknown, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return fallback;
  }

  return value;
}

export function getWorkflowReadiness(workflow: WorkflowFrontmatter): WorkflowReadinessResult {
  const inputs: WorkflowReadinessInputs = {
    setupComplexity: toScaleValue(
      workflow.setupComplexity,
      resolveSetupComplexity(workflow.complexity)
    ),
    dependencyRisk: toScaleValue(
      workflow.dependencyRisk,
      resolveDependencyRisk(workflow)
    ),
    observability: toScaleValue(
      workflow.observability,
      resolveObservability(workflow.complexity)
    ),
    maintenanceLevel:
      workflow.maintenanceLevel ?? resolveMaintenanceLevel(workflow.complexity),
    estimatedHours: toPositiveNumber(
      workflow.estimatedHours,
      resolveEstimatedHours(workflow.complexity)
    ),
    prerequisiteCount: Array.isArray(workflow.prerequisites)
      ? workflow.prerequisites.length
      : 0,
    failurePointCount: Array.isArray(workflow.failurePoints)
      ? workflow.failurePoints.length
      : 0,
  };

  const maintenancePenalty =
    inputs.maintenanceLevel === "Low" ? 0 : inputs.maintenanceLevel === "Medium" ? 8 : 16;

  const setupPenalty = (inputs.setupComplexity - 1) * 8;
  const dependencyPenalty = (inputs.dependencyRisk - 1) * 9;
  const observabilityBonus = (inputs.observability - 1) * 5;
  const hourPenalty = Math.min(18, Math.max(0, (inputs.estimatedHours - 2) * 1.2));
  const prerequisitePenalty = Math.min(10, inputs.prerequisiteCount * 2);
  const failurePenalty = Math.min(14, inputs.failurePointCount * 2.8);

  const rawScore =
    100 -
    setupPenalty -
    dependencyPenalty -
    maintenancePenalty -
    hourPenalty -
    prerequisitePenalty -
    failurePenalty +
    observabilityBonus;

  const score = clamp(Math.round(rawScore), 0, 100);
  const tier: WorkflowReadinessTier = score >= 75 ? "High" : score >= 50 ? "Medium" : "Low";

  return {
    score,
    tier,
    inputs,
  };
}