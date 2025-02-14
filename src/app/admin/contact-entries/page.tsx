import { Suspense } from "react";

import { AdminPageWrapper } from "@/components/admin-page-wrapper";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
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
  ContactEntryAllowedKeys,
  columns,
} from "@/features/contact-entries/components/contact-entries-columns";
import { getAllContactEntries } from "@/features/contact-entries/server/contact-entries.query";
import { SearchParams } from "@/types";
import { zodTransformSortSearchParams } from "@/utils/zod-transform-sort-search-params";

export default async function AdminContactEntriesPage({
  searchParams: rawSearchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await ensureAdmin({ redirect: true });
  const searchParams = searchParamsSchema.parse(await rawSearchParams);

  return (
    <AdminPageWrapper pageTitle="Contact Entries">
      {" "}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div className="space-y-2">
            <CardTitle>Contact Entries</CardTitle>
            <CardDescription>
              <p>Here are the list of contact entries</p>
            </CardDescription>
          </div>
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
            <ContactEntriesTable searchParams={searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </AdminPageWrapper>
  );
}

async function ContactEntriesTable({
  searchParams,
}: {
  searchParams: z.infer<typeof searchParamsSchema>;
}) {
  const data = await getAllContactEntries(searchParams);

  return (
    <DataTable
      columns={columns}
      data={data.contactEntries}
      dataKey="contact entries"
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

const allowedKeys: ContactEntryAllowedKeys[] = [
  "id",
  "name",
  "email",
  "phone",
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
