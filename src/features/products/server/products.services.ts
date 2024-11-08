import "server-only";

import { eq } from "drizzle-orm";
import { DatabaseError } from "pg";

import { InternalServerError } from "@/errors/internal-server-error";
import { db } from "@/libs/drizzle";
import { categoriesTable } from "@/libs/drizzle/schema";

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

export async function getCategoryDB(id: number) {
  const category = await db.query.categoriesTable.findFirst({
    where: eq(categoriesTable.id, id),
  });

  return category;
}
