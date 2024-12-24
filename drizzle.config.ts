import "dotenv/config";
import { defineConfig } from "drizzle-kit";

import { env } from "@/configs/env";

export default defineConfig({
  out: "./src/libs/drizzle/migrations",
  schema: "./src/libs/drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
