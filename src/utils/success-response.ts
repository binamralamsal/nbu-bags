import "server-only";

import { STATUS } from "@/configs/constants";

export function successResponse<T>(
  message: string,
  data: T,
): { status: typeof STATUS.SUCCESS; message: string; data: T };
export function successResponse(message: string): {
  status: typeof STATUS.SUCCESS;
  message: string;
};
export function successResponse<T>(message: string, data?: T) {
  if (typeof data !== "undefined") {
    return { status: STATUS.SUCCESS, message, data };
  }
  return { status: STATUS.SUCCESS, message };
}
