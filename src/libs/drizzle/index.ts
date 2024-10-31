import { drizzle } from "drizzle-orm/node-postgres";

import { env } from "@/configs/env";

export const db = drizzle(env.DATABASE_URL);
