import Link from "next/link";
import { getDotfiles, getTools, getWorkflows } from "@/lib/mdx";
import { HomeDotfilesBlock } from "@/components/listing/HomeDotfilesBlock";

export default async function Home() {
  const [toolsData, workflowsData, dotfilesData] = await Promise.all([
    getTools(),
    getWorkflows(),
    getDotfiles(),
  ]);

  const tools = toolsData.map((t) => t.frontmatter);
  const workflows = workflowsData.map((w) => w.frontmatter);
  const dotfiles = dotfilesData.map((d) => d.frontmatter);

  const categories = {
    LLM: tools.filter((t) => t.category === "LLM"),
    Agent: tools.filter((t) => t.category === "Agent"),
    IDE: tools.filter((t) => t.category === "IDE"),
    CLI: tools.filter((t) => t.category === "CLI"),
  };

  return (
    <div className="min-h-screen border-l border-gray-300 dark:border-gray-700">
      {/* Hero Section */}
      <section className="border-b border-gray-300 bg-gray-50 p-8 dark:border-gray-700 dark:bg-gray-950">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold mb-4">ResBook</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            A curated directory of AI tools, agentic workflows, dotfiles, and developer tips. All in markdown.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-500">
            Explore tools by category, learn workflows from experienced developers, reuse proven
            configurations, and stay updated with the latest in AI development.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-3xl px-8 py-12">
        <section className="mb-16 grid gap-4 md:grid-cols-2">
          <Link
            href="/compare"
            className="block border border-gray-300 p-4 no-underline transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-950"
          >
            <p className="mb-2 text-xs font-bold uppercase text-gray-600 dark:text-gray-400">New</p>
            <h2 className="mb-1 text-xl font-bold">Compare Tools</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Select up to four tools and evaluate quality, speed, automation depth, and value side by side.
            </p>
          </Link>

          <Link
            href="/collections"
            className="block border border-gray-300 p-4 no-underline transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-950"
          >
            <p className="mb-2 text-xs font-bold uppercase text-gray-600 dark:text-gray-400">New</p>
            <h2 className="mb-1 text-xl font-bold">Collections</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Save tools, workflows, and dotfiles into reusable stacks tailored for each project goal.
            </p>
          </Link>
        </section>

        {/* Tools by Category */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Tools</h2>

          {Object.entries(categories).map(([category, categoryTools]) => (
            categoryTools.length > 0 && (
              <div key={category} className="mb-12">
                <h3 className="text-lg font-bold mb-4 border-b border-gray-300 pb-2 dark:border-gray-700">
                  {category}
                </h3>
                <div className="space-y-4">
                  {categoryTools.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      className="block border border-gray-300 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-950 transition-colors no-underline"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-black dark:text-white mb-1">
                            {tool.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {tool.description}
                          </p>
                        </div>
                        <div className="flex gap-2 whitespace-nowrap">
                          <span className="text-xs border border-gray-300 px-2 py-1 dark:border-gray-700">
                            {tool.pricing}
                          </span>
                          <span className={`text-xs px-2 py-1 font-bold ${
                            tool.worthIt
                              ? 'border border-black bg-white dark:border-white dark:bg-black'
                              : 'border border-gray-400 text-gray-600 dark:border-gray-600 dark:text-gray-400'
                          }`}>
                            {tool.worthIt ? '✓' : '−'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>

        {/* Workflows Section */}
        {workflows.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Workflows</h2>
            <div className="space-y-4">
              {workflows.map((workflow) => (
                <Link
                  key={workflow.slug}
                  href={`/workflows/${workflow.slug}`}
                  className="block border border-gray-300 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-950 transition-colors no-underline"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-black dark:text-white mb-1">
                        {workflow.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {workflow.description}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-500">
                        by <span className="font-bold">{workflow.author}</span>
                      </p>
                    </div>
                    <span className="text-xs border border-gray-300 px-2 py-1 whitespace-nowrap dark:border-gray-700">
                      {workflow.complexity}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Dotfiles Section */}
        {dotfiles.length > 0 && (
          <HomeDotfilesBlock dotfiles={dotfiles} />
        )}

        {/* Stats */}
        <section className="border-t border-gray-300 pt-12 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="border border-gray-300 p-4 text-center dark:border-gray-700">
              <div className="text-3xl font-bold">{tools.length}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">tools</p>
            </div>
            <div className="border border-gray-300 p-4 text-center dark:border-gray-700">
              <div className="text-3xl font-bold">{workflows.length}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">workflows</p>
            </div>
            <div className="border border-gray-300 p-4 text-center dark:border-gray-700">
              <div className="text-3xl font-bold">{dotfiles.length}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">dotfiles</p>
            </div>
            <div className="border border-gray-300 p-4 text-center dark:border-gray-700">
              <div className="text-3xl font-bold">
                {tools.filter((t) => t.worthIt).length}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">recommended</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
