"use client";

interface UpdatedBadgeProps {
  dateAdded: string;
  className?: string;
}

function isRecentlyUpdated(dateAdded: string): boolean {
  const added = new Date(dateAdded);
  const now = new Date();
  const diffTime = now.getTime() - added.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays <= 30;
}

export function UpdatedBadge({ dateAdded, className = "" }: UpdatedBadgeProps) {
  if (!isRecentlyUpdated(dateAdded)) return null;

  return (
    <span
      className={`text-xs font-bold uppercase bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 ${className}`}
    >
      Recently Updated
    </span>
  );
}