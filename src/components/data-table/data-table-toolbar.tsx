"use client";

import { FormEvent, useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Table } from "@tanstack/react-table";
import { SearchIcon } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  dataKey?: string;
}

export function DataTableToolbar<TData>({
  table,
  dataKey = "data",
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
    <div className="flex items-center justify-between">
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
      <DataTableViewOptions table={table} />
    </div>
  );
}
