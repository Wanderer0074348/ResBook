"use client";

import type { Collection } from "@/lib/collections";
import { sortCollections } from "@/lib/collections";

export const COLLECTIONS_STORAGE_KEY = "resbook.collections.v1";
export const COLLECTIONS_UPDATED_EVENT = "resbook:collections-updated";

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function normalizeCollections(value: unknown): Collection[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is Collection => {
      if (!item || typeof item !== "object") {
        return false;
      }

      const candidate = item as Partial<Collection>;
      return (
        isString(candidate.id) &&
        isString(candidate.name) &&
        isString(candidate.createdAt) &&
        isString(candidate.updatedAt) &&
        Array.isArray(candidate.items)
      );
    })
    .map((item) => ({
      ...item,
      items: item.items.filter((entry) => {
        return (
          entry &&
          typeof entry === "object" &&
          isString(entry.type) &&
          isString(entry.slug) &&
          isString(entry.title) &&
          isString(entry.href) &&
          isString(entry.savedAt)
        );
      }),
    }));
}

export function readCollectionsFromStorage(): Collection[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(COLLECTIONS_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    return sortCollections(normalizeCollections(parsed));
  } catch {
    return [];
  }
}

export function writeCollectionsToStorage(collections: Collection[]) {
  if (typeof window === "undefined") {
    return;
  }

  const sorted = sortCollections(collections);
  window.localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(sorted));
  window.dispatchEvent(new CustomEvent(COLLECTIONS_UPDATED_EVENT));
}

export function subscribeCollections(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === COLLECTIONS_STORAGE_KEY) {
      callback();
    }
  };

  const handleCustom = () => callback();

  window.addEventListener("storage", handleStorage);
  window.addEventListener(COLLECTIONS_UPDATED_EVENT, handleCustom);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(COLLECTIONS_UPDATED_EVENT, handleCustom);
  };
}
