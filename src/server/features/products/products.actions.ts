"use server";

import { z } from "zod";

import { UnauthorizedError } from "@/server/errors/unauthorized-error";
import {
  errorResponse,
  internalServerErrorResponse,
} from "@/server/utils/errors-response";
import { successResponse } from "@/server/utils/success-response";
import { validateData } from "@/server/utils/validate-data";

import { getCurrentUser } from "../auth/auth.query";
import { newCategoryDTO } from "./products.dtos";
import { addCategoryDB, updateCategoryDB } from "./products.services";

export async function addCategoryAction(body: z.infer<typeof newCategoryDTO>) {
  const { data, error } = validateData(newCategoryDTO, body);
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
  body: z.infer<typeof newCategoryDTO>,
) {
  const { data, error } = validateData(newCategoryDTO, body);
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
