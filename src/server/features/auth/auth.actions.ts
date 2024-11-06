"use server";

import { cookies } from "next/headers";

import { z } from "zod";

import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_KEY,
} from "@/configs/constants";
import {
  errorResponse,
  internalServerErrorResponse,
} from "@/server/utils/errors-response";
import { successResponse } from "@/server/utils/success-response";
import { validateData } from "@/server/utils/validate-data";

import { authorizeUserDTO, registerUserDTO } from "./auth.dtos";
import { authorizeUser, logUserIn, registerUser } from "./auth.services";

export async function registerUserAction(
  body: z.infer<typeof registerUserDTO>,
) {
  const { data, error } = validateData(registerUserDTO, body);
  if (error) return error;

  try {
    const userResponse = await registerUser(data);
    await logUserIn(userResponse);

    return successResponse("User registered successfully", userResponse);
  } catch (err) {
    if (!(err instanceof Error)) return internalServerErrorResponse();
    return errorResponse(err.message);
  }
}

export async function loginUserAction(body: z.infer<typeof authorizeUserDTO>) {
  const { data, error } = validateData(authorizeUserDTO, body);
  if (error) return error;

  try {
    const userResponse = await authorizeUser(data);
    await logUserIn(userResponse);

    return successResponse("Logged in successfully", userResponse);
  } catch (err) {
    if (!(err instanceof Error)) return internalServerErrorResponse();
    return errorResponse(err.message);
  }
}
