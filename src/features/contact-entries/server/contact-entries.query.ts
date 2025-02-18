import "server-only";

import { cache } from "react";

import {
  GetAllContactEntriesConfig,
  getAllContactEntriesDB,
} from "./contact-entries.services";

import { ensureAdmin } from "@/features/auth/server/auth.query";

export const getAllContactEntries = cache(
  async (config: GetAllContactEntriesConfig) => {
    await ensureAdmin({ redirect: true });
    return await getAllContactEntriesDB(config);
  },
);
