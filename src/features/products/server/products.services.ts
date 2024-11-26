import "server-only";

import { NewCategorySchema, NewProductSchema } from "../products.schema";

import { asc, count, desc, eq, ilike } from "drizzle-orm";
import { DatabaseError } from "pg";

import { InternalServerError } from "@/errors/internal-server-error";
import { db } from "@/libs/drizzle";
import {
  CategoriesTableSelectType,
  ProductsTableSelectType,
  categoriesTable,
  productFilesTable,
  productsTable,
} from "@/libs/drizzle/schema";

export async function addCategoryDB(data: NewCategorySchema) {
  try {
    await db.insert(categoriesTable).values({
      name: data.name,
      slug: data.slug,
    });
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
    : [desc(categoriesTable.createdAt)];

  const categories = await db
    .select()
    .from(categoriesTable)
    .offset(offset)
    .where(searchCondition)
    .orderBy(...orderBy);

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

export async function addProductDB(data: NewProductSchema) {
  try {
    await db.transaction(async (trx) => {
      const [newProduct] = await trx
        .insert(productsTable)
        .values({
          slug: data.slug,
          status: data.status,
          name: data.name,
          description: data.description,
          categoryId: data.categoryId,
        })
        .returning({ id: productsTable.id });

      const productFilesData = data.images.map((fileId) => ({
        productId: newProduct.id,
        fileId,
      }));

      if (productFilesData.length > 0)
        await trx.insert(productFilesTable).values(productFilesData);
    });
  } catch {
    // if (err instanceof DatabaseError && err.code === "23505") {
    //   throw new Error(
    //     "Category with that slug already exists. Please change it to something else",
    //   );
    // }

    throw new InternalServerError();
  }
}

export async function updateProductDB(id: number, data: NewProductSchema) {
  try {
    await db.transaction(async (tx) => {
      await tx
        .update(productsTable)
        .set({
          status: data.status,
          name: data.name,
          description: data.description,
          categoryId: data.categoryId,
        })
        .where(eq(productsTable.id, id));

      await tx
        .delete(productFilesTable)
        .where(eq(productFilesTable.productId, id));

      if (data.images.length > 0) {
        await tx.insert(productFilesTable).values(
          data.images.map((fileId) => ({
            productId: id,
            fileId: fileId,
          })),
        );
      }
    });
  } catch {
    throw new InternalServerError();
  }
}

export async function getProductDB(id: number) {
  const product = await db.query.productsTable.findFirst({
    where: eq(productsTable.id, id),
    with: {
      productsToFiles: {
        with: {
          file: true,
        },
      },
    },
  });

  if (!product) return undefined;

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    categoryId: product.categoryId,
    status: product.status,
    slug: product.slug,
    images: product.productsToFiles.map(({ file }) => ({
      id: file.id,
      name: file.name,
      fileType: file.fileType,
      url: file.url,
    })),
  };
}

export type GetAllProductsConfig = {
  page: number;
  pageSize: number;
  search?: string;
  sort?: Partial<
    Record<"id" | "name" | "status" | "category" | "createdAt", "asc" | "desc">
  >;
};

export async function getAllProductsDB(config: GetAllProductsConfig) {
  const { page, pageSize, search, sort } = config;
  const offset = (page - 1) * pageSize;

  const searchCondition = search
    ? ilike(productsTable.name, `%${search}%`)
    : undefined;

  const orderBy = sort
    ? Object.entries(sort).map(([key, direction]) =>
        direction === "desc"
          ? key === "category"
            ? desc(categoriesTable.name)
            : desc(productsTable[key as keyof ProductsTableSelectType])
          : key === "category"
            ? asc(categoriesTable.name)
            : asc(productsTable[key as keyof ProductsTableSelectType]),
      )
    : [desc(productsTable.createdAt)];

  const products = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      slug: productsTable.slug,
      status: productsTable.status,
      category: categoriesTable.name,
      createdAt: productsTable.createdAt,
      updatedAt: productsTable.updatedAt,
    })
    .from(productsTable)
    .offset(offset)
    .where(searchCondition)
    .leftJoin(categoriesTable, eq(categoriesTable.id, productsTable.categoryId))
    .orderBy(...orderBy);
  const [{ productsCount }] = await db
    .select({ productsCount: count() })
    .from(productsTable)
    .where(searchCondition);

  const pageCount = Math.ceil(productsCount / pageSize);

  return {
    products,
    pageCount,
  };
}

export async function deleteProductDB(id: number) {
  try {
    await db.delete(productsTable).where(eq(productsTable.id, id));
  } catch {
    throw new InternalServerError();
  }
}
