import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { parseCookies } from "@/libs/parse-cookies";

import { env } from "./configs/env";

export default async function middleware(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;
    const accessToken = cookieStore.get("accessToken")?.value;

    if (accessToken || !refreshToken) return NextResponse.next();

    const response = await fetch(`${env.SERVER_API_URL}/api/refresh-token`, {
      method: "POST",
      headers: {
        cookie: cookieStore.toString(),
      },
    });
    const responseCookie = response.headers.get("set-cookie");
    if (!responseCookie) throw new Error("No set-cookie header in response");

    const parsedCookies = parseCookies(responseCookie);
    const redirectResponse = NextResponse.redirect(request.url);

    redirectResponse.cookies.set(
      "accessToken",
      parsedCookies.accessToken?.value || "",
      parsedCookies.accessToken?.attributes,
    );
    redirectResponse.cookies.set(
      "refreshToken",
      parsedCookies.refreshToken?.value || "",
      parsedCookies.refreshToken?.attributes,
    );
    return redirectResponse;
  } catch (err) {
    console.error("Error in middleware:", err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
