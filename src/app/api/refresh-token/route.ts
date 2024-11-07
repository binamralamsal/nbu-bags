import { cookies } from "next/headers";

import { REFRESH_TOKEN_KEY } from "@/configs/constants";
import { refreshTokens } from "@/server/features/auth/auth.services";

export async function POST() {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get(REFRESH_TOKEN_KEY);
  if (!refreshToken) return new Response("Unauthorized", { status: 401 });

  try {
    await refreshTokens(refreshToken.value);
  } catch (err) {
    console.log("asdf", err);
  }

  return new Response("Refreshed token successfully", { status: 200 });
}
