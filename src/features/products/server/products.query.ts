import "server-only";

import { cache } from "react";

import {
  GetAllCategoriesConfig,
  GetAllProductsConfig,
  getAllCategoriesDB,
  getAllProductsDB,
  getCategoryDB,
  getProductBySlugDB,
  getProductDB,
} from "./products.services";

export const getCategory = cache(async (id: number) => {
  return await getCategoryDB(id);
});

export const getAllCategories = cache(
  async (config: GetAllCategoriesConfig) => {
    return await getAllCategoriesDB(config);
  },
);

export const getProduct = cache(async (id: number) => {
  return await getProductDB(id);
});

export const getProductBySlug = cache(async (slug: string) => {
  return await getProductBySlugDB(slug);
});

export const getAllProducts = cache(async (config: GetAllProductsConfig) => {
  return await getAllProductsDB(config);
});
