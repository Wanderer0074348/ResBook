"use client";

import type { WorkflowFrontmatter } from "@/lib/types";
import { WorkflowsTable } from "./WorkflowsTable";

interface WorkflowsExplorerProps {
  workflows: WorkflowFrontmatter[];
}

export function WorkflowsExplorer({ workflows }: WorkflowsExplorerProps) {
  return <WorkflowsTable workflows={workflows} />;
}
