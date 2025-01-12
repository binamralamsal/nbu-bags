import "server-only";

import { cache } from "react";

import {
  GetAllCategoriesConfig,
  GetAllColorsConfig,
  GetAllProductsConfig,
  GetAllSizesConfig,
  getAllCategoriesDB,
  getAllColorsDB,
  getAllProductsDB,
  getAllSizesDB,
  getCategoryDB,
  getColorDB,
  getProductBySlugDB,
  getProductDB,
  getSizeDB,
} from "./products.services";

export const getCategory = cache(async (id: number) => {
  return await getCategoryDB(id);
});

export const getAllCategories = cache(
  async (config: GetAllCategoriesConfig) => {
    return await getAllCategoriesDB(config);
  },
);

export const getSize = cache(async (id: number) => {
  return await getSizeDB(id);
});

export const getAllSizes = cache(async (config: GetAllSizesConfig) => {
  return await getAllSizesDB(config);
});

export const getColor = cache(async (id: number) => {
  return await getColorDB(id);
});

export const getAllColors = cache(async (config: GetAllColorsConfig) => {
  return await getAllColorsDB(config);
});

export const getProduct = cache(async (id: number) => {
  return await getProductDB(id);
});

export const getProductBySlug = cache(async (slug: string) => {
  return await getProductBySlugDB(slug);
});

export const getAllProducts = cache(async (config: GetAllProductsConfig) => {
  return await getAllProductsDB(config);
});
