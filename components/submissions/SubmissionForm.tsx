"use client";

import { useState } from "react";
import { ExternalLink, Send, Check, AlertCircle } from "lucide-react";

interface ToolSubmission {
  title: string;
  slug: string;
  description: string;
  category: "LLM" | "Agent" | "IDE" | "CLI";
  pricing: "Free" | "Freemium" | "Paid";
  worthIt: boolean;
}

type Category = "LLM" | "Agent" | "IDE" | "CLI";
type Pricing = "Free" | "Freemium" | "Paid";

export function SubmissionForm() {
  const [formData, setFormData] = useState<ToolSubmission>({
    title: "",
    slug: "",
    description: "",
    category: "LLM",
    pricing: "Free",
    worthIt: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const body = `---
title: "${formData.title}"
slug: ${formData.slug}
description: ${formData.description}
category: ${formData.category}
pricing: ${formData.pricing}
worthIt: ${formData.worthIt}
dateAdded: ${new Date().toISOString().split("T")[0]}
---

## Overview
${formData.description}

## Why it's worth it (or not)
${formData.worthIt ? "This tool is excellent for..." : "This tool has some limitations..."}

## Pricing
${formData.pricing === "Free" ? "Completely free to use" : formData.pricing === "Freemium" ? "Has a free tier with core features" : "Paid only - pricing details..."}
`;

    const issueTitle = `[Tool] ${formData.title}`;
    const repoUrl = "https://github.com/Manavarya09/ResBook/issues/new";
    const issueUrl = `${repoUrl}?title=${encodeURIComponent(issueTitle)}&body=${encodeURIComponent(body)}`;

    setSubmitted(true);
    setIsSubmitting(false);
    
    window.open(issueUrl, "_blank");
  };

  if (submitted) {
    return (
      <div className="border border-green-500 p-6 text-center">
        <Check className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Submission Ready!</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          A pre-filled GitHub issue has been opened. Complete the submission there.
        </p>
        <a
          href="https://github.com/Manavarya09/ResBook/issues/new"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
        >
          <ExternalLink className="w-4 h-4" />
          Open GitHub Issues
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Tool Name</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black"
          placeholder="e.g., Claude Code"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          required
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black"
          placeholder="Brief description of what this tool does..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black"
          >
            <option value="LLM">LLM</option>
            <option value="Agent">Agent</option>
            <option value="IDE">IDE</option>
            <option value="CLI">CLI</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Pricing</label>
          <select
            value={formData.pricing}
            onChange={(e) => setFormData({ ...formData, pricing: e.target.value as Pricing })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black"
          >
            <option value="Free">Free</option>
            <option value="Freemium">Freemium</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="worthIt"
          checked={formData.worthIt}
          onChange={(e) => setFormData({ ...formData, worthIt: e.target.checked })}
          className="w-4 h-4"
        />
        <label htmlFor="worthIt" className="text-sm">
          I recommend this tool
        </label>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 dark:bg-white text-white dark:text-black font-medium hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting ? (
          "Preparing..."
        ) : (
          <>
            <Send className="w-4 h-4" />
            Submit Tool
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        This will open a GitHub issue with pre-filled content for review.
      </p>
    </form>
  );
}
