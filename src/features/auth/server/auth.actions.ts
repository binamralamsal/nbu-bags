"use server";

import { cookies } from "next/headers";

import {
  AuthorizeUserSchema,
  NewUserSchema,
  RegisterUserSchema,
  UpdateUserSchema,
  authorizeUserSchema,
  newUserSchema,
  registerUserSchema,
  updateUserSchema,
} from "../auth.schema";
import { ensureAdmin } from "./auth.query";
import {
  authorizeUserDB,
  deleteUserDB,
  logUserIn,
  logoutUserDB,
  registerUserDB,
  updateUserDB,
} from "./auth.services";

import { REFRESH_TOKEN_KEY } from "@/configs/constants";
import { UnauthorizedError } from "@/errors/unauthorized-error";
import {
  errorResponse,
  internalServerErrorResponse,
} from "@/utils/errors-response";
import { successResponse } from "@/utils/success-response";
import { validateData } from "@/utils/validate-data";

export async function registerUserAction(body: RegisterUserSchema) {
  const { data, error } = validateData(registerUserSchema, body);
  if (error) return error;

  try {
    const userResponse = await registerUserDB(data);
    await logUserIn(userResponse);

    return successResponse("User registered successfully", userResponse);
  } catch (err) {
    if (!(err instanceof Error)) return internalServerErrorResponse();
    return errorResponse(err.message);
  }
}

export async function loginUserAction(body: AuthorizeUserSchema) {
  const { data, error } = validateData(authorizeUserSchema, body);
  if (error) return error;

  try {
    const userResponse = await authorizeUserDB(data);
    await logUserIn(userResponse);

    return successResponse("Logged in successfully", userResponse);
  } catch (err) {
    if (!(err instanceof Error)) return internalServerErrorResponse();
    return errorResponse(err.message);
  }
}

export async function logoutUserAction() {
  try {
    const cookieStore = await cookies();

    const refreshToken = cookieStore.get(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      cookieStore.delete(REFRESH_TOKEN_KEY);
      throw new UnauthorizedError();
    }

    await logoutUserDB(refreshToken.value);

    return successResponse("Logged out successfully");
  } catch (err) {
    if (!(err instanceof Error)) return internalServerErrorResponse();
    return errorResponse(err.message);
  }
}

export async function addUserAction(body: NewUserSchema) {
  const { data, error } = validateData(newUserSchema, body);
  if (error) return error;

  try {
    await ensureAdmin();
    const userResponse = await registerUserDB(data);

    return successResponse("User added successfully", userResponse);
  } catch (err) {
    if (!(err instanceof Error)) return internalServerErrorResponse();
    return errorResponse(err.message);
  }
}

export async function updateUserAction(body: UpdateUserSchema, id: number) {
  const { data, error } = validateData(updateUserSchema, body);
  if (error) return error;

  try {
    await ensureAdmin();
    const userResponse = await updateUserDB(id, data);

    return successResponse("User added successfully", userResponse);
  } catch (err) {
    if (!(err instanceof Error)) return internalServerErrorResponse();
    return errorResponse(err.message);
  }
}

export async function deleteUserAction(id: number) {
  try {
    const user = await ensureAdmin();
    if (user.userId === id) throw new Error("You cannot delete yourself.");

    await deleteUserDB(id);

    return successResponse("Deleted user successfully");
  } catch (err) {
    if (!(err instanceof Error)) return internalServerErrorResponse();
    return errorResponse(err.message);
  }
}
