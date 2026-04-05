import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resources | ResBook",
  description: "Templates and contribution resources for the ResBook directory.",
};

export default function ResourcesPage() {
  return (
    <div className="min-h-screen border-l border-gray-300 dark:border-gray-700">
      <div className="max-w-3xl px-8 py-12">
        <div className="mb-8 text-sm flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Link href="/" className="hover:text-black dark:hover:text-white">
            home
          </Link>
          <span>/</span>
          <span className="text-black dark:text-white">resources</span>
        </div>

        <h1 className="text-5xl font-bold mb-4">Resources</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Use these references to keep contributions consistent and review quality high.
        </p>

        <section className="mb-8 border border-gray-300 p-4 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-3">Tool Review Template</h2>
          <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
            <li>Overview and primary use case</li>
            <li>Strengths and limitations</li>
            <li>Pricing and value assessment</li>
            <li>Final verdict and who should use it</li>
          </ul>
        </section>

        <section className="mb-8 border border-gray-300 p-4 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-3">Workflow Template</h2>
          <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
            <li>Goal, prerequisites, and tool list</li>
            <li>Step-by-step implementation with prompts</li>
            <li>Expected outputs and quality checks</li>
            <li>Estimated time and complexity</li>
          </ul>
        </section>

        <section className="mb-8 border border-gray-300 p-4 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-3">Dotfile Template</h2>
          <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
            <li>Overview and intended use case</li>
            <li>Prompt pack or config snippets with examples</li>
            <li>Tool compatibility and setup instructions</li>
            <li>Maintenance notes and update cadence</li>
          </ul>
        </section>

        <section className="border border-gray-300 p-4 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-3">Contribute</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            Add new entries in content/tools, content/workflows, or content/dotfiles as MDX files
            with complete frontmatter.
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            Run <strong>npm run validate:content</strong> before committing. Contributor templates and
            quality rules are documented in CONTRIBUTING.md.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/tools" className="border border-gray-300 px-3 py-2 no-underline hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-950">
              Browse tools
            </Link>
            <Link href="/workflows" className="border border-gray-300 px-3 py-2 no-underline hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-950">
              Browse workflows
            </Link>
            <Link href="/dotfiles" className="border border-gray-300 px-3 py-2 no-underline hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-950">
              Browse dotfiles
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
