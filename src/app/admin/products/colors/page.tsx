import { Suspense } from "react";

import Link from "next/link";

import { AdminPageWrapper } from "@/components/admin-page-wrapper";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { z } from "zod";

import { DATATABLE_PAGE_SIZE } from "@/configs/constants";
import { ensureAdmin } from "@/features/auth/server/auth.query";
import {
  ColorsAllowedKeys,
  columns,
} from "@/features/products/components/colors-columns";
import { getAllColors } from "@/features/products/server/products.query";
import { SearchParams } from "@/types";
import { zodTransformSortSearchParams } from "@/utils/zod-transform-sort-search-params";

export default async function AdminDashboardColors({
  searchParams: rawSearchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await ensureAdmin({ redirect: true });
  const searchParams = searchParamsSchema.parse(await rawSearchParams);

  return (
    <AdminPageWrapper
      breadcrumbs={[{ label: "Products", href: "/admin/products" }]}
      pageTitle="Colors"
    >
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div className="space-y-2">
            <CardTitle>Colors</CardTitle>
            <CardDescription>
              <p>Here are the list of colors</p>
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/admin/products/colors/new">Add new</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={
              <DataTableSkeleton
                columnCount={5}
                searchableColumnCount={1}
                shrinkZero
              />
            }
          >
            <ColorsTable searchParams={searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </AdminPageWrapper>
  );
}

async function ColorsTable({
  searchParams,
}: {
  searchParams: z.infer<typeof searchParamsSchema>;
}) {
  const data = await getAllColors(searchParams);

  return (
    <DataTable
      columns={columns}
      data={data.colors}
      dataKey="colors"
      options={{
        pageCount: data.pageCount,
        initialState: {
          columnVisibility: { updatedAt: false },
          sorting: [{ desc: true, id: "createdAt" }],
        },
      }}
    />
  );
}

const allowedKeys: ColorsAllowedKeys[] = [
  "id",
  "name",
  "slug",
  "color",
  "createdAt",
  "updatedAt",
];

const searchParamsSchema = z.object({
  page: z.coerce.number().int().optional().default(1).catch(1),
  pageSize: z.coerce
    .number()
    .int()
    .optional()
    .default(DATATABLE_PAGE_SIZE)
    .catch(DATATABLE_PAGE_SIZE),
  search: z.string().optional(),
  sort: z
    .string()
    .optional()
    .default("createdAt.desc;")
    .transform(zodTransformSortSearchParams(allowedKeys))
    .catch({ createdAt: "desc" }),
});
