"use server";

import { UnauthorizedError } from "@/errors/unauthorized-error";
import { getCurrentUser } from "@/features/auth/server/auth.query";
import {
  errorResponse,
  internalServerErrorResponse,
} from "@/utils/errors-response";
import { successResponse } from "@/utils/success-response";
import { validateData } from "@/utils/validate-data";

import { NewCategorySchema, newCategorySchema } from "../products.schema";
import { addCategoryDB, updateCategoryDB } from "./products.services";

export async function addCategoryAction(body: NewCategorySchema) {
  const { data, error } = validateData(newCategorySchema, body);
  if (error) return error;

  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") throw new UnauthorizedError();

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
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") throw new UnauthorizedError();

    await updateCategoryDB(id, data);
    return successResponse("Updated category successfully");
  } catch (err) {
    if (!(err instanceof Error)) return internalServerErrorResponse();
    return errorResponse(err.message);
  }
}
