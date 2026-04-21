import { ToolFrontmatter, WorkflowFrontmatter, DotfileFrontmatter } from "@/lib/types";

export type ContentCategory = 
  | "LLM" 
  | "Agent" 
  | "IDE" 
  | "CLI" 
  | "Automation"
  | "Productivity"
  | "Analytics"
  | "Security";

export type ToolPricing = "Free" | "Freemium" | "Paid";

export interface CategoryInfo {
  id: ContentCategory;
  name: string;
  icon: string;
  description: string;
}

export const TOOL_CATEGORIES: CategoryInfo[] = [
  { id: "LLM", name: "LLM", icon: "Brain", description: "Large Language Models" },
  { id: "Agent", name: "Agent", icon: "Bot", description: "AI Agents" },
  { id: "IDE", name: "IDE", icon: "Code", description: "Development Environments" },
  { id: "CLI", name: "CLI", icon: "Terminal", description: "Command Line Tools" },
  { id: "Automation", name: "Automation", icon: "Zap", description: "Automation Tools" },
  { id: "Productivity", name: "Productivity", icon: "CheckCircle", description: "Productivity Apps" },
  { id: "Analytics", name: "Analytics", icon: "BarChart", description: "Analytics & Monitoring" },
  { id: "Security", name: "Security", icon: "Shield", description: "Security Tools" },
];

export const WORKFLOW_COMPLEXITY = ["Beginner", "Intermediate", "Advanced"] as const;
export const TOOL_PRICING = ["Free", "Freemium", "Paid"] as const;

export function getCategoryById(id: string): CategoryInfo | undefined {
  return TOOL_CATEGORIES.find((cat) => cat.id === id);
}

export function filterByCategory<T extends { category?: string }>(
  items: T[], 
  category: string | null
): T[] {
  if (!category) return items;
  return items.filter((item) => item.category === category);
}

export function filterByPricing<T extends { pricing?: string }>(
  items: T[], 
  pricing: string | null
): T[] {
  if (!pricing) return items;
  return items.filter((item) => item.pricing === pricing);
}

export function filterBySearch<T extends { title: string; description: string }>(
  items: T[], 
  search: string
): T[] {
  if (!search.trim()) return items;
  const term = search.toLowerCase();
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term)
  );
}