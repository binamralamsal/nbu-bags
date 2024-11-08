import "server-only";

import { cache } from "react";

import { getCategoryDB } from "./products.services";

export const getCategory = cache(async (id: number) => {
  return await getCategoryDB(id);
});
