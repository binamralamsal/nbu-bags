import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const STATUS = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  ERROR: "ERROR",
  SUCCESS: "SUCCESS",
  NOT_FOUND: "NOT_FOUND",
} as const;

export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";

export const DEFAULT_COOKIE_CONFIG: Omit<ResponseCookie, "name" | "value"> = {
  path: "/",
  httpOnly: true,
  secure: true,
};

export const MILLISECONDS_PER_SECOND = 1000;
export const SECONDS_PER_MINUTE = 60;
export const MINUTES_PER_HOUR = 60;
export const HOURS_PER_DAY = 24;
export const DAYS_PER_MONTH = 30;
export const DAYS_PER_WEEK = 7;

export const ACCESS_TOKEN_EXPIRY = SECONDS_PER_MINUTE;
export const REFRESH_TOKEN_EXPIRY =
  DAYS_PER_WEEK * HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE;
export const RESET_PASSWORD_EXPIRY =
  HOURS_PER_DAY *
  MINUTES_PER_HOUR *
  SECONDS_PER_MINUTE *
  MILLISECONDS_PER_SECOND;

export const REDIRECT_URL_IF_AUTHORIZED = "/";
export const REDIRECT_URL_IF_UNAUTHORIZED = "/login";

export const roles = ["user", "admin"] as const;
export const defaultRole: (typeof roles)[number] = "user";

export const DATATABLE_PAGE_SIZE = 15;
