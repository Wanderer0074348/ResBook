"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Collection, CollectionItem } from "@/lib/collections";
import {
  createCollection,
  removeCollectionItem,
  renameCollection,
  sortCollections,
} from "@/lib/collections";
import {
  readCollectionsFromStorage,
  subscribeCollections,
  writeCollectionsToStorage,
} from "@/components/collections/storage";

export function CollectionsClientPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [newCollectionName, setNewCollectionName] = useState("");

  useEffect(() => {
    const sync = () => setCollections(readCollectionsFromStorage());

    sync();
    return subscribeCollections(sync);
  }, []);

  const totalItems = useMemo(
    () => collections.reduce((count, collection) => count + collection.items.length, 0),
    [collections]
  );

  const persistCollections = (next: Collection[]) => {
    const sorted = sortCollections(next);
    setCollections(sorted);
    writeCollectionsToStorage(sorted);
  };

  const handleCreate = () => {
    const nowIso = new Date().toISOString();
    const created = createCollection(newCollectionName || "New collection", nowIso);
    persistCollections([created, ...collections]);
    setNewCollectionName("");
  };

  const handleRename = (collectionId: string, nextName: string) => {
    const nowIso = new Date().toISOString();
    const next = collections.map((collection) =>
      collection.id === collectionId
        ? renameCollection(collection, nextName, nowIso)
        : collection
    );

    persistCollections(next);
  };

  const handleDelete = (collectionId: string) => {
    persistCollections(collections.filter((collection) => collection.id !== collectionId));
  };

  const handleRemoveItem = (collectionId: string, item: CollectionItem) => {
    const nowIso = new Date().toISOString();
    const next = collections.map((collection) => {
      if (collection.id !== collectionId) {
        return collection;
      }

      return removeCollectionItem(collection, item, nowIso);
    });

    persistCollections(next);
  };

  return (
    <>
      <section className="mb-8 border border-gray-300 p-4 dark:border-gray-700">
        <p className="mb-3 text-xs font-bold uppercase text-gray-600 dark:text-gray-400">
          Create collection
        </p>
        <div className="flex flex-col gap-2 md:flex-row">
          <input
            type="text"
            value={newCollectionName}
            onChange={(event) => setNewCollectionName(event.target.value)}
            placeholder="Collection name"
            className="flex-1 border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-black"
          />
          <button
            type="button"
            onClick={handleCreate}
            className="border border-black px-3 py-2 text-sm font-bold uppercase tracking-wide hover:bg-gray-100 dark:border-white dark:hover:bg-gray-900"
          >
            Create
          </button>
        </div>
      </section>

      <section className="mb-6 text-sm text-gray-600 dark:text-gray-400">
        {collections.length} collection{collections.length === 1 ? "" : "s"} • {totalItems} saved item
        {totalItems === 1 ? "" : "s"}
      </section>

      {collections.length === 0 ? (
        <section className="border border-dashed border-gray-300 p-6 text-center text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
          No collections yet. Save tools, workflows, or dotfiles from their detail pages.
        </section>
      ) : (
        <div className="space-y-6">
          {collections.map((collection) => (
            <article key={collection.id} className="border border-gray-300 p-4 dark:border-gray-700">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
                <input
                  type="text"
                  value={collection.name}
                  onChange={(event) => handleRename(collection.id, event.target.value)}
                  className="flex-1 border border-gray-300 bg-white px-3 py-2 text-sm font-bold dark:border-gray-700 dark:bg-black"
                />
                <button
                  type="button"
                  onClick={() => handleDelete(collection.id)}
                  className="border border-gray-300 px-3 py-2 text-xs uppercase tracking-wide text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-900"
                >
                  Delete collection
                </button>
              </div>

              {collection.items.length === 0 ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">No items saved yet.</p>
              ) : (
                <ul className="space-y-3">
                  {collection.items.map((item) => (
                    <li
                      key={`${collection.id}:${item.type}:${item.slug}`}
                      className="flex flex-col gap-2 border border-gray-200 p-3 dark:border-gray-800 md:flex-row md:items-start md:justify-between"
                    >
                      <div>
                        <p className="mb-1 text-xs uppercase text-gray-500 dark:text-gray-400">{item.type}</p>
                        <Link href={item.href} className="font-semibold hover:underline">
                          {item.title}
                        </Link>
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">saved {new Date(item.savedAt).toLocaleString()}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(collection.id, item)}
                        className="self-start border border-gray-300 px-2 py-1 text-xs uppercase text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-900"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      )}
    </>
  );
}
