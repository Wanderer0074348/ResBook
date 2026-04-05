import type { DotfileFrontmatter, ToolFrontmatter, WorkflowFrontmatter } from "@/lib/types";
import { getWorkflowReadiness, type WorkflowReadinessTier } from "@/lib/workflowReadiness";

export type RecommendationFilter = "all" | "recommended" | "not-recommended";
export type ToolSortOption = "newest" | "oldest" | "title";
export type WorkflowSortOption = "newest" | "oldest" | "title" | "readiness";
export type WorkflowReadinessFilter = "All" | WorkflowReadinessTier;
export type DotfileSortOption = "newest" | "oldest" | "title";

export interface ToolFilterInput {
  searchTerm: string;
  category: "All" | ToolFrontmatter["category"];
  pricing: "All" | ToolFrontmatter["pricing"];
  recommendation: RecommendationFilter;
  sortBy: ToolSortOption;
}

export interface WorkflowFilterInput {
  searchTerm: string;
  complexity: "All" | WorkflowFrontmatter["complexity"];
  toolFilter: string;
  readiness: WorkflowReadinessFilter;
  sortBy: WorkflowSortOption;
}

export interface DotfileFilterInput {
  searchTerm: string;
  kind: "All" | DotfileFrontmatter["kind"];
  toolFilter: string;
  sortBy: DotfileSortOption;
}

function safeTimestamp(value: string): number {
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

export function filterAndSortTools(tools: ToolFrontmatter[], input: ToolFilterInput): ToolFrontmatter[] {
  const normalizedQuery = input.searchTerm.trim().toLowerCase();

  const filtered = tools.filter((tool) => {
    const matchesSearch =
      normalizedQuery.length === 0 ||
      tool.title.toLowerCase().includes(normalizedQuery) ||
      tool.description.toLowerCase().includes(normalizedQuery);

    const matchesCategory = input.category === "All" || tool.category === input.category;
    const matchesPricing = input.pricing === "All" || tool.pricing === input.pricing;

    const matchesRecommendation =
      input.recommendation === "all" ||
      (input.recommendation === "recommended" && tool.worthIt) ||
      (input.recommendation === "not-recommended" && !tool.worthIt);

    return matchesSearch && matchesCategory && matchesPricing && matchesRecommendation;
  });

  return [...filtered].sort((a, b) => {
    if (input.sortBy === "title") {
      return a.title.localeCompare(b.title);
    }

    const aTime = safeTimestamp(a.dateAdded);
    const bTime = safeTimestamp(b.dateAdded);

    if (input.sortBy === "oldest") {
      return aTime - bTime;
    }

    return bTime - aTime;
  });
}

function getAvailableToolValues(items: Array<{ toolsUsed: string[] }>): string[] {
  const values = new Set<string>();

  for (const item of items) {
    for (const tool of item.toolsUsed) {
      values.add(tool);
    }
  }

  return Array.from(values).sort((a, b) => a.localeCompare(b));
}

export function getAvailableWorkflowTools(workflows: WorkflowFrontmatter[]): string[] {
  return getAvailableToolValues(workflows);
}

export function getAvailableDotfileTools(dotfiles: DotfileFrontmatter[]): string[] {
  return getAvailableToolValues(dotfiles);
}

export function filterAndSortWorkflows(
  workflows: WorkflowFrontmatter[],
  input: WorkflowFilterInput
): WorkflowFrontmatter[] {
  const normalizedQuery = input.searchTerm.trim().toLowerCase();

  const filtered = workflows
    .map((workflow) => ({
      workflow,
      readiness: getWorkflowReadiness(workflow),
    }))
    .filter(({ workflow, readiness }) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        workflow.title.toLowerCase().includes(normalizedQuery) ||
        workflow.description.toLowerCase().includes(normalizedQuery) ||
        workflow.author.toLowerCase().includes(normalizedQuery);

      const matchesComplexity = input.complexity === "All" || workflow.complexity === input.complexity;
      const matchesTool = input.toolFilter === "All" || workflow.toolsUsed.includes(input.toolFilter);
      const matchesReadiness = input.readiness === "All" || readiness.tier === input.readiness;

      return matchesSearch && matchesComplexity && matchesTool && matchesReadiness;
    });

  return [...filtered]
    .sort((a, b) => {
      if (input.sortBy === "readiness") {
        if (a.readiness.score !== b.readiness.score) {
          return b.readiness.score - a.readiness.score;
        }

        return safeTimestamp(b.workflow.dateAdded) - safeTimestamp(a.workflow.dateAdded);
      }

      if (input.sortBy === "title") {
        return a.workflow.title.localeCompare(b.workflow.title);
      }

      const aTime = safeTimestamp(a.workflow.dateAdded);
      const bTime = safeTimestamp(b.workflow.dateAdded);

      if (input.sortBy === "oldest") {
        return aTime - bTime;
      }

      return bTime - aTime;
    })
    .map(({ workflow }) => workflow);
}

export function filterAndSortDotfiles(
  dotfiles: DotfileFrontmatter[],
  input: DotfileFilterInput
): DotfileFrontmatter[] {
  const normalizedQuery = input.searchTerm.trim().toLowerCase();

  const filtered = dotfiles.filter((dotfile) => {
    const matchesSearch =
      normalizedQuery.length === 0 ||
      dotfile.title.toLowerCase().includes(normalizedQuery) ||
      dotfile.description.toLowerCase().includes(normalizedQuery) ||
      dotfile.author.toLowerCase().includes(normalizedQuery);

    const matchesKind = input.kind === "All" || dotfile.kind === input.kind;
    const matchesTool = input.toolFilter === "All" || dotfile.toolsUsed.includes(input.toolFilter);

    return matchesSearch && matchesKind && matchesTool;
  });

  return [...filtered].sort((a, b) => {
    if (input.sortBy === "title") {
      return a.title.localeCompare(b.title);
    }

    const aTime = safeTimestamp(a.dateAdded);
    const bTime = safeTimestamp(b.dateAdded);

    if (input.sortBy === "oldest") {
      return aTime - bTime;
    }

    return bTime - aTime;
  });
}
