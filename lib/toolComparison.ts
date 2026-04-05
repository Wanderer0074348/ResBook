import type { ToolFrontmatter } from "@/lib/types";

interface ToolComparisonDefaults {
  easeOfUse: 1 | 2 | 3 | 4 | 5;
  outputQuality: 1 | 2 | 3 | 4 | 5;
  speed: 1 | 2 | 3 | 4 | 5;
  automationDepth: 1 | 2 | 3 | 4 | 5;
  collaboration: 1 | 2 | 3 | 4 | 5;
}

const categoryDefaults: Record<ToolFrontmatter["category"], ToolComparisonDefaults> = {
  LLM: {
    easeOfUse: 4,
    outputQuality: 4,
    speed: 3,
    automationDepth: 2,
    collaboration: 3,
  },
  Agent: {
    easeOfUse: 3,
    outputQuality: 4,
    speed: 3,
    automationDepth: 5,
    collaboration: 3,
  },
  IDE: {
    easeOfUse: 4,
    outputQuality: 4,
    speed: 4,
    automationDepth: 3,
    collaboration: 4,
  },
  CLI: {
    easeOfUse: 3,
    outputQuality: 3,
    speed: 5,
    automationDepth: 4,
    collaboration: 2,
  },
};

const pricingScore: Record<ToolFrontmatter["pricing"], 1 | 2 | 3 | 4 | 5> = {
  Free: 5,
  Freemium: 4,
  Paid: 2,
};

function clampScale(value: number): 1 | 2 | 3 | 4 | 5 {
  return Math.min(5, Math.max(1, Math.round(value))) as 1 | 2 | 3 | 4 | 5;
}

function toScale(value: unknown, fallback: 1 | 2 | 3 | 4 | 5): 1 | 2 | 3 | 4 | 5 {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }

  return clampScale(value);
}

function toStringList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean);
}

export interface ToolComparisonMetrics {
  easeOfUse: 1 | 2 | 3 | 4 | 5;
  outputQuality: 1 | 2 | 3 | 4 | 5;
  speed: 1 | 2 | 3 | 4 | 5;
  automationDepth: 1 | 2 | 3 | 4 | 5;
  collaboration: 1 | 2 | 3 | 4 | 5;
  priceValue: 1 | 2 | 3 | 4 | 5;
}

export interface ToolComparisonProfile {
  tool: ToolFrontmatter;
  metrics: ToolComparisonMetrics;
  overallScore: number;
  bestFor: string[];
  integrations: string[];
  startingPriceUsdMonthly: number | null;
}

function getWeightedAverage(metrics: ToolComparisonMetrics): number {
  return (
    metrics.easeOfUse * 0.2 +
    metrics.outputQuality * 0.25 +
    metrics.speed * 0.15 +
    metrics.automationDepth * 0.2 +
    metrics.collaboration * 0.1 +
    metrics.priceValue * 0.1
  );
}

export function getToolComparisonProfile(tool: ToolFrontmatter): ToolComparisonProfile {
  const defaults = categoryDefaults[tool.category];

  const worthItBoost = tool.worthIt ? 0.5 : 0;

  const metrics: ToolComparisonMetrics = {
    easeOfUse: toScale(tool.easeOfUse, defaults.easeOfUse),
    outputQuality: toScale(tool.outputQuality, clampScale(defaults.outputQuality + worthItBoost)),
    speed: toScale(tool.speed, defaults.speed),
    automationDepth: toScale(tool.automationDepth, defaults.automationDepth),
    collaboration: toScale(tool.collaboration, defaults.collaboration),
    priceValue: pricingScore[tool.pricing],
  };

  const weightedAverage = getWeightedAverage(metrics);
  const overallScore = Math.round(weightedAverage * 20);

  return {
    tool,
    metrics,
    overallScore,
    bestFor: toStringList(tool.bestFor),
    integrations: toStringList(tool.integrations),
    startingPriceUsdMonthly:
      typeof tool.startingPriceUsdMonthly === "number" && Number.isFinite(tool.startingPriceUsdMonthly)
        ? tool.startingPriceUsdMonthly
        : null,
  };
}

export function rankToolsForComparison(tools: ToolFrontmatter[]): ToolComparisonProfile[] {
  return tools
    .map((tool) => getToolComparisonProfile(tool))
    .sort((a, b) => {
      if (b.overallScore !== a.overallScore) {
        return b.overallScore - a.overallScore;
      }

      return a.tool.title.localeCompare(b.tool.title);
    });
}
