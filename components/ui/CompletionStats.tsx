"use client";

import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";

const COMPLETED_KEY = "resbook-workflow-completions";

function getCompletedWorkflows(): string[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(COMPLETED_KEY);
  return stored ? JSON.parse(stored) : [];
}

interface CompletionStatsProps {
  className?: string;
}

export function CompletionStats({ className = "" }: CompletionStatsProps) {
  const [completedCount, setCompletedCount] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const completed = getCompletedWorkflows();
    setCompletedCount(completed.length);
  }, []);

  if (!isClient || completedCount === 0) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <CheckCircle className="w-4 h-4 text-green-600" />
      <span className="text-sm">
        <span className="font-bold">{completedCount}</span> workflow{completedCount === 1 ? "" : "s"} completed
      </span>
    </div>
  );
}

export function markWorkflowCompleted(slug: string) {
  const completed = getCompletedWorkflows();
  if (!completed.includes(slug)) {
    completed.push(slug);
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(completed));
  }
}

export function isWorkflowCompleted(slug: string): boolean {
  return getCompletedWorkflows().includes(slug);
}