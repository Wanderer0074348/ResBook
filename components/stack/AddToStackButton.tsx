"use client";

import { useState, useEffect } from "react";
import { Plus, Check } from "lucide-react";

interface StackItem {
  type: "tool" | "workflow" | "dotfile";
  slug: string;
  title: string;
}

interface AddToStackButtonProps {
  item: StackItem;
}

const STACK_KEY = "resbook-personal-stack";

function getStack(): StackItem[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STACK_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

function saveStack(stack: StackItem[]) {
  localStorage.setItem(STACK_KEY, JSON.stringify(stack));
}

function isInStack(slug: string): boolean {
  const stack = getStack();
  return stack.some((item) => item.slug === slug);
}

export function AddToStackButton({ item }: AddToStackButtonProps) {
  const [inStack, setInStack] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setInStack(isInStack(item.slug));
  }, [item.slug]);

  const handleToggle = () => {
    const stack = getStack();
    let newStack: StackItem[];

    if (isInStack(item.slug)) {
      newStack = stack.filter((i) => i.slug !== item.slug);
    } else {
      newStack = [...stack, item];
    }

    saveStack(newStack);
    setInStack(!isInStack(item.slug));

    window.dispatchEvent(new CustomEvent("resbook:stack-updated"));
  };

  if (!isClient) return null;

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm border transition-colors ${
        inStack
          ? "bg-green-600 border-green-600 text-white"
          : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
      }`}
    >
      {inStack ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      {inStack ? "In Stack" : "Add to Stack"}
    </button>
  );
}