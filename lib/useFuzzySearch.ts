import { useMemo, useState, useEffect, useCallback } from "react";
import Fuse from "fuse.js";

export interface SearchableItem {
  type: "tool" | "workflow" | "dotfile";
  slug: string;
  title: string;
  description: string;
  category?: string;
  pricing?: string;
  author?: string;
}

interface UseFuzzySearchOptions {
  threshold?: number;
  keys?: string[];
}

export function useFuzzySearch<T extends SearchableItem>(
  items: T[],
  searchTerm: string,
  options: UseFuzzySearchOptions = {}
) {
  const { threshold = 0.3, keys = ["title", "description", "category"] } = options;

  const fuse = useMemo(() => {
    return new Fuse(items, {
      keys,
      threshold,
      includeScore: true,
      ignoreLocation: true,
    });
  }, [items, keys, threshold]);

  const results = useMemo(() => {
    if (!searchTerm.trim()) return items;
    return fuse.search(searchTerm).map((result) => result.item);
  }, [fuse, searchTerm, items]);

  return results;
}

export function useInstantSearch<T extends SearchableItem>(
  items: T[],
  searchTerm: string
) {
  const [results, setResults] = useState<T[]>(items);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults(items);
      return;
    }

    setIsSearching(true);
    
    const fuse = new Fuse(items, {
      keys: ["title", "description", "category", "author"],
      threshold: 0.3,
      includeScore: true,
      ignoreLocation: true,
    });

    const searchResults = fuse.search(searchTerm).map((result) => result.item);
    setResults(searchResults);
    setIsSearching(false);
  }, [searchTerm, items]);

  return { results, isSearching };
}