"use server";

import { ensureAdmin } from "@/features/auth/server/auth.query";
import {
  errorResponse,
  internalServerErrorResponse,
} from "@/utils/errors-response";
import { successResponse } from "@/utils/success-response";
import { validateData } from "@/utils/validate-data";

import { NewCategorySchema, newCategorySchema } from "../products.schema";
import {
  addCategoryDB,
  deleteCategoryDB,
  updateCategoryDB,
} from "./products.services";

export async function addCategoryAction(body: NewCategorySchema) {
  const { data, error } = validateData(newCategorySchema, body);
  if (error) return error;

  try {
    await ensureAdmin();
    const category = await addCategoryDB(data);

    return successResponse("Created category successfully", category);
  } catch (err) {
    if (!(err instanceof Error)) return internalServerErrorResponse();
    return errorResponse(err.message);
  }
}

export async function updateCategoryAction(
  id: number,
  body: NewCategorySchema,
) {
  const { data, error } = validateData(newCategorySchema, body);
  if (error) return error;

  try {
    await ensureAdmin();
    await updateCategoryDB(id, data);

    return successResponse("Updated category successfully");
  } catch (err) {
    if (!(err instanceof Error)) return internalServerErrorResponse();
    return errorResponse(err.message);
  }
}

export async function deleteCategoryAction(id: number) {
  try {
    await ensureAdmin();
    await deleteCategoryDB(id);

    return successResponse("Deleted category successfully");
  } catch (err) {
    if (!(err instanceof Error)) return internalServerErrorResponse();
    return errorResponse(err.message);
  }
}
