import type { Metadata } from "next";
import Link from "next/link";
import { SubmissionForm } from "@/components/submissions/SubmissionForm";

export const metadata: Metadata = {
  title: "Submit | ResBook",
  description: "Submit a tool, workflow, or dotfile to ResBook.",
};

export default function SubmitPage() {
  return (
    <div className="min-h-screen border-l border-gray-300 dark:border-gray-700">
      <div className="max-w-2xl px-8 py-12">
        <div className="mb-8 text-sm flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Link href="/" className="hover:text-black dark:hover:text-white">
            home
          </Link>
          <span>/</span>
          <span className="text-black dark:text-white">submit</span>
        </div>

        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-4">Submit</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Submit a tool, workflow, or dotfile to ResBook. All submissions go through GitHub for review.
          </p>
        </div>

        <div className="border border-gray-300 p-6 dark:border-gray-700">
          <SubmissionForm />
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="https://github.com/Manavarya09/ResBook/issues/new?template=tool.md"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            <h3 className="font-bold mb-2">Submit a Workflow</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Share your AI-powered workflow with the community.
            </p>
          </Link>
          <Link
            href="https://github.com/Manavarya09/ResBook/issues/new?template=dotfile.md"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            <h3 className="font-bold mb-2">Submit a Dotfile</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Share your prompt packs, configs, or templates.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
