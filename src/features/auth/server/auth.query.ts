import "server-only";

import { cache } from "react";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ACCESS_TOKEN_KEY,
  REDIRECT_URL_IF_AUTHORIZED,
  REDIRECT_URL_IF_UNAUTHORIZED,
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

export async function redirectIfUnauthorized() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return redirect(REDIRECT_URL_IF_UNAUTHORIZED);

  return currentUser;
}

export async function redirectIfNotAdmin() {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "admin") {
    const params = new URLSearchParams({ redirect_url: "/admin" });
    const redirectUrl = `${REDIRECT_URL_IF_UNAUTHORIZED}?${params.toString()}`;

    return redirect(redirectUrl);
  }

  return currentUser;
}
