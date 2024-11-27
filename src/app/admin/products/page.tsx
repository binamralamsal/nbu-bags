import { ComponentType, Suspense } from "react";

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

import { DATATABLE_PAGE_SIZE, productStatus } from "@/configs/constants";
import { ensureAdmin } from "@/features/auth/server/auth.query";
import {
  ProductsAllowedKeys,
  columns,
} from "@/features/products/components/products-columns";
import { getAllProducts } from "@/features/products/server/products.query";
import { ArchiveIcon, CircleCheckIcon, FileIcon } from "@/libs/lucide-client";
import { SearchParams } from "@/types";
import { zodTransformSortSearchParams } from "@/utils/zod-transform-sort-search-params";

export default async function AdminDashboardProducts({
  searchParams: rawSearchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await ensureAdmin({ redirect: true });
  const searchParams = searchParamsSchema.parse(await rawSearchParams);

  return (
    <AdminPageWrapper pageTitle="Products">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div className="space-y-2">
            <CardTitle>Products</CardTitle>
            <CardDescription>
              <p>Here are the list of products</p>
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/admin/products/new">Add new</Link>
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
            <ProductsTable searchParams={searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </AdminPageWrapper>
  );
}

async function ProductsTable({
  searchParams,
}: {
  searchParams: z.infer<typeof searchParamsSchema>;
}) {
  console.log(searchParams.status);
  const data = await getAllProducts(searchParams);

  return (
    <DataTable
      columns={columns}
      data={data.products}
      dataKey="products"
      filters={[{ accessorKey: "status", title: "Status", options: statuses }]}
      options={{
        pageCount: data.pageCount,
        initialState: {
          columnVisibility: { updatedAt: false },
          sorting: Object.entries(searchParams.sort).map(([key, value]) => ({
            desc: value === "desc",
            id: key,
          })),
        },
      }}
    />
  );
}

const productStatusIcons: Record<
  (typeof productStatus)[number],
  ComponentType<{ className?: string }>
> = {
  draft: FileIcon,
  active: CircleCheckIcon,
  archived: ArchiveIcon,
};

const statuses = productStatus.map((status) => ({
  value: status,
  label: status.charAt(0).toUpperCase() + status.slice(1),
  icon: productStatusIcons[status],
}));

const allowedKeys: ProductsAllowedKeys[] = [
  "id",
  "name",
  "status",
  "slug",
  "price",
  "category",
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
  status: z
    .string()
    .optional()
    .default("")
    .transform((value) =>
      value
        .split(".")
        .filter((val) =>
          productStatus.includes(val as (typeof productStatus)[number]),
        ),
    )
    .catch([]),
});
