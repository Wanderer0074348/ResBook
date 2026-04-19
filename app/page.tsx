import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Sparkles, Zap, BookOpen } from "lucide-react";
import { getDotfiles, getTools, getWorkflows } from "@/lib/mdx";
import { cn } from "@/lib/utils";
import { AIChatAssistant } from "@/components/ai/AIChatAssistant";
import { PersonalStackBuilder } from "@/components/stack/PersonalStackBuilder";
import { RecentActivity } from "@/components/ui/RecentActivity";

export default async function Home() {
  const [toolsData, workflowsData, dotfilesData] = await Promise.all([
    getTools(),
    getWorkflows(),
    getDotfiles(),
  ]);

  const tools = toolsData.map((t) => t.frontmatter);
  const workflows = workflowsData.map((w) => w.frontmatter);
  const dotfiles = dotfilesData.map((d) => d.frontmatter);

  const toolCount = tools.length;
  const workflowCount = workflows.length;
  const dotfileCount = dotfiles.length;

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
          <div className="max-w-3xl w-full">
            {/* Badge */}
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium border border-black dark:border-white bg-black text-white dark:bg-white dark:text-black">
                <Sparkles className="w-3 h-3" />
                AI Ops Manual
              </span>
            </div>
            
            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold text-center mb-4 text-black dark:text-white tracking-tight">
              ResBook
            </h1>

            {/* Tagline */}
            <p className="text-center text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 font-light">
              Curated tools. Executable workflows. Your AI stack.
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-8 mb-10 text-sm text-gray-500">
              <div className="text-center">
                <p className="text-2xl font-bold text-black dark:text-white">{toolCount}</p>
                <p>tools</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-black dark:text-white">{workflowCount}</p>
                <p>workflows</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-black dark:text-white">{dotfileCount}</p>
                <p>dotfiles</p>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10">
              <Link
                href="/tools"
                className="group border border-gray-300 bg-white/80 dark:border-gray-700 dark:bg-black/80 p-5 hover:bg-white dark:hover:bg-black transition-all text-center no-underline"
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Zap className="w-4 h-4" />
                  <p className="font-bold text-black dark:text-white text-sm">Browse Tools</p>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">by category</p>
                <ArrowRight className="w-4 h-4 mx-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="/workflows"
                className="group border border-gray-300 bg-white/80 dark:border-gray-700 dark:bg-black/80 p-5 hover:bg-white dark:hover:bg-black transition-all text-center no-underline"
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <BookOpen className="w-4 h-4" />
                  <p className="font-bold text-black dark:text-white text-sm">Workflows</p>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">from practitioners</p>
                <ArrowRight className="w-4 h-4 mx-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="/dotfiles"
                className="group border border-gray-300 bg-white/80 dark:border-gray-700 dark:bg-black/80 p-5 hover:bg-white dark:hover:bg-black transition-all text-center no-underline"
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4" />
                  <p className="font-bold text-black dark:text-white text-sm">Dotfiles</p>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">ready to use</p>
                <ArrowRight className="w-4 h-4 mx-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>

            {/* New Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <AIChatAssistant />
              <PersonalStackBuilder />
            </div>

            <div className="flex justify-center">
              <Suspense fallback={null}>
                <RecentActivity />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}