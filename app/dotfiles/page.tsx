import type { Metadata } from "next";
import Link from "next/link";
import { getDotfiles } from "@/lib/mdx";
import { DotfilesExplorer } from "@/components/listing/DotfilesExplorer";

export const metadata: Metadata = {
  title: "Dotfiles | ResBook",
  description: "Browse prompt packs, AI configs, and reusable project templates.",
};

export default async function DotfilesPage() {
  const dotfilesData = await getDotfiles();
  const dotfiles = dotfilesData.map((dotfile) => dotfile.frontmatter);

  return (
    <div className="min-h-screen border-l border-gray-300 dark:border-gray-700">
      <div className="max-w-3xl px-8 py-12">
        <div className="mb-8 text-sm flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Link href="/" className="hover:text-black dark:hover:text-white">
            home
          </Link>
          <span>/</span>
          <span className="text-black dark:text-white">dotfiles</span>
        </div>

        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-4">Dotfiles</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Practical prompt packs, config snippets, and reusable starter structures.
          </p>
        </div>

        {dotfiles.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No dotfiles published yet.</p>
        ) : (
          <DotfilesExplorer dotfiles={dotfiles} />
        )}
      </div>
    </div>
  );
}
