"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { Check, RotateCcw } from "lucide-react";

interface WorkflowRunnerContextType {
  slug: string;
  totalSteps: number;
  completedSteps: number;
  isCompleted: boolean;
  toggleStep: (step: number) => void;
  resetProgress: () => void;
  completionDate: string | null;
  markComplete: () => void;
}

const WorkflowRunnerContext = createContext<WorkflowRunnerContextType | null>(null);

function getStorageKey(slug: string): string {
  return `resbook-workflow-progress-${slug}`;
}

interface WorkflowRunnerProviderProps {
  slug: string;
  totalSteps: number;
  children: ReactNode;
}

export function WorkflowRunnerProvider({ slug, totalSteps, children }: WorkflowRunnerProviderProps) {
  const [completedSteps, setCompletedSteps] = useState<number>(0);
  const [completionDate, setCompletionDate] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(getStorageKey(slug));
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setCompletedSteps(data.completedSteps || 0);
        setCompletionDate(data.completionDate || null);
      } catch {
        // ignore parse errors
      }
    }
  }, [slug]);

  const toggleStep = (step: number) => {
    const newCompleted = step <= completedSteps ? step - 1 : step;
    setCompletedSteps(newCompleted);
    localStorage.setItem(
      getStorageKey(slug),
      JSON.stringify({ completedSteps: newCompleted, completionDate })
    );
  };

  const markComplete = () => {
    const date = new Date().toISOString();
    setCompletedSteps(totalSteps);
    setCompletionDate(date);
    localStorage.setItem(
      getStorageKey(slug),
      JSON.stringify({ completedSteps: totalSteps, completionDate: date })
    );

    const completed = JSON.parse(localStorage.getItem("resbook-workflow-completions") || "[]");
    if (!completed.includes(slug)) {
      completed.push(slug);
      localStorage.setItem("resbook-workflow-completions", JSON.stringify(completed));
    }
  };

  const resetProgress = () => {
    setCompletedSteps(0);
    setCompletionDate(null);
    localStorage.removeItem(getStorageKey(slug));
  };

  return (
    <WorkflowRunnerContext.Provider
      value={{
        slug,
        totalSteps,
        completedSteps,
        isCompleted: completedSteps >= totalSteps,
        toggleStep,
        resetProgress,
        completionDate,
        markComplete,
      }}
    >
      {children}
    </WorkflowRunnerContext.Provider>
  );
}

export function useWorkflowRunner() {
  const context = useContext(WorkflowRunnerContext);
  if (!context) {
    throw new Error("useWorkflowRunner must be used within WorkflowRunnerProvider");
  }
  return context;
}

interface WorkflowStepTrackerProps {
  step: number;
  title: string;
}

export function WorkflowStepTracker({ step, title }: WorkflowStepTrackerProps) {
  const { completedSteps, toggleStep } = useWorkflowRunner();
  const isCompletedStep = completedSteps >= step;

  return (
    <div className="my-8 ml-6 border-l-2 border-gray-300 dark:border-gray-700 pl-6 relative">
      <div className="absolute -left-4 -top-1 w-7 h-7 bg-white dark:bg-black border-2 border-gray-400 dark:border-gray-600 rounded-full flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">
        {step}
      </div>

      <div className="flex items-start gap-3">
        <button
          onClick={() => toggleStep(step)}
          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            isCompletedStep
              ? "bg-green-600 border-green-600 text-white"
              : "border-gray-400 dark:border-gray-600 hover:border-green-500"
          }`}
          aria-label={isCompletedStep ? "Mark incomplete" : "Mark complete"}
        >
          {isCompletedStep && <Check className="w-3 h-3" />}
        </button>

        <div className="flex-1">
          <h4 className={`font-bold text-lg mb-2 ${isCompletedStep ? "line-through text-gray-500 dark:text-gray-400" : ""}`}>
            {title}
          </h4>
        </div>
      </div>
    </div>
  );
}

export function WorkflowProgressBar() {
  const { totalSteps, completedSteps, isCompleted, resetProgress, completionDate } = useWorkflowRunner();

  const percentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div className="mb-6 p-4 border border-gray-300 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">
          Progress: {completedSteps}/{totalSteps} steps
        </span>
        <button
          onClick={resetProgress}
          className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            isCompleted ? "bg-green-600" : "bg-gray-700 dark:bg-gray-400"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {isCompleted && completionDate && (
        <p className="mt-2 text-xs text-green-600 dark:text-green-400">
          Completed on {new Date(completionDate).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
