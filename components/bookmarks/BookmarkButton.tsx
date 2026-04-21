"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Bookmark as BookmarkIcon, Trash2 } from "lucide-react";

const BOOKMARKS_KEY = "resbook-bookmarks";

interface Bookmark {
  slug: string;
  type: "tool" | "workflow" | "dotfile";
  title: string;
  description: string;
  savedAt: string;
}

export function BookmarkButton({ item }: { item: Omit<Bookmark, "savedAt"> }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const bookmarks = getBookmarks();
    setIsBookmarked(bookmarks.some((b) => b.slug === item.slug && b.type === item.type));
  }, [item.slug, item.type]);

  const toggleBookmark = () => {
    const bookmarks = getBookmarks();
    let updated: Bookmark[];

    if (isBookmarked) {
      updated = bookmarks.filter((b) => !(b.slug === item.slug && b.type === item.type));
    } else {
      updated = [
        ...bookmarks,
        { ...item, savedAt: new Date().toISOString() },
      ];
    }

    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    setIsBookmarked(!isBookmarked);
    window.dispatchEvent(new CustomEvent("resbook:bookmarks-updated"));
  };

  if (!isClient) return null;

  return (
    <button
      onClick={toggleBookmark}
      className={`p-2 border transition-colors ${
        isBookmarked
          ? "bg-yellow-100 border-yellow-400 dark:bg-yellow-900"
          : "border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900"
      }`}
      title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      <BookmarkIcon
        className={`w-4 h-4 ${isBookmarked ? "fill-yellow-400 text-yellow-600" : ""}`}
      />
    </button>
  );
}

export function getBookmarks(): Bookmark[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(BOOKMARKS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function removeBookmark(slug: string, type: string) {
  const bookmarks = getBookmarks();
  const updated = bookmarks.filter((b) => !(b.slug === slug && b.type === type));
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent("resbook:bookmarks-updated"));
}