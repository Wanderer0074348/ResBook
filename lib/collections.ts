export type CollectionItemType = "tool" | "workflow" | "dotfile";

export interface CollectionItem {
  type: CollectionItemType;
  slug: string;
  title: string;
  href: string;
  savedAt: string;
  note?: string;
}

export interface Collection {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  items: CollectionItem[];
}

export function normalizeCollectionName(name: string): string {
  const normalized = name.trim().replace(/\s+/g, " ");
  return normalized.length > 0 ? normalized : "Untitled collection";
}

export function createCollection(name: string, nowIso: string): Collection {
  const normalizedName = normalizeCollectionName(name);
  const id = `col_${nowIso.replace(/[^0-9]/g, "").slice(0, 14)}_${Math.random().toString(36).slice(2, 7)}`;

  return {
    id,
    name: normalizedName,
    createdAt: nowIso,
    updatedAt: nowIso,
    items: [],
  };
}

function matchesItem(a: Pick<CollectionItem, "type" | "slug">, b: Pick<CollectionItem, "type" | "slug">): boolean {
  return a.type === b.type && a.slug === b.slug;
}

export function hasItem(collection: Collection, item: Pick<CollectionItem, "type" | "slug">): boolean {
  return collection.items.some((existing) => matchesItem(existing, item));
}

export function upsertCollectionItem(collection: Collection, item: CollectionItem, nowIso: string): Collection {
  const existingIndex = collection.items.findIndex((existing) => matchesItem(existing, item));

  if (existingIndex === -1) {
    return {
      ...collection,
      updatedAt: nowIso,
      items: [item, ...collection.items],
    };
  }

  const updatedItems = [...collection.items];
  updatedItems[existingIndex] = {
    ...updatedItems[existingIndex],
    ...item,
    savedAt: nowIso,
  };

  return {
    ...collection,
    updatedAt: nowIso,
    items: updatedItems,
  };
}

export function removeCollectionItem(
  collection: Collection,
  item: Pick<CollectionItem, "type" | "slug">,
  nowIso: string
): Collection {
  const items = collection.items.filter((existing) => !matchesItem(existing, item));

  if (items.length === collection.items.length) {
    return collection;
  }

  return {
    ...collection,
    updatedAt: nowIso,
    items,
  };
}

export function renameCollection(collection: Collection, name: string, nowIso: string): Collection {
  return {
    ...collection,
    name: normalizeCollectionName(name),
    updatedAt: nowIso,
  };
}

export function sortCollections(collections: Collection[]): Collection[] {
  return [...collections].sort((a, b) => {
    const aTime = Date.parse(a.updatedAt);
    const bTime = Date.parse(b.updatedAt);

    if (Number.isFinite(aTime) && Number.isFinite(bTime) && bTime !== aTime) {
      return bTime - aTime;
    }

    return a.name.localeCompare(b.name);
  });
}

export function toCollectionItemKey(item: Pick<CollectionItem, "type" | "slug">): string {
  return `${item.type}:${item.slug}`;
}
