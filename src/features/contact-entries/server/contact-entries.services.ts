import "server-only";

import { NewContactEntrySchema } from "../contact-entries.schema";

import { asc, count, desc, eq, ilike, or } from "drizzle-orm";

import { InternalServerError } from "@/errors/internal-server-error";
import { db } from "@/libs/drizzle";
import {
  ContactEntriesSelectType,
  contactEntriesTable,
} from "@/libs/drizzle/schema";

export async function newContactEntryDB(data: NewContactEntrySchema) {
  try {
    await db.insert(contactEntriesTable).values(data);
  } catch {
    throw new InternalServerError();
  }
}

export type GetAllContactEntriesConfig = {
  page: number;
  pageSize: number;
  search?: string;
  sort?: Partial<
    Record<
      "id" | "name" | "email" | "phone" | "createdAt" | "updatedAt",
      "asc" | "desc"
    >
  >;
};
export async function getAllContactEntriesDB(
  config: GetAllContactEntriesConfig,
) {
  const { page, pageSize, search, sort } = config;
  const offset = (page - 1) * pageSize;

  const searchCondition = search
    ? or(
        ilike(contactEntriesTable.name, `%${search}%`),
        ilike(contactEntriesTable.email, `%${search}%`),
        ilike(contactEntriesTable.phone, `%${search}%`),
      )
    : undefined;

  const orderBy = sort
    ? Object.entries(sort).map(([key, direction]) =>
        direction === "desc"
          ? desc(contactEntriesTable[key as keyof ContactEntriesSelectType])
          : asc(contactEntriesTable[key as keyof ContactEntriesSelectType]),
      )
    : [desc(contactEntriesTable.createdAt)];

  const contactEntries = await db
    .select()
    .from(contactEntriesTable)
    .offset(offset)
    .where(searchCondition)
    .orderBy(...orderBy);

  const [{ contactEntriesCount }] = await db
    .select({ contactEntriesCount: count() })
    .from(contactEntriesTable)
    .where(searchCondition);

  const pageCount = Math.ceil(contactEntriesCount / pageSize);

  return { contactEntries, pageCount };
}

export async function deleteContactEntryDB(id: number) {
  try {
    await db.delete(contactEntriesTable).where(eq(contactEntriesTable.id, id));
  } catch {
    throw new InternalServerError();
  }
}
