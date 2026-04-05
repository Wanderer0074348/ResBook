import type { Metadata } from "next";
import Link from "next/link";
import { SearchClient } from "@/components/SearchClient";
import { getDotfiles, getTools, getWorkflows } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Search | ResBook",
  description: "Search across tool reviews, workflow guides, and dotfiles.",
};

export default async function SearchPage() {
  const [toolsData, workflowsData, dotfilesData] = await Promise.all([
    getTools(),
    getWorkflows(),
    getDotfiles(),
  ]);

  const tools = toolsData.map((tool) => tool.frontmatter);
  const workflows = workflowsData.map((workflow) => workflow.frontmatter);
  const dotfiles = dotfilesData.map((dotfile) => dotfile.frontmatter);

  return (
    <div className="min-h-screen border-l border-gray-300 dark:border-gray-700">
      <div className="max-w-3xl px-8 py-12">
        <div className="mb-8 text-sm flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Link href="/" className="hover:text-black dark:hover:text-white">
            home
          </Link>
          <span>/</span>
          <span className="text-black dark:text-white">search</span>
        </div>

        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-4">Search</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find tools, workflows, and dotfiles by title or description.
          </p>
        </div>

        <SearchClient initialTools={tools} initialWorkflows={workflows} initialDotfiles={dotfiles} />
      </div>
    </div>
  );
}
