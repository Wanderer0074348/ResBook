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
import { getWorkflowReadiness, type WorkflowReadinessTier } from "@/lib/workflowReadiness";
import { ReadinessBadge } from "@/components/workflows/ReadinessBadge";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

interface WorkflowsTableProps {
  workflows: WorkflowFrontmatter[];
}

type WorkflowRow = WorkflowFrontmatter & {
  readinessScore: number;
  readinessTier: WorkflowReadinessTier;
  estimatedHours: number;
  toolCount: number;
};

const columnHelper = createColumnHelper<WorkflowRow>();

const readinessOptions: WorkflowReadinessTier[] = ["High", "Medium", "Low"];

export function WorkflowsTable({ workflows }: WorkflowsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "readinessScore", desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const workflowRows = useMemo<WorkflowRow[]>(
    () =>
      workflows.map((workflow) => {
        const readiness = getWorkflowReadiness(workflow);

        return {
          ...workflow,
          readinessScore: readiness.score,
          readinessTier: readiness.tier,
          estimatedHours: readiness.inputs.estimatedHours,
          toolCount: workflow.toolsUsed.length,
        };
      }),
    [workflows]
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("title", {
        header: "Workflow",
        cell: (info) => {
          const workflow = info.row.original;
          return (
            <div>
              <Link
                href={`/workflows/${workflow.slug}`}
                className="font-bold text-black dark:text-white hover:underline"
              >
                {info.getValue()}
              </Link>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{workflow.description}</p>
            </div>
          );
        },
        enableSorting: true,
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
      columnHelper.accessor("readinessScore", {
        header: "Readiness",
        cell: (info) => {
          const workflow = info.row.original;

          return (
            <div className="space-y-2">
              <ReadinessBadge score={workflow.readinessScore} tier={workflow.readinessTier} />
              <div className="h-1.5 w-24 overflow-hidden rounded bg-gray-200 dark:bg-gray-800">
                <div
                  className={`h-full ${
                    workflow.readinessTier === "High"
                      ? "bg-emerald-500"
                      : workflow.readinessTier === "Medium"
                        ? "bg-amber-500"
                        : "bg-rose-500"
                  }`}
                  style={{ width: `${workflow.readinessScore}%` }}
                />
              </div>
            </div>
          );
        },
        enableSorting: true,
        enableColumnFilter: false,
      }),
      columnHelper.accessor("estimatedHours", {
        header: "Est. Time",
        cell: (info) => <span className="text-xs font-semibold">{Math.round(info.getValue())}h</span>,
        enableSorting: true,
        enableColumnFilter: false,
      }),
      columnHelper.accessor("toolsUsed", {
        header: "Tools",
        cell: (info) => {
          const tools = info.getValue();

          if (tools.length === 0) {
            return <span className="text-xs text-gray-500 dark:text-gray-400">None listed</span>;
          }

          return (
            <div className="flex flex-wrap gap-1.5">
              {tools.slice(0, 3).map((toolSlug) => (
                <Link
                  key={toolSlug}
                  href={`/tools/${toolSlug}`}
                  className="border border-gray-300 px-2 py-1 text-[11px] dark:border-gray-700"
                >
                  {toolSlug}
                </Link>
              ))}
              {tools.length > 3 && (
                <span className="border border-gray-200 px-2 py-1 text-[11px] text-gray-600 dark:border-gray-700 dark:text-gray-400">
                  +{tools.length - 3}
                </span>
              )}
            </div>
          );
        },
        enableSorting: true,
        enableColumnFilter: true,
        sortingFn: (rowA, rowB) => rowA.original.toolCount - rowB.original.toolCount,
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) {
            return true;
          }

          const tools = row.getValue(columnId) as string[];
          return tools.includes(filterValue as string);
        },
      }),
      columnHelper.accessor("readinessTier", {
        header: "Readiness Tier",
        cell: () => null,
        enableSorting: false,
        enableColumnFilter: true,
        filterFn: "equalsString",
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
    data: workflowRows,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility: {
        readinessTier: false,
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, filterValue) => {
      const searchableValue = `${row.original.title} ${row.original.description} ${row.original.author} ${row.original.complexity} ${row.original.toolsUsed.join(" ")}`.toLowerCase();
      return searchableValue.includes((filterValue as string).toLowerCase());
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const complexityOptions = Array.from(new Set(workflows.map((w) => w.complexity)));
  const authorOptions = Array.from(new Set(workflows.map((w) => w.author))).sort((a, b) => a.localeCompare(b));
  const toolOptions = Array.from(new Set(workflows.flatMap((w) => w.toolsUsed))).sort((a, b) => a.localeCompare(b));

  const filteredRows = table.getRowModel().rows;
  const averageReadiness =
    filteredRows.length === 0
      ? 0
      : Math.round(
          filteredRows.reduce((sum, row) => sum + row.original.readinessScore, 0) /
            filteredRows.length
        );
  const averageHours =
    filteredRows.length === 0
      ? 0
      : Math.round(
          (filteredRows.reduce((sum, row) => sum + row.original.estimatedHours, 0) /
            filteredRows.length) *
            10
        ) / 10;

  const topTools = useMemo(() => {
    const toolCounts = new Map<string, number>();

    filteredRows.forEach((row) => {
      row.original.toolsUsed.forEach((toolSlug) => {
        toolCounts.set(toolSlug, (toolCounts.get(toolSlug) ?? 0) + 1);
      });
    });

    return Array.from(toolCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [filteredRows]);

  const maxToolUsage = topTools.length > 0 ? topTools[0][1] : 1;

  function setSort(value: string) {
    const [id, direction] = value.split(":");
    setSorting([{ id, desc: direction === "desc" }]);
  }

  function clearFilters() {
    setGlobalFilter("");
    setColumnFilters([]);
  }

  return (
    <div className="space-y-0">
      <div className="mb-4 grid gap-3 md:grid-cols-4">
        <div className="border border-gray-300 p-3 dark:border-gray-700">
          <p className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Visible workflows</p>
          <p className="mt-2 text-2xl font-bold">{filteredRows.length}</p>
        </div>
        <div className="border border-gray-300 p-3 dark:border-gray-700">
          <p className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Avg readiness</p>
          <p className="mt-2 text-2xl font-bold">{averageReadiness}</p>
        </div>
        <div className="border border-gray-300 p-3 dark:border-gray-700">
          <p className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Avg time</p>
          <p className="mt-2 text-2xl font-bold">{averageHours}h</p>
        </div>
        <div className="border border-gray-300 p-3 dark:border-gray-700">
          <p className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Tool coverage</p>
          <p className="mt-2 text-2xl font-bold">{new Set(filteredRows.flatMap((row) => row.original.toolsUsed)).size}</p>
        </div>
      </div>

      <div className="mb-4 border border-gray-300 p-4 dark:border-gray-700">
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Most used tools in results</p>
          <button
            type="button"
            onClick={clearFilters}
            className="border border-gray-300 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide dark:border-gray-700"
          >
            Clear filters
          </button>
        </div>
        {topTools.length === 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-400">No tools available for the current filter set.</p>
        ) : (
          <div className="space-y-2">
            {topTools.map(([toolSlug, count]) => (
              <div key={toolSlug} className="grid grid-cols-[minmax(0,120px)_1fr_auto] items-center gap-3">
                <Link href={`/tools/${toolSlug}`} className="truncate text-xs font-semibold hover:underline">
                  {toolSlug}
                </Link>
                <div className="h-2 overflow-hidden rounded bg-gray-200 dark:bg-gray-800">
                  <div
                    className="h-full bg-black dark:bg-white"
                    style={{ width: `${Math.max(8, Math.round((count / maxToolUsage) * 100))}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="border border-gray-300 p-3 dark:border-gray-700 border-b-0">
        <div className="grid gap-2 grid-cols-1 md:grid-cols-6">
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search title, description, author, tools..."
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
              (table.getColumn("readinessTier")?.getFilterValue() as string) || ""
            }
            onChange={(e) =>
              table.getColumn("readinessTier")?.setFilterValue(e.target.value || undefined)
            }
            className="border border-gray-300 bg-white px-2 py-1 text-xs dark:border-gray-700 dark:bg-black"
          >
            <option value="">Readiness</option>
            {readinessOptions.map((tier) => (
              <option key={tier} value={tier}>
                {tier}
              </option>
            ))}
          </select>

          <select
            value={
              (table.getColumn("toolsUsed")?.getFilterValue() as string) || ""
            }
            onChange={(e) =>
              table.getColumn("toolsUsed")?.setFilterValue(e.target.value || undefined)
            }
            className="border border-gray-300 bg-white px-2 py-1 text-xs dark:border-gray-700 dark:bg-black"
          >
            <option value="">Tool</option>
            {toolOptions.map((toolSlug) => (
              <option key={toolSlug} value={toolSlug}>
                {toolSlug}
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
            {authorOptions.map((author) => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
          </select>

          <select
            value={sorting[0] ? `${sorting[0].id}:${sorting[0].desc ? "desc" : "asc"}` : "readinessScore:desc"}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-300 bg-white px-2 py-1 text-xs dark:border-gray-700 dark:bg-black"
          >
            <option value="readinessScore:desc">Sort: Readiness (High)</option>
            <option value="readinessScore:asc">Sort: Readiness (Low)</option>
            <option value="estimatedHours:asc">Sort: Fastest First</option>
            <option value="estimatedHours:desc">Sort: Longest First</option>
            <option value="title:asc">Sort: Title</option>
            <option value="complexity:asc">Sort: Complexity</option>
            <option value="author:asc">Sort: Author</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400 px-3 py-2 border border-gray-300 border-t-0 dark:border-gray-700">
        {filteredRows.length} result{filteredRows.length === 1 ? "" : "s"}
      </p>

      {/* Table */}
      {filteredRows.length === 0 ? (
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
              {filteredRows.map((row) => (
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
