import { STATUS } from "@/configs/constants";

export function successResponse<T>(message: string, data?: T) {
  const response = { status: STATUS.SUCCESS, message };
  if (data !== undefined) {
    return { ...response, data };
  }

  return response;
}
