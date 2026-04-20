"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import Link from "next/link";
import type { ToolFrontmatter } from "@/lib/types";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

interface ToolsTableProps {
  tools: ToolFrontmatter[];
}

const columnHelper = createColumnHelper<ToolFrontmatter>();

export function ToolsTable({ tools }: ToolsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    const category = searchParams.get("category");
    const pricing = searchParams.get("pricing");
    const recommended = searchParams.get("recommended");
    const sortBy = searchParams.get("sort");
    const search = searchParams.get("search");

    const newFilters: ColumnFiltersState = [];
    if (category) newFilters.push({ id: "category", value: category });
    if (pricing) newFilters.push({ id: "pricing", value: pricing });
    if (recommended) newFilters.push({ id: "worthIt", value: recommended === "true" });
    setColumnFilters(newFilters);

    if (search) setGlobalFilter(search);
    if (sortBy) setSorting([{ id: sortBy, desc: false }]);
  }, [searchParams]);

  const updateUrl = (newFilters: ColumnFiltersState, newSort: SortingState, newSearch: string) => {
    const params = new URLSearchParams();
    newFilters.forEach((filter) => {
      if (filter.id === "category" && filter.value) params.set("category", filter.value as string);
      if (filter.id === "pricing" && filter.value) params.set("pricing", filter.value as string);
      if (filter.id === "worthIt" && filter.value !== undefined) params.set("recommended", String(filter.value));
    });
    if (newSearch) params.set("search", newSearch);
    if (newSort[0]?.id) params.set("sort", newSort[0].id);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("title", {
        header: "Tool",
        cell: (info) => {
          const tool = info.row.original;
          return (
            <Link
              href={`/tools/${tool.slug}`}
              className="font-bold text-black dark:text-white hover:underline"
            >
              {info.getValue()}
            </Link>
          );
        },
        enableSorting: true,
        enableColumnFilter: true,
      }),
      columnHelper.accessor("description", {
        header: "Description",
        cell: (info) => <span className="text-sm text-gray-600 dark:text-gray-400">{info.getValue()}</span>,
        enableSorting: false,
        enableColumnFilter: true,
      }),
      columnHelper.accessor("category", {
        header: "Category",
        cell: (info) => (
          <span className="border border-gray-300 px-2 py-1 text-xs dark:border-gray-700">{info.getValue()}</span>
        ),
        enableSorting: true,
        enableColumnFilter: true,
      }),
      columnHelper.accessor("pricing", {
        header: "Pricing",
        cell: (info) => (
          <span className="border border-gray-300 px-2 py-1 text-xs dark:border-gray-700">{info.getValue()}</span>
        ),
        enableSorting: true,
        enableColumnFilter: true,
      }),
      columnHelper.accessor("worthIt", {
        header: "Recommended",
        cell: (info) => (
          <span
            className={`px-2 py-1 text-xs font-bold ${
              info.getValue()
                ? "border border-black bg-white dark:border-white dark:bg-black"
                : "border border-gray-400 text-gray-600 dark:border-gray-600 dark:text-gray-400"
            }`}
          >
            {info.getValue() ? "✓" : "−"}
          </span>
        ),
        enableSorting: true,
        enableColumnFilter: true,
      }),
    ],
    []
  );

  const table = useReactTable({
    data: tools,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const searchableValue = `${row.original.title} ${row.original.description}`.toLowerCase();
      return searchableValue.includes((filterValue as string).toLowerCase());
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const categoryOptions = Array.from(new Set(tools.map((t) => t.category)));
  const pricingOptions = Array.from(new Set(tools.map((t) => t.pricing)));

  return (
    <div className="space-y-0">
      {/* Controls */}
      <div className="border border-gray-300 p-3 dark:border-gray-700 border-b-0">
        <div className="grid gap-2 grid-cols-1 md:grid-cols-5">
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
              updateUrl(columnFilters, sorting, e.target.value);
            }}
            placeholder="Search..."
            className="border border-gray-300 bg-white px-2 py-1 text-xs dark:border-gray-700 dark:bg-black"
          />
          <select
            value={
              (table.getColumn("category")?.getFilterValue() as string) || ""
            }
            onChange={(e) => {
              const value = e.target.value || undefined;
              table.getColumn("category")?.setFilterValue(value);
              updateUrl(
                columnFilters.filter((f) => f.id !== "category").concat(
                  value ? { id: "category", value } : {} as ColumnFiltersState[0]
                ),
                sorting,
                globalFilter
              );
            }}
            className="border border-gray-300 bg-white px-2 py-1 text-xs dark:border-gray-700 dark:bg-black"
          >
            <option value="">Category</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={
              (table.getColumn("pricing")?.getFilterValue() as string) || ""
            }
            onChange={(e) => {
              const value = e.target.value || undefined;
              table.getColumn("pricing")?.setFilterValue(value);
              updateUrl(
                columnFilters.filter((f) => f.id !== "pricing").concat(
                  value ? { id: "pricing", value } : {} as ColumnFiltersState[0]
                ),
                sorting,
                globalFilter
              );
            }}
            className="border border-gray-300 bg-white px-2 py-1 text-xs dark:border-gray-700 dark:bg-black"
          >
            <option value="">Pricing</option>
            {pricingOptions.map((price) => (
              <option key={price} value={price}>
                {price}
              </option>
            ))}
          </select>

          <select
            value={
              (table.getColumn("worthIt")?.getFilterValue() as string) || ""
            }
            onChange={(e) => {
              const value = e.target.value;
              const boolValue = value === "" ? undefined : value === "true";
              table.getColumn("worthIt")?.setFilterValue(boolValue);
              updateUrl(
                columnFilters.filter((f) => f.id !== "worthIt").concat(
                  value ? { id: "worthIt", value: boolValue } : {} as ColumnFiltersState[0]
                ),
                sorting,
                globalFilter
              );
            }}
            className="border border-gray-300 bg-white px-2 py-1 text-xs dark:border-gray-700 dark:bg-black"
          >
            <option value="">Recommended</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>

          <select
            value={sorting[0]?.id || "title"}
            onChange={(e) => {
              const newSort = [{ id: e.target.value, desc: false }];
              setSorting(newSort);
              updateUrl(columnFilters, newSort, globalFilter);
            }}
            className="border border-gray-300 bg-white px-2 py-1 text-xs dark:border-gray-700 dark:bg-black"
          >
            <option value="title">Sort: Title</option>
            <option value="category">Sort: Category</option>
            <option value="pricing">Sort: Pricing</option>
            <option value="worthIt">Sort: Recommended</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400 px-3 py-2 border border-gray-300 border-t-0 dark:border-gray-700">
        {table.getRowModel().rows.length} result{table.getRowModel().rows.length === 1 ? "" : "s"}
      </p>

      {/* Table */}
      {table.getRowModel().rows.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No tools matched these filters.</p>
      ) : (
        <div className="w-full border border-gray-300 dark:border-gray-700 overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="border-r border-gray-300 px-4 py-3 text-left text-xs font-bold uppercase text-gray-900 dark:border-gray-700 dark:text-gray-100 last:border-r-0"
                    >
                      <div
                        className={header.column.getCanSort() ? "cursor-pointer select-none flex items-center gap-2" : ""}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <span className="ml-auto">
                            {header.column.getIsSorted() === "desc" ? (
                              <ChevronDown size={16} className="stroke-1" />
                            ) : header.column.getIsSorted() === "asc" ? (
                              <ChevronUp size={16} className="stroke-1" />
                            ) : (
                              <ChevronsUpDown size={16} className="stroke-1 text-gray-400 dark:text-gray-600" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-950">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="border-r border-gray-300 px-4 py-3 text-sm dark:border-gray-700 last:border-r-0"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
