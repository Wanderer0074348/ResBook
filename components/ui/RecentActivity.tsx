"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";

const RECENT_KEY = "resbook-recent-views";
const MAX_RECENT = 5;

interface RecentItem {
  slug: string;
  type: "tool" | "workflow" | "dotfile";
  title: string;
  viewedAt: string;
}

interface RecentActivityProps {
  className?: string;
}

export function RecentActivity({ className = "" }: RecentActivityProps) {
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_KEY);
    if (stored) {
      try {
        setRecentItems(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  if (recentItems.length === 0) return null;

  const getHref = (item: RecentItem) => `/${item.type}s/${item.slug}`;

  return (
    <div className={className}>
      <p className="text-xs font-bold uppercase mb-2 flex items-center gap-1">
        <Clock className="w-3 h-3" />
        Recently Viewed
      </p>
      <div className="space-y-1">
        {recentItems.slice(0, MAX_RECENT).map((item) => (
          <Link
            key={`${item.type}-${item.slug}`}
            href={getHref(item)}
            className="block text-xs text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
          >
            {item.title}
            <span className="text-gray-400 ml-1">({item.type})</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function trackRecentView(slug: string, type: "tool" | "workflow" | "dotfile", title: string) {
  const stored = localStorage.getItem(RECENT_KEY);
  let items: RecentItem[] = stored ? JSON.parse(stored) : [];

  items = items.filter((item) => !(item.slug === slug && item.type === type));

  items.unshift({
    slug,
    type,
    title,
    viewedAt: new Date().toISOString(),
  });

  items = items.slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_KEY, JSON.stringify(items));
}