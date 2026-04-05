"use client";

import React, { useMemo, useState } from "react";
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
import type { WorkflowFrontmatter } from "@/lib/types";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

interface WorkflowsTableProps {
  workflows: WorkflowFrontmatter[];
}

const columnHelper = createColumnHelper<WorkflowFrontmatter>();

export function WorkflowsTable({ workflows }: WorkflowsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo(
    () => [
      columnHelper.accessor("title", {
        header: "Workflow",
        cell: (info) => {
          const workflow = info.row.original;
          return (
            <Link
              href={`/workflows/${workflow.slug}`}
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
      columnHelper.accessor("complexity", {
        header: "Complexity",
        cell: (info) => (
          <span className="border border-gray-300 px-2 py-1 text-xs dark:border-gray-700">{info.getValue()}</span>
        ),
        enableSorting: true,
        enableColumnFilter: true,
      }),
      columnHelper.accessor("author", {
        header: "Author",
        cell: (info) => <span className="text-sm text-gray-600 dark:text-gray-400">{info.getValue()}</span>,
        enableSorting: true,
        enableColumnFilter: true,
      }),
    ],
    []
  );

  const table = useReactTable({
    data: workflows,
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

  const complexityOptions = Array.from(new Set(workflows.map((w) => w.complexity)));

  return (
    <div className="space-y-0">
      {/* Controls */}
      <div className="border border-gray-300 p-3 dark:border-gray-700 border-b-0">
        <div className="grid gap-2 grid-cols-1 md:grid-cols-4">
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
            className="border border-gray-300 bg-white px-2 py-1 text-xs dark:border-gray-700 dark:bg-black"
          />
          <select
            value={
              (table.getColumn("complexity")?.getFilterValue() as string) || ""
            }
            onChange={(e) =>
              table.getColumn("complexity")?.setFilterValue(e.target.value || undefined)
            }
            className="border border-gray-300 bg-white px-2 py-1 text-xs dark:border-gray-700 dark:bg-black"
          >
            <option value="">Complexity</option>
            {complexityOptions.map((complexity) => (
              <option key={complexity} value={complexity}>
                {complexity}
              </option>
            ))}
          </select>

          <select
            value={
              (table.getColumn("author")?.getFilterValue() as string) || ""
            }
            onChange={(e) =>
              table.getColumn("author")?.setFilterValue(e.target.value || undefined)
            }
            className="border border-gray-300 bg-white px-2 py-1 text-xs dark:border-gray-700 dark:bg-black"
          >
            <option value="">Author</option>
          </select>

          <select
            value={sorting[0]?.id || "title"}
            onChange={(e) => {
              table.getColumn(e.target.value)?.toggleSorting(false);
            }}
            className="border border-gray-300 bg-white px-2 py-1 text-xs dark:border-gray-700 dark:bg-black"
          >
            <option value="title">Sort: Title</option>
            <option value="complexity">Sort: Complexity</option>
            <option value="author">Sort: Author</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400 px-3 py-2 border border-gray-300 border-t-0 dark:border-gray-700">
        {table.getRowModel().rows.length} result{table.getRowModel().rows.length === 1 ? "" : "s"}
      </p>

      {/* Table */}
      {table.getRowModel().rows.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No workflows matched these filters.</p>
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
