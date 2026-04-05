/// <reference types="bun-types" />

import { describe, expect, it } from "bun:test";
import {
  createCollection,
  hasItem,
  normalizeCollectionName,
  removeCollectionItem,
  sortCollections,
  toCollectionItemKey,
  upsertCollectionItem,
} from "@/lib/collections";

describe("collections helpers", () => {
  it("normalizes collection names", () => {
    expect(normalizeCollectionName("  MVP   stack  ")).toBe("MVP stack");
    expect(normalizeCollectionName("   ")).toBe("Untitled collection");
  });

  it("creates a collection with stable metadata", () => {
    const collection = createCollection(" Launch Pack ", "2026-04-05T10:00:00.000Z");

    expect(collection.name).toBe("Launch Pack");
    expect(collection.createdAt).toBe("2026-04-05T10:00:00.000Z");
    expect(collection.items).toHaveLength(0);
  });

  it("adds and removes items from collection", () => {
    const nowIso = "2026-04-05T10:00:00.000Z";
    const collection = createCollection("My stack", nowIso);
    const item = {
      type: "tool" as const,
      slug: "alpha-agent",
      title: "Alpha Agent",
      href: "/tools/alpha-agent",
      savedAt: nowIso,
    };

    const withItem = upsertCollectionItem(collection, item, nowIso);
    expect(withItem.items).toHaveLength(1);
    expect(hasItem(withItem, item)).toBe(true);

    const removed = removeCollectionItem(withItem, item, "2026-04-05T10:01:00.000Z");
    expect(removed.items).toHaveLength(0);
    expect(hasItem(removed, item)).toBe(false);
  });

  it("updates existing item instead of duplicating it", () => {
    const collection = createCollection("My stack", "2026-04-05T10:00:00.000Z");
    const first = upsertCollectionItem(
      collection,
      {
        type: "workflow",
        slug: "launch-sprint",
        title: "Launch Sprint",
        href: "/workflows/launch-sprint",
        savedAt: "2026-04-05T10:00:00.000Z",
      },
      "2026-04-05T10:00:00.000Z"
    );

    const second = upsertCollectionItem(
      first,
      {
        type: "workflow",
        slug: "launch-sprint",
        title: "Launch Sprint Updated",
        href: "/workflows/launch-sprint",
        savedAt: "2026-04-05T10:02:00.000Z",
      },
      "2026-04-05T10:02:00.000Z"
    );

    expect(second.items).toHaveLength(1);
    expect(second.items[0].title).toBe("Launch Sprint Updated");
  });

  it("sorts collections by updatedAt descending", () => {
    const older = createCollection("Older", "2026-04-05T09:00:00.000Z");
    const newer = createCollection("Newer", "2026-04-05T10:00:00.000Z");

    const sorted = sortCollections([older, newer]);
    expect(sorted[0].name).toBe("Newer");
    expect(sorted[1].name).toBe("Older");
  });

  it("builds stable item keys", () => {
    expect(toCollectionItemKey({ type: "dotfile", slug: "starter-pack" })).toBe("dotfile:starter-pack");
  });
});
