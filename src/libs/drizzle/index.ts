import { drizzle } from "drizzle-orm/node-postgres";

import { env } from "@/configs/env";

import * as schema from "./schema";

export const db = drizzle(env.DATABASE_URL, {
  schema: schema,
  logger: env.NODE_ENV === "development",
});
