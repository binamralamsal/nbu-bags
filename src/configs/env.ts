import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string(),
    SERVER_API_URL: z.string(),
    NODE_ENV: z.enum(["development", "production"]).default("development"),
  },
  client: {},
  experimental__runtimeEnv: {},
});
