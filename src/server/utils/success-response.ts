import { STATUS } from "@/configs/constants";

export function successResponse<T>(message: string, data: T) {
  return { status: STATUS.SUCCESS, message, data };
}
