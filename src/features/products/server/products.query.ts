import "server-only";

import { cache } from "react";

import {
  GetAllCategoriesConfig,
  getAllCategoriesDB,
  getCategoryDB,
} from "./products.services";

export const getCategory = cache(async (id: number) => {
  return await getCategoryDB(id);
});

export const getAllCategories = cache(
  async (config: GetAllCategoriesConfig) => {
    return await getAllCategoriesDB(config);
  },
);
