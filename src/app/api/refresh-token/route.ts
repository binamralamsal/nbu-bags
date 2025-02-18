import { cookies } from "next/headers";

import { REFRESH_TOKEN_KEY } from "@/configs/constants";
import { refreshTokensDB } from "@/features/auth/server/auth.services";

export async function POST() {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get(REFRESH_TOKEN_KEY);
  if (!refreshToken) return new Response("Unauthorized", { status: 401 });

  try {
    await refreshTokensDB(refreshToken.value);
  } catch {}

  return new Response("Refreshed token successfully", { status: 200 });
}
