import type { Metadata } from "next";
import Link from "next/link";
import { CollectionsClientPage } from "@/components/collections/CollectionsClientPage";

export const metadata: Metadata = {
  title: "Collections | ResBook",
  description: "Save and organize tools, workflows, and dotfiles into reusable collections.",
};

export default function CollectionsPage() {
  return (
    <div className="min-h-screen border-l border-gray-300 dark:border-gray-700">
      <div className="max-w-4xl px-8 py-12">
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Link href="/" className="hover:text-black dark:hover:text-white">
            home
          </Link>
          <span>/</span>
          <span className="text-black dark:text-white">collections</span>
        </div>

        <div className="mb-10">
          <h1 className="mb-4 text-5xl font-bold">Collections</h1>
          <p className="max-w-3xl text-gray-600 dark:text-gray-400">
            Build reusable stacks of tools, workflows, and dotfiles for specific goals like launch prep, content ops, or support automation.
          </p>
        </div>

        <CollectionsClientPage />
      </div>
    </div>
  );
}
