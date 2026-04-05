"use client";

import type { DotfileFrontmatter } from "@/lib/types";
import { DotfilesTable } from "./DotfilesTable";

interface DotfilesExplorerProps {
  dotfiles: DotfileFrontmatter[];
}

export function DotfilesExplorer({ dotfiles }: DotfilesExplorerProps) {
  return <DotfilesTable dotfiles={dotfiles} />;
}
