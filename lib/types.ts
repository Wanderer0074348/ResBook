export interface ToolFrontmatter {
  title: string;
  slug: string;
  description: string;
  category: "LLM" | "Agent" | "IDE" | "CLI";
  pricing: "Free" | "Freemium" | "Paid";
  worthIt: boolean;
  dateAdded: string;
  easeOfUse?: 1 | 2 | 3 | 4 | 5;
  outputQuality?: 1 | 2 | 3 | 4 | 5;
  speed?: 1 | 2 | 3 | 4 | 5;
  automationDepth?: 1 | 2 | 3 | 4 | 5;
  collaboration?: 1 | 2 | 3 | 4 | 5;
  bestFor?: string[];
  integrations?: string[];
  startingPriceUsdMonthly?: number;
}

export type WorkflowComplexity = "Beginner" | "Intermediate" | "Advanced";
export type WorkflowMaintenanceLevel = "Low" | "Medium" | "High";

export interface WorkflowFrontmatter {
  title: string;
  slug: string;
  description: string;
  author: string;
  complexity: WorkflowComplexity;
  toolsUsed: string[];
  dateAdded: string;
  estimatedHours?: number;
  prerequisites?: string[];
  failurePoints?: string[];
  setupComplexity?: 1 | 2 | 3 | 4 | 5;
  dependencyRisk?: 1 | 2 | 3 | 4 | 5;
  observability?: 1 | 2 | 3 | 4 | 5;
  maintenanceLevel?: WorkflowMaintenanceLevel;
}

export interface DotfileFrontmatter {
  title: string;
  slug: string;
  description: string;
  author: string;
  kind: "Prompt Pack" | "Config" | "Template";
  toolsUsed: string[];
  dateAdded: string;
}

export interface ToolContent {
  frontmatter: ToolFrontmatter;
  content: string;
}

export interface WorkflowContent {
  frontmatter: WorkflowFrontmatter;
  content: string;
}

export interface DotfileContent {
  frontmatter: DotfileFrontmatter;
  content: string;
}
