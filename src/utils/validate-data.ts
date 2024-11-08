import "server-only";

import { ZodError, z } from "zod";

import { STATUS } from "@/configs/constants";

export function validateData<T extends z.ZodSchema>(
  schema: T,
  body: z.infer<T>,
) {
  const parsedBody = schema.safeParse(body);

  if (!parsedBody.success) {
    return {
      error: {
        status: STATUS.VALIDATION_ERROR,
        message: parsedBody.error.issues[0].message,
        extra: parsedBody.error as ZodError<T>,
      },
      data: null,
    };
  }

  return {
    error: null,
    data: parsedBody.data as z.infer<T>,
  } as const;
}
