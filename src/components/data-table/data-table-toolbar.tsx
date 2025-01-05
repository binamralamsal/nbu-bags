"use client";

import { FormEvent, Fragment, useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FiltersType } from "./data-table";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

import { Table } from "@tanstack/react-table";
import { SearchIcon } from "lucide-react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  dataKey?: string;
  filters?: FiltersType[];
}

export function DataTableToolbar<TData>({
  table,
  dataKey = "data",
  filters,
}: DataTableToolbarProps<TData>) {
  const [query, setQuery] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const value = searchParams.get("search");
    if (value) setQuery(value);
  }, [searchParams]);

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (!query) params.delete("search");
    else params.set("search", query);

    router.push("?" + params.toString());
  }

  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <form
          className="flex flex-1 items-center space-x-2"
          onSubmit={handleSearchSubmit}
        >
          <Input
            placeholder={`Search ${dataKey}`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 w-[150px] lg:w-[350px]"
          />
          <Button size="icon">
            <SearchIcon />
          </Button>
        </form>

        {filters?.map((filter) => (
          <Fragment key={filter.accessorKey}>
            {table.getColumn(filter.accessorKey) && (
              <DataTableFacetedFilter
                column={table.getColumn(filter.accessorKey)}
                title={filter.title}
                options={filter.options}
              />
            )}
          </Fragment>
        ))}
      </div>

      <DataTableViewOptions table={table} />
    </div>
  );
}
