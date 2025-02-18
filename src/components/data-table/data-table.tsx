"use client";

import { useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  ColumnDef,
  PaginationState,
  SortingState,
  TableOptions,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { DATATABLE_PAGE_SIZE } from "@/configs/constants";

export type FiltersOptionsType = {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export type FiltersType = {
  accessorKey: string;
  title: string;
  options: FiltersOptionsType[];
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  dataKey?: string;
  options?: Omit<TableOptions<TData>, "data" | "columns" | "getCoreRowModel">;
  filters?: FiltersType[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  dataKey,
  options,
  filters,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([
    ...(options?.initialState?.sorting || []),
  ]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DATATABLE_PAGE_SIZE,
  });

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    let sortParam = "";
    sorting.map((sortValue) => {
      sortParam += `${sortValue.id}.${sortValue.desc ? "desc" : "asc"};`;
    });

    if (!sortParam) return;
    params.set("sort", sortParam);
    router.push("?" + params.toString());
  }, [sorting, searchParams, router]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (pagination.pageIndex === 0) params.delete("page");
    else params.set("page", String(pagination.pageIndex + 1));

    if (pagination.pageSize === DATATABLE_PAGE_SIZE) params.delete("pageSize");
    else params.set("pageSize", String(pagination.pageSize));

    router.push("?" + params.toString());
  }, [pagination, router, searchParams]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    manualSorting: true,
    manualPagination: true,
    manualFiltering: true,
    state: {
      sorting,
      pagination,
    },
    enableMultiSort: false,
    ...options,
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} dataKey={dataKey} filters={filters} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
