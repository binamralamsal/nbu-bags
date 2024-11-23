import "server-only";

import { asc, count, desc, eq, ilike } from "drizzle-orm";
import { DatabaseError } from "pg";

import { InternalServerError } from "@/errors/internal-server-error";
import { db } from "@/libs/drizzle";
import {
  CategoriesTableSelectType,
  categoriesTable,
} from "@/libs/drizzle/schema";

import { NewCategorySchema } from "../products.schema";

export async function addCategoryDB(data: NewCategorySchema) {
  try {
    const [category] = await db
      .insert(categoriesTable)
      .values({
        name: data.name,
        slug: data.slug,
      })
      .returning();

    return category;
  } catch (err) {
    if (err instanceof DatabaseError && err.code === "23505") {
      throw new Error(
        "Category with that slug already exists. Please change it to something else",
      );
    }

    throw new InternalServerError();
  }
}

export async function updateCategoryDB(id: number, data: NewCategorySchema) {
  try {
    await db
      .update(categoriesTable)
      .set({
        name: data.name,
        slug: data.slug,
      })
      .where(eq(categoriesTable.id, id));
  } catch {
    throw new InternalServerError();
  }
}

export async function deleteCategoryDB(id: number) {
  try {
    await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
  } catch {
    throw new InternalServerError();
  }
}

export async function getCategoryDB(id: number) {
  const category = await db.query.categoriesTable.findFirst({
    where: eq(categoriesTable.id, id),
  });

  return category;
}

export type GetAllCategoriesConfig = {
  page: number;
  pageSize: number;
  search?: string;
  sort?: Partial<Record<"id" | "name" | "slug" | "createdAt", "asc" | "desc">>;
};

export async function getAllCategoriesDB(config: GetAllCategoriesConfig) {
  const { page, pageSize, search, sort } = config;
  const offset = (page - 1) * pageSize;

  const searchCondition = search
    ? ilike(categoriesTable.name, `%${search}%`)
    : undefined;

  const orderBy = sort
    ? Object.entries(sort).map(([key, direction]) =>
        direction === "desc"
          ? desc(categoriesTable[key as keyof CategoriesTableSelectType])
          : asc(categoriesTable[key as keyof CategoriesTableSelectType]),
      )
    : undefined;

  const categories = await db.query.categoriesTable.findMany({
    limit: pageSize,
    offset,
    where: searchCondition,
    orderBy,
  });

  const [{ categoriesCount }] = await db
    .select({ categoriesCount: count() })
    .from(categoriesTable)
    .where(searchCondition);

  const pageCount = Math.ceil(categoriesCount / pageSize);

  return {
    categories,
    pageCount,
  };
}
