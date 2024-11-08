"use server";

import { cookies } from "next/headers";

import { REFRESH_TOKEN_KEY } from "@/configs/constants";
import { UnauthorizedError } from "@/errors/unauthorized-error";
import {
  errorResponse,
  internalServerErrorResponse,
} from "@/utils/errors-response";
import { successResponse } from "@/utils/success-response";
import { validateData } from "@/utils/validate-data";

import {
  AuthorizeUserSchema,
  RegisterUserSchema,
  authorizeUserSchema,
  registerUserSchema,
} from "../auth.schema";
import {
  authorizeUserDB,
  logUserIn,
  logoutUserDB,
  registerUserDB,
} from "./auth.services";

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
