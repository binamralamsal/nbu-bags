import "dotenv/config";
import { defineConfig } from "drizzle-kit";

import { env } from "@/configs/env";

console.log(env.DATABASE_URL);

export default defineConfig({
  out: "./src/libs/drizzle/migrations",
  schema: "./src/libs/drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
