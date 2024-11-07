import "server-only";

import { eq } from "drizzle-orm";
import { DatabaseError } from "pg";
import { z } from "zod";

import { db } from "@/libs/drizzle";
import { categoriesTable } from "@/libs/drizzle/schema";
import { InternalServerError } from "@/server/errors/internal-server-error";

import { newCategoryDTO } from "./products.dtos";

export async function addCategoryDB(data: z.infer<typeof newCategoryDTO>) {
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

export async function updateCategoryDB(
  id: number,
  data: z.infer<typeof newCategoryDTO>,
) {
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
