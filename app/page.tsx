import Link from "next/link";
import { getDotfiles, getTools, getWorkflows } from "@/lib/mdx";
import { cn } from "@/lib/utils";

export default async function Home() {
  const [toolsData, workflowsData, dotfilesData] = await Promise.all([
    getTools(),
    getWorkflows(),
    getDotfiles(),
  ]);

  const tools = toolsData.map((t) => t.frontmatter);
  const workflows = workflowsData.map((w) => w.frontmatter);
  const dotfiles = dotfilesData.map((d) => d.frontmatter);

  return (
    <div className="relative border-l border-gray-300 dark:border-gray-700 h-screen overflow-hidden flex flex-col">
      {/* Grid Background with Content Overlay */}
      <div className="relative h-screen flex items-center justify-center bg-white dark:bg-black">
        {/* Grid Background */}
        <div
          className={cn(
            "absolute inset-0",
            "[background-size:40px_40px]",
            "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
            "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
          )}
        />
        {/* Radial gradient for fade effect */}
        <div className="pointer-events-none absolute inset-0 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)] dark:bg-black"></div>

        {/* Content Overlay */}
        <div className="relative z-20 w-full h-full flex flex-col items-center justify-center px-6 py-12 overflow-y-auto">
          <div className="max-w-2xl w-full">
            {/* Title */}
            <h1 className="text-6xl md:text-7xl font-bold text-center mb-6 text-black dark:text-white">
              ResBook
            </h1>

            {/* Description */}
            <p className="text-center text-sm md:text-base text-gray-700 dark:text-gray-300 mb-12">
              A curated directory of AI tools, agentic workflows, and developer configurations.
            </p>

            {/* Quick Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Link
                href="/tools"
                className="border border-gray-300 bg-white/80 dark:border-gray-700 dark:bg-black/80 p-4 hover:bg-white dark:hover:bg-black transition-colors text-center no-underline"
              >
                <p className="font-bold text-black dark:text-white text-sm">Browse Tools</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">by category</p>
              </Link>
              <Link
                href="/workflows"
                className="border border-gray-300 bg-white/80 dark:border-gray-700 dark:bg-black/80 p-4 hover:bg-white dark:hover:bg-black transition-colors text-center no-underline"
              >
                <p className="font-bold text-black dark:text-white text-sm">Learn Workflows</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">from practitioners</p>
              </Link>
              <Link
                href="/dotfiles"
                className="border border-gray-300 bg-white/80 dark:border-gray-700 dark:bg-black/80 p-4 hover:bg-white dark:hover:bg-black transition-colors text-center no-underline"
              >
                <p className="font-bold text-black dark:text-white text-sm">Explore Dotfiles</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">ready to use</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
