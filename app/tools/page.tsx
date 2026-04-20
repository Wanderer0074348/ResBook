import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getTools } from "@/lib/mdx";
import { ToolsExplorer } from "@/components/listing/ToolsExplorer";

export const metadata: Metadata = {
  title: "Tools | ResBook",
  description: "Browse all reviewed AI tools in ResBook.",
};

export default async function ToolsPage() {
  const toolsData = await getTools();
  const tools = toolsData.map((tool) => tool.frontmatter);

  return (
    <div className="min-h-screen border-l border-gray-300 dark:border-gray-700">
      <div className="max-w-3xl px-8 py-12">
        <div className="mb-8 text-sm flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Link href="/" className="hover:text-black dark:hover:text-white">
            home
          </Link>
          <span>/</span>
          <span className="text-black dark:text-white">tools</span>
        </div>

        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-4">Tools</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Curated AI tools with practical reviews and quick verdicts.
          </p>
        </div>
      </div>

      {tools.length === 0 ? (
        <div className="max-w-3xl px-8 py-12">
          <p className="text-gray-600 dark:text-gray-400">No tools published yet.</p>
        </div>
      ) : (
        <div className="px-8 py-12">
          <Suspense fallback={<p className="text-gray-500">Loading tools...</p>}>
            <ToolsExplorer tools={tools} />
          </Suspense>
        </div>
      )}
    </div>
  );
}
