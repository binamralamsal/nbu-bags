"use server";

import {
  NewContactEntrySchema,
  newContactEntrySchema,
} from "../contact-entries.schema";
import {
  deleteContactEntryDB,
  newContactEntryDB,
} from "./contact-entries.services";

import { ensureAdmin } from "@/features/auth/server/auth.query";
import {
  errorResponse,
  internalServerErrorResponse,
} from "@/utils/errors-response";
import { successResponse } from "@/utils/success-response";
import { validateData } from "@/utils/validate-data";

export async function newContactEntryAction(body: NewContactEntrySchema) {
  const { data, error } = validateData(newContactEntrySchema, body);
  if (error) return error;

  try {
    await newContactEntryDB(data);
    return successResponse(
      "Message sent successfully! We'll get back to you soon.",
    );
  } catch (err) {
    if (!(err instanceof Error)) return internalServerErrorResponse();
    return errorResponse(err.message);
  }
}

export async function deleteContactEntryAction(id: number) {
  try {
    await ensureAdmin();
    await deleteContactEntryDB(id);

    return successResponse("Deleted contact entry successfully");
  } catch (err) {
    if (!(err instanceof Error)) return internalServerErrorResponse();
    return errorResponse(err.message);
  }
}
