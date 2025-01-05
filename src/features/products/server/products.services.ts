import "server-only";

import { NewCategorySchema, NewProductSchema } from "../products.schema";

import {
  and,
  asc,
  between,
  count,
  desc,
  eq,
  ilike,
  inArray,
  sql,
} from "drizzle-orm";
import { DatabaseError } from "pg";

import { productStatus } from "@/configs/constants";
import { InternalServerError } from "@/errors/internal-server-error";
import { db } from "@/libs/drizzle";
import {
  CategoriesTableSelectType,
  ProductsTableSelectType,
  categoriesTable,
  productFilesTable,
  productStatusEnum,
  productsTable,
  uploadedFilesTable,
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
          price: data.price,
          slug: data.slug,
          status: data.status,
          name: data.name,
          description: data.description,
          categoryId: data.categoryId,
          salePrice: data.salePrice,
        })
        .returning({ id: productsTable.id });

      const productFilesData = data.images.map((fileId) => ({
        productId: newProduct.id,
        fileId,
      }));

      if (productFilesData.length > 0)
        await trx.insert(productFilesTable).values(productFilesData);
    });
  } catch (err) {
    if (err instanceof DatabaseError && err.code === "23505") {
      throw new Error(
        "Product with that slug already exists. Please change it to something else",
      );
    }

    console.error(err);

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
          slug: data.slug,
          price: data.price,
          salePrice: data.salePrice,
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

type Image = {
  id: number;
  name: string;
  url: string;
  fileType: string;
  uploadedAt: string;
};

export async function getProductDB(id: number) {
  const [product] = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      price: productsTable.price,
      salePrice: productsTable.salePrice,
      slug: productsTable.slug,
      status: productsTable.status,
      description: productsTable.description,
      category: {
        name: categoriesTable.name,
        id: categoriesTable.id,
      },
      createdAt: productsTable.createdAt,
      updatedAt: productsTable.updatedAt,
      images: sql<Image[]>`COALESCE(
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', ${uploadedFilesTable.id},
          'name', ${uploadedFilesTable.name},
          'url', ${uploadedFilesTable.url},
          'fileType', ${uploadedFilesTable.fileType},
          'uploadedAt', ${uploadedFilesTable.uploadedAt}
        )
      ) FILTER (WHERE ${uploadedFilesTable.id} IS NOT NULL), '[]'
    )`,
    })
    .from(productsTable)
    .where(eq(productsTable.id, id))
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .leftJoin(
      productFilesTable,
      eq(productsTable.id, productFilesTable.productId),
    )
    .leftJoin(
      uploadedFilesTable,
      eq(uploadedFilesTable.id, productFilesTable.fileId),
    )
    .groupBy(productsTable.id, categoriesTable.id);

  return product;
}

export type GetAllProductsConfig = {
  page: number;
  pageSize: number;
  search?: string;
  categoriesSlugs?: string[];
  sort?: Partial<
    Record<"id" | "name" | "status" | "category" | "createdAt", "asc" | "desc">
  >;
  priceRange?: [number, number];
  status?: Partial<(typeof productStatus)[number]>[];
};

export async function getAllProductsDB(config: GetAllProductsConfig) {
  const { page, pageSize, search, sort, status, categoriesSlugs, priceRange } =
    config;
  const offset = (page - 1) * pageSize;

  const searchCondition = and(
    search ? ilike(productsTable.name, `%${search}%`) : undefined,
    status
      ? status.length > 0
        ? inArray(
            productsTable.status,
            status as typeof productStatusEnum.enumValues,
          )
        : undefined
      : undefined,
    categoriesSlugs && categoriesSlugs.length > 0
      ? inArray(categoriesTable.slug, categoriesSlugs)
      : undefined,
    priceRange
      ? between(productsTable.salePrice, priceRange[0], priceRange[1])
      : undefined,
  );

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
      price: productsTable.price,
      salePrice: productsTable.salePrice,
      slug: productsTable.slug,
      status: productsTable.status,
      category: categoriesTable.name,
      createdAt: productsTable.createdAt,
      updatedAt: productsTable.updatedAt,
      images: sql<Image[]>`COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', ${uploadedFilesTable.id},
            'name', ${uploadedFilesTable.name},
            'url', ${uploadedFilesTable.url},
            'fileType', ${uploadedFilesTable.fileType},
            'uploadedAt', ${uploadedFilesTable.uploadedAt}
          )
        ) FILTER (WHERE ${uploadedFilesTable.id} IS NOT NULL), '[]'
      )`,
    })
    .from(productsTable)
    .offset(offset)
    .where(searchCondition)
    .leftJoin(categoriesTable, eq(categoriesTable.id, productsTable.categoryId))
    .leftJoin(
      productFilesTable,
      eq(productsTable.id, productFilesTable.productId),
    )
    .leftJoin(
      uploadedFilesTable,
      eq(productFilesTable.fileId, uploadedFilesTable.id),
    )
    .orderBy(...orderBy)
    .groupBy(productsTable.id, categoriesTable.name);

  const [{ productsCount }] = await db
    .select({ productsCount: count() })
    .from(productsTable)
    .where(searchCondition)
    .leftJoin(
      categoriesTable,
      eq(categoriesTable.id, productsTable.categoryId),
    );

  const pageCount = Math.ceil(productsCount / pageSize);

  return {
    products,
    pageCount,
    currentPage: page,
  };
}

export async function deleteProductDB(id: number) {
  try {
    await db.delete(productsTable).where(eq(productsTable.id, id));
  } catch {
    throw new InternalServerError();
  }
}
