import { describe, expect, it } from "bun:test";
import {
  filterAndSortTools,
  filterAndSortWorkflows,
  getAvailableWorkflowTools,
} from "@/lib/listingFilters";
import type { ToolFrontmatter, WorkflowFrontmatter } from "@/lib/types";

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
  },
  {
    title: "Research Loop",
    slug: "research-loop",
    description: "Collect and summarize",
    author: "Analyst",
    complexity: "Beginner",
    toolsUsed: ["gamma-llm"],
    dateAdded: "2026-04-01",
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
      sortBy: "newest",
    });

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("research-loop");
  });
});
