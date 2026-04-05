/// <reference types="bun-types" />

import { describe, expect, it } from "bun:test";
import {
  filterAndSortDotfiles,
  filterAndSortTools,
  filterAndSortWorkflows,
  getAvailableDotfileTools,
  getAvailableWorkflowTools,
} from "@/lib/listingFilters";
import type { DotfileFrontmatter, ToolFrontmatter, WorkflowFrontmatter } from "@/lib/types";

const tools: ToolFrontmatter[] = [
  {
    title: "Alpha CLI",
    slug: "alpha-cli",
    description: "CLI helper",
    category: "CLI",
    pricing: "Free",
    worthIt: true,
    dateAdded: "2026-04-01",
  },
  {
    title: "Beta IDE",
    slug: "beta-ide",
    description: "Editor addon",
    category: "IDE",
    pricing: "Paid",
    worthIt: false,
    dateAdded: "2026-04-03",
  },
  {
    title: "Gamma LLM",
    slug: "gamma-llm",
    description: "Research assistant",
    category: "LLM",
    pricing: "Freemium",
    worthIt: true,
    dateAdded: "2026-04-02",
  },
];

const workflows: WorkflowFrontmatter[] = [
  {
    title: "Launch Sprint",
    slug: "launch-sprint",
    description: "Ship fast",
    author: "Team",
    complexity: "Intermediate",
    toolsUsed: ["alpha-cli", "beta-ide"],
    dateAdded: "2026-04-03",
    estimatedHours: 8,
    setupComplexity: 3,
    dependencyRisk: 4,
    observability: 3,
    maintenanceLevel: "Medium",
    failurePoints: ["env mismatch", "test flakiness"],
  },
  {
    title: "Research Loop",
    slug: "research-loop",
    description: "Collect and summarize",
    author: "Analyst",
    complexity: "Beginner",
    toolsUsed: ["gamma-llm"],
    dateAdded: "2026-04-01",
    estimatedHours: 3,
    setupComplexity: 2,
    dependencyRisk: 1,
    observability: 4,
    maintenanceLevel: "Low",
  },
];

const dotfiles: DotfileFrontmatter[] = [
  {
    title: "Claude Code Prompt Pack",
    slug: "claude-code-prompt-pack",
    description: "Reusable prompting set for iterative builds",
    author: "Manav",
    kind: "Prompt Pack",
    toolsUsed: ["claude-code", "cursor"],
    dateAdded: "2026-04-05",
  },
  {
    title: "Next.js AI Starter",
    slug: "nextjs-ai-starter",
    description: "Template structure for shipping AI web apps",
    author: "Tanay",
    kind: "Template",
    toolsUsed: ["github-copilot", "cursor"],
    dateAdded: "2026-04-04",
  },
  {
    title: "Terminal Agent Config",
    slug: "terminal-agent-config",
    description: "Shell aliases and guardrails for coding agents",
    author: "Team",
    kind: "Config",
    toolsUsed: ["claude-code"],
    dateAdded: "2026-04-03",
  },
];

describe("filterAndSortTools", () => {
  it("filters by recommendation and category", () => {
    const result = filterAndSortTools(tools, {
      searchTerm: "",
      category: "CLI",
      pricing: "All",
      recommendation: "recommended",
      sortBy: "newest",
    });

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("alpha-cli");
  });

  it("sorts by title", () => {
    const result = filterAndSortTools(tools, {
      searchTerm: "",
      category: "All",
      pricing: "All",
      recommendation: "all",
      sortBy: "title",
    });

    expect(result.map((item) => item.title)).toEqual(["Alpha CLI", "Beta IDE", "Gamma LLM"]);
  });
});

describe("workflow listing filters", () => {
  it("returns unique available tools in sorted order", () => {
    const result = getAvailableWorkflowTools(workflows);

    expect(result).toEqual(["alpha-cli", "beta-ide", "gamma-llm"]);
  });

  it("filters by selected tool", () => {
    const result = filterAndSortWorkflows(workflows, {
      searchTerm: "",
      complexity: "All",
      toolFilter: "gamma-llm",
      readiness: "All",
      sortBy: "newest",
    });

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("research-loop");
  });

  it("supports search by author", () => {
    const result = filterAndSortWorkflows(workflows, {
      searchTerm: "analyst",
      complexity: "All",
      toolFilter: "All",
      readiness: "All",
      sortBy: "newest",
    });

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("research-loop");
  });

  it("filters by readiness tier", () => {
    const result = filterAndSortWorkflows(workflows, {
      searchTerm: "",
      complexity: "All",
      toolFilter: "All",
      readiness: "High",
      sortBy: "newest",
    });

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("research-loop");
  });

  it("sorts by readiness score", () => {
    const result = filterAndSortWorkflows(workflows, {
      searchTerm: "",
      complexity: "All",
      toolFilter: "All",
      readiness: "All",
      sortBy: "readiness",
    });

    expect(result.map((item) => item.slug)).toEqual(["research-loop", "launch-sprint"]);
  });
});

describe("dotfile listing filters", () => {
  it("returns unique available tools in sorted order", () => {
    const result = getAvailableDotfileTools(dotfiles);

    expect(result).toEqual(["claude-code", "cursor", "github-copilot"]);
  });

  it("filters by kind and tool", () => {
    const result = filterAndSortDotfiles(dotfiles, {
      searchTerm: "",
      kind: "Prompt Pack",
      toolFilter: "claude-code",
      sortBy: "newest",
    });

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("claude-code-prompt-pack");
  });

  it("supports search by author", () => {
    const result = filterAndSortDotfiles(dotfiles, {
      searchTerm: "tanay",
      kind: "All",
      toolFilter: "All",
      sortBy: "newest",
    });

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("nextjs-ai-starter");
  });
});
