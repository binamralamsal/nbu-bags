import "server-only";

import { cache } from "react";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ACCESS_TOKEN_KEY,
  REDIRECT_URL_IF_AUTHORIZED,
} from "@/configs/constants";

import { getUserFromAccessToken } from "./auth.services";

export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_KEY);

  if (!accessToken) return null;
  try {
    const user = getUserFromAccessToken(accessToken.value);
    return user;
  } catch {
    return null;
  }
});

export async function redirectIfAuthorized() {
  const currentUser = await getCurrentUser();
  if (currentUser) return redirect(REDIRECT_URL_IF_AUTHORIZED);
}
