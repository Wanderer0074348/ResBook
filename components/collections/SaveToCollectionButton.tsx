"use client";

import { useEffect, useMemo, useState } from "react";
import type { CollectionItem, CollectionItemType, Collection } from "@/lib/collections";
import {
  createCollection,
  hasItem,
  removeCollectionItem,
  sortCollections,
  upsertCollectionItem,
} from "@/lib/collections";
import {
  readCollectionsFromStorage,
  subscribeCollections,
  writeCollectionsToStorage,
} from "@/components/collections/storage";

interface SaveToCollectionButtonProps {
  itemType: CollectionItemType;
  slug: string;
  title: string;
  href: string;
}

function getUpdatedCollections(
  collections: Collection[],
  collectionId: string,
  item: CollectionItem,
  nowIso: string
): Collection[] {
  return collections.map((collection) => {
    if (collection.id !== collectionId) {
      return collection;
    }

    if (hasItem(collection, item)) {
      return removeCollectionItem(collection, item, nowIso);
    }

    return upsertCollectionItem(collection, item, nowIso);
  });
}

export function SaveToCollectionButton({
  itemType,
  slug,
  title,
  href,
}: SaveToCollectionButtonProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");

  const item = useMemo<CollectionItem>(
    () => ({
      type: itemType,
      slug,
      title,
      href,
      savedAt: new Date().toISOString(),
    }),
    [itemType, slug, title, href]
  );

  useEffect(() => {
    const sync = () => setCollections(readCollectionsFromStorage());

    sync();
    return subscribeCollections(sync);
  }, []);

  const savedInCount = useMemo(() => {
    return collections.reduce((count, collection) => {
      return hasItem(collection, item) ? count + 1 : count;
    }, 0);
  }, [collections, item]);

  const toggleInCollection = (collectionId: string) => {
    const nowIso = new Date().toISOString();
    const enrichedItem: CollectionItem = {
      ...item,
      savedAt: nowIso,
    };

    const next = sortCollections(
      getUpdatedCollections(collections, collectionId, enrichedItem, nowIso)
    );

    setCollections(next);
    writeCollectionsToStorage(next);
  };

  const createAndSave = () => {
    const nowIso = new Date().toISOString();
    const collection = createCollection(newCollectionName || "New collection", nowIso);
    const next = sortCollections([
      upsertCollectionItem(collection, { ...item, savedAt: nowIso }, nowIso),
      ...collections,
    ]);

    setCollections(next);
    writeCollectionsToStorage(next);
    setNewCollectionName("");
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="border border-gray-300 px-3 py-1 text-xs font-bold uppercase tracking-wide hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-900"
      >
        Save to collections{savedInCount > 0 ? ` (${savedInCount})` : ""}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-30 mt-2 w-80 border border-gray-300 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-black">
          <p className="mb-2 text-xs font-bold uppercase text-gray-600 dark:text-gray-400">
            Add to collection
          </p>

          <div className="mb-3 max-h-44 space-y-2 overflow-y-auto border border-gray-200 p-2 dark:border-gray-800">
            {collections.length === 0 ? (
              <p className="text-xs text-gray-600 dark:text-gray-400">No collections yet.</p>
            ) : (
              collections.map((collection) => {
                const checked = hasItem(collection, item);
                return (
                  <label key={collection.id} className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleInCollection(collection.id)}
                    />
                    <span>{collection.name}</span>
                    <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                      {collection.items.length}
                    </span>
                  </label>
                );
              })
            )}
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={newCollectionName}
              onChange={(event) => setNewCollectionName(event.target.value)}
              placeholder="Create new collection"
              className="w-full border border-gray-300 bg-white px-2 py-1 text-xs dark:border-gray-700 dark:bg-black"
            />
            <button
              type="button"
              onClick={createAndSave}
              className="w-full border border-black px-2 py-1 text-xs font-bold hover:bg-gray-100 dark:border-white dark:hover:bg-gray-900"
            >
              Create and save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
