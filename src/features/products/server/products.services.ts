import "server-only";

import {
  NewCategorySchema,
  NewColorSchema,
  NewProductSchema,
  NewSizeSchema,
} from "../products.schema";

import {
  SQL,
  and,
  asc,
  between,
  count,
  desc,
  eq,
  ilike,
  inArray,
  or,
  sql,
} from "drizzle-orm";
import { DatabaseError } from "pg";

import { productStatus } from "@/configs/constants";
import { InternalServerError } from "@/errors/internal-server-error";
import { db } from "@/libs/drizzle";
import {
  CategoriesTableSelectType,
  ColorsTableSelectType,
  ProductsTableSelectType,
  SizesTableSelectType,
  categoriesTable,
  colorsTable,
  productFilesTable,
  productSizesTable,
  productStatusEnum,
  productsTable,
  sizesTable,
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
  return (
    await db.select().from(categoriesTable).where(eq(categoriesTable.id, id))
  )[0];
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

export async function addSizeDB(data: NewSizeSchema) {
  try {
    await db.insert(sizesTable).values({
      name: data.name,
      slug: data.slug,
    });
  } catch (err) {
    if (err instanceof DatabaseError && err.code === "23505") {
      throw new Error(
        "Size with that slug already exists. Please change it to something else",
      );
    }

    throw new InternalServerError();
  }
}

export async function updateSizeDB(id: number, data: NewSizeSchema) {
  try {
    await db
      .update(sizesTable)
      .set({
        name: data.name,
        slug: data.slug,
      })
      .where(eq(sizesTable.id, id));
  } catch {
    throw new InternalServerError();
  }
}

export async function deleteSizeDB(id: number) {
  try {
    await db.delete(sizesTable).where(eq(sizesTable.id, id));
  } catch {
    throw new InternalServerError();
  }
}

export async function getSizeDB(id: number) {
  return (await db.select().from(sizesTable).where(eq(sizesTable.id, id)))[0];
}

export type GetAllSizesConfig = {
  page: number;
  pageSize: number;
  search?: string;
  sort?: Partial<Record<"id" | "name" | "slug" | "createdAt", "asc" | "desc">>;
};

export async function getAllSizesDB(config: GetAllSizesConfig) {
  const { page, pageSize, search, sort } = config;
  const offset = (page - 1) * pageSize;

  const searchCondition = search
    ? ilike(sizesTable.name, `%${search}%`)
    : undefined;

  const orderBy = sort
    ? Object.entries(sort).map(([key, direction]) =>
        direction === "desc"
          ? desc(sizesTable[key as keyof SizesTableSelectType])
          : asc(sizesTable[key as keyof SizesTableSelectType]),
      )
    : [desc(sizesTable.createdAt)];

  const sizes = await db
    .select()
    .from(sizesTable)
    .offset(offset)
    .where(searchCondition)
    .orderBy(...orderBy);

  const [{ sizesCount }] = await db
    .select({ sizesCount: count() })
    .from(sizesTable)
    .where(searchCondition);

  const pageCount = Math.ceil(sizesCount / pageSize);

  return {
    sizes,
    pageCount,
  };
}

export async function addColorDB(data: NewColorSchema) {
  try {
    await db.insert(colorsTable).values({
      name: data.name,
      color: data.color,
      slug: data.slug,
    });
  } catch (err) {
    if (err instanceof DatabaseError && err.code === "23505") {
      throw new Error(
        "Size with that slug already exists. Please change it to something else",
      );
    }

    throw new InternalServerError();
  }
}

export async function updateColorDB(id: number, data: NewColorSchema) {
  try {
    await db
      .update(colorsTable)
      .set({
        name: data.name,
        color: data.color,
        slug: data.slug,
      })
      .where(eq(colorsTable.id, id));
  } catch {
    throw new InternalServerError();
  }
}

export async function deleteColorDB(id: number) {
  try {
    await db.delete(colorsTable).where(eq(colorsTable.id, id));
  } catch {
    throw new InternalServerError();
  }
}

export async function getColorDB(id: number) {
  return (await db.select().from(colorsTable).where(eq(colorsTable.id, id)))[0];
}

export type GetAllColorsConfig = {
  page: number;
  pageSize: number;
  search?: string;
  sort?: Partial<
    Record<"id" | "name" | "slug" | "color" | "createdAt", "asc" | "desc">
  >;
};

export async function getAllColorsDB(config: GetAllColorsConfig) {
  const { page, pageSize, search, sort } = config;
  const offset = (page - 1) * pageSize;

  const searchCondition = search
    ? or(
        ilike(colorsTable.name, `%${search}%`),
        ilike(colorsTable.color, `%${search}%`),
      )
    : undefined;

  const orderBy = sort
    ? Object.entries(sort).map(([key, direction]) =>
        direction === "desc"
          ? desc(colorsTable[key as keyof ColorsTableSelectType])
          : asc(colorsTable[key as keyof ColorsTableSelectType]),
      )
    : [desc(colorsTable.createdAt)];

  const colors = await db
    .select()
    .from(colorsTable)
    .offset(offset)
    .where(searchCondition)
    .orderBy(...orderBy);

  const [{ colorsCount }] = await db
    .select({ colorsCount: count() })
    .from(colorsTable)
    .where(searchCondition);

  const pageCount = Math.ceil(colorsCount / pageSize);

  return {
    colors,
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

      const productSizesData = data.sizes.map((sizeId) => ({
        productId: newProduct.id,
        sizeId,
      }));

      if (productSizesData.length > 0)
        await trx.insert(productSizesTable).values(productSizesData);
    });
  } catch (err) {
    if (err instanceof DatabaseError && err.code === "23505") {
      throw new Error(
        "Product with that slug already exists. Please change it to something else",
      );
    }

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
            fileId,
          })),
        );
      }

      await tx
        .delete(productSizesTable)
        .where(eq(productSizesTable.productId, id));

      if (data.sizes.length > 0) {
        await tx.insert(productSizesTable).values(
          data.sizes.map((sizeId) => ({
            productId: id,
            sizeId,
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

export async function getProductQuery(condition: SQL<unknown>) {
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
        slug: categoriesTable.slug,
      },
      createdAt: productsTable.createdAt,
      updatedAt: productsTable.updatedAt,
      images: sql<Image[]>`(
        SELECT COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', ${uploadedFilesTable.id},
              'name', ${uploadedFilesTable.name},
              'url', ${uploadedFilesTable.url},
              'fileType', ${uploadedFilesTable.fileType},
              'uploadedAt', ${uploadedFilesTable.uploadedAt}
            )
          ) FILTER (WHERE ${uploadedFilesTable.id} IS NOT NULL), '[]'
        )
        FROM ${uploadedFilesTable}
        JOIN ${productFilesTable}
        ON ${uploadedFilesTable.id} = ${productFilesTable.fileId}
        WHERE ${productFilesTable.productId} = ${productsTable.id}
      )`,
      sizes: sql<{ id: number; name: string; slug: string }[]>`(
        SELECT COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', ${sizesTable.id},
              'name', ${sizesTable.name},
              'slug', ${sizesTable.slug}
            )
          ) FILTER (WHERE ${sizesTable.id} IS NOT NULL), '[]'
        )
        FROM ${sizesTable}
        JOIN ${productSizesTable}
        ON ${sizesTable.id} = ${productSizesTable.sizeId}
        WHERE ${productSizesTable.productId} = ${productsTable.id}
      )`,
    })
    .from(productsTable)
    .where(condition)
    .leftJoin(
      categoriesTable,
      eq(productsTable.categoryId, categoriesTable.id),
    );

  return product;
}

export async function getProductDB(id: number) {
  return getProductQuery(eq(productsTable.id, id));
}

export async function getProductBySlugDB(slug: string) {
  return getProductQuery(eq(productsTable.slug, slug));
}

export type GetAllProductsConfig = {
  page: number;
  pageSize: number;
  search?: string;
  categoriesSlugs?: string[];
  sizesSlugs?: string[];
  sort?: Partial<
    Record<"id" | "name" | "status" | "category" | "createdAt", "asc" | "desc">
  >;
  priceRange?: [number, number];
  status?: Partial<(typeof productStatus)[number]>[];
};

export async function getAllProductsDB(config: GetAllProductsConfig) {
  const {
    page,
    pageSize,
    search,
    sort,
    status,
    categoriesSlugs,
    priceRange,
    sizesSlugs,
  } = config;
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
    sizesSlugs && sizesSlugs.length > 0
      ? inArray(sizesTable.slug, sizesSlugs)
      : undefined,
    priceRange
      ? or(
          between(productsTable.salePrice, priceRange[0], priceRange[1]),
          between(productsTable.price, priceRange[0], priceRange[1]),
        )
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
      images: sql<Image[]>`(
        SELECT COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', ${uploadedFilesTable.id},
              'name', ${uploadedFilesTable.name},
              'url', ${uploadedFilesTable.url},
              'fileType', ${uploadedFilesTable.fileType},
              'uploadedAt', ${uploadedFilesTable.uploadedAt}
            )
          ) FILTER (WHERE ${uploadedFilesTable.id} IS NOT NULL), '[]'
        )
        FROM ${uploadedFilesTable}
        JOIN ${productFilesTable}
        ON ${uploadedFilesTable.id} = ${productFilesTable.fileId}
        WHERE ${productFilesTable.productId} = ${productsTable.id}
      )`,
    })
    .from(productsTable)
    .offset(offset)
    .where(searchCondition)
    .leftJoin(categoriesTable, eq(categoriesTable.id, productsTable.categoryId))
    .leftJoin(
      productSizesTable,
      eq(productsTable.id, productSizesTable.productId),
    )
    .leftJoin(sizesTable, eq(sizesTable.id, productSizesTable.sizeId))
    .orderBy(...orderBy)
    .groupBy(productsTable.id, categoriesTable.name);

  const [{ productsCount }] = await db
    .select({ productsCount: count() })
    .from(productsTable)
    .where(searchCondition)
    .leftJoin(
      productSizesTable,
      eq(productsTable.id, productSizesTable.productId),
    )
    .leftJoin(sizesTable, eq(sizesTable.id, productSizesTable.sizeId))
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
