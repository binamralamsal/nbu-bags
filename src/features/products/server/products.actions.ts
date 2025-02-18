"use server";

import {
  NewCategorySchema,
  NewColorSchema,
  NewProductSchema,
  NewSizeSchema,
  newCategorySchema,
  newColorSchema,
  newProductSchema,
  newSizeSchema,
} from "../products.schema";
import {
  addCategoryDB,
  addColorDB,
  addProductDB,
  addSizeDB,
  deleteCategoryDB,
  deleteColorDB,
  deleteProductDB,
  deleteSizeDB,
  updateCategoryDB,
  updateColorDB,
  updateProductDB,
  updateSizeDB,
} from "./products.services";

import { ensureAdmin } from "@/features/auth/server/auth.query";
import {
  errorResponse,
  internalServerErrorResponse,
} from "@/utils/errors-response";
import { successResponse } from "@/utils/success-response";
import { validateData } from "@/utils/validate-data";

export async function saveCategoryAction(body: NewCategorySchema, id?: number) {
  const { data, error } = validateData(newCategorySchema, body);
  if (error) return error;

  try {
    await ensureAdmin();
    if (id) {
      await updateCategoryDB(id, data);
      return successResponse("Updated category successfully");
    } else {
      await addCategoryDB(data);
      return successResponse("Created category successfully");
    }
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

export async function saveSizeAction(body: NewSizeSchema, id?: number) {
  const { data, error } = validateData(newSizeSchema, body);
  if (error) return error;

  try {
    await ensureAdmin();
    if (id) {
      await updateSizeDB(id, data);
      return successResponse("Updated size successfully");
    } else {
      await addSizeDB(data);
      return successResponse("Created size successfully");
    }
  } catch (err) {
    if (!(err instanceof Error)) return internalServerErrorResponse();
    return errorResponse(err.message);
  }
}

export async function deleteSizeAction(id: number) {
  try {
    await ensureAdmin();
    await deleteSizeDB(id);

    return successResponse("Deleted size successfully");
  } catch (err) {
    if (!(err instanceof Error)) return internalServerErrorResponse();
    return errorResponse(err.message);
  }
}

export async function saveColorAction(body: NewColorSchema, id?: number) {
  const { data, error } = validateData(newColorSchema, body);
  if (error) return error;

  try {
    await ensureAdmin();
    if (id) {
      await updateColorDB(id, data);
      return successResponse("Updated color successfully");
    } else {
      await addColorDB(data);
      return successResponse("Created color successfully");
    }
  } catch (err) {
    if (!(err instanceof Error)) return internalServerErrorResponse();
    return errorResponse(err.message);
  }
}

export async function deleteColorAction(id: number) {
  try {
    await ensureAdmin();
    await deleteColorDB(id);

    return successResponse("Deleted color successfully");
  } catch (err) {
    if (!(err instanceof Error)) return internalServerErrorResponse();
    return errorResponse(err.message);
  }
}
export async function saveProductAction(body: NewProductSchema, id?: number) {
  const { data, error } = validateData(newProductSchema, body);
  if (error) return error;

  try {
    await ensureAdmin();
    if (id) {
      await updateProductDB(id, data);
      return successResponse("Updated product successfully");
    } else {
      await addProductDB(data);
      return successResponse("Created product successfully");
    }
  } catch (err) {
    if (!(err instanceof Error)) return internalServerErrorResponse();
    return errorResponse(err.message);
  }
}

export async function deleteProductAction(id: number) {
  try {
    await ensureAdmin();
    await deleteProductDB(id);

    return successResponse("Deleted product successfully");
  } catch (err) {
    if (!(err instanceof Error)) return internalServerErrorResponse();
    return errorResponse(err.message);
  }
}
