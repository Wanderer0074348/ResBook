/// <reference types="bun-types" />

import { describe, expect, it } from "bun:test";
import type { ToolFrontmatter } from "@/lib/types";
import { getToolComparisonProfile, rankToolsForComparison } from "@/lib/toolComparison";

const tools: ToolFrontmatter[] = [
  {
    title: "Alpha Agent",
    slug: "alpha-agent",
    description: "Automation-first coding agent",
    category: "Agent",
    pricing: "Freemium",
    worthIt: true,
    dateAdded: "2026-04-01",
    easeOfUse: 4,
    outputQuality: 5,
    speed: 4,
    automationDepth: 5,
    collaboration: 3,
  },
  {
    title: "Bravo CLI",
    slug: "bravo-cli",
    description: "Terminal assistant",
    category: "CLI",
    pricing: "Free",
    worthIt: true,
    dateAdded: "2026-04-02",
  },
  {
    title: "Charlie IDE",
    slug: "charlie-ide",
    description: "IDE-native assistant",
    category: "IDE",
    pricing: "Paid",
    worthIt: false,
    dateAdded: "2026-04-03",
    easeOfUse: 5,
    outputQuality: 4,
    speed: 4,
    automationDepth: 3,
    collaboration: 4,
  },
];

describe("getToolComparisonProfile", () => {
  it("uses provided metric values and computes overall score", () => {
    const profile = getToolComparisonProfile(tools[0]);

    expect(profile.metrics.easeOfUse).toBe(4);
    expect(profile.metrics.outputQuality).toBe(5);
    expect(profile.metrics.priceValue).toBe(4);
    expect(profile.overallScore).toBeGreaterThan(70);
  });

  it("falls back to category defaults when metric values are absent", () => {
    const profile = getToolComparisonProfile(tools[1]);

    expect(profile.metrics.speed).toBe(5);
    expect(profile.metrics.automationDepth).toBe(4);
    expect(profile.metrics.priceValue).toBe(5);
  });
});

describe("rankToolsForComparison", () => {
  it("returns tools sorted by overall score descending", () => {
    const ranked = rankToolsForComparison(tools);

    expect(ranked).toHaveLength(3);
    expect(ranked[0].overallScore).toBeGreaterThanOrEqual(ranked[1].overallScore);
    expect(ranked[1].overallScore).toBeGreaterThanOrEqual(ranked[2].overallScore);
  });
});
