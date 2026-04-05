import type { ToolFrontmatter, WorkflowFrontmatter } from "@/lib/types";

export type RecommendationFilter = "all" | "recommended" | "not-recommended";
export type ToolSortOption = "newest" | "oldest" | "title";
export type WorkflowSortOption = "newest" | "oldest" | "title";

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
  sortBy: WorkflowSortOption;
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

export function getAvailableWorkflowTools(workflows: WorkflowFrontmatter[]): string[] {
  const values = new Set<string>();

  for (const workflow of workflows) {
    for (const tool of workflow.toolsUsed) {
      values.add(tool);
    }
  }

  return Array.from(values).sort((a, b) => a.localeCompare(b));
}

export function filterAndSortWorkflows(
  workflows: WorkflowFrontmatter[],
  input: WorkflowFilterInput
): WorkflowFrontmatter[] {
  const normalizedQuery = input.searchTerm.trim().toLowerCase();

  const filtered = workflows.filter((workflow) => {
    const matchesSearch =
      normalizedQuery.length === 0 ||
      workflow.title.toLowerCase().includes(normalizedQuery) ||
      workflow.description.toLowerCase().includes(normalizedQuery) ||
      workflow.author.toLowerCase().includes(normalizedQuery);

    const matchesComplexity = input.complexity === "All" || workflow.complexity === input.complexity;
    const matchesTool = input.toolFilter === "All" || workflow.toolsUsed.includes(input.toolFilter);

    return matchesSearch && matchesComplexity && matchesTool;
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
