"use client";

import type { ToolFrontmatter } from "@/lib/types";
import { ToolsTable } from "./ToolsTable";

interface ToolsExplorerProps {
  tools: ToolFrontmatter[];
}

export function ToolsExplorer({ tools }: ToolsExplorerProps) {
  return <ToolsTable tools={tools} />;
}
