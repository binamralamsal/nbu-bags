import "server-only";

import { STATUS } from "@/configs/constants";

export function errorResponse(message: string) {
  return { status: STATUS.ERROR, message };
}

export function internalServerErrorResponse(
  message = "Internal server error occured",
) {
  return { status: STATUS.ERROR, message };
}
