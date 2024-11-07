import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

import { defaultRole, roles } from "@/configs/constants";

export const roleEnum = pgEnum("role", roles);

export const usersTable = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  role: roleEnum().default(defaultRole).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
});

export const emailsTable = pgTable(
  "emails",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .unique()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    email: varchar("email", { length: 255 }).notNull(),
    isVerified: boolean("is_verified").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    uniqueEmailIndex: uniqueIndex("email_idx").on(sql`lower(${table.email})`),
  }),
);

export const sessionsTable = pgTable("sessions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  sessionToken: text("session_token")
    .notNull()
    .default(sql`gen_random_uuid()`)
    .unique(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  valid: boolean("valid").notNull().default(true),
  userAgent: text("user_agent"),
  ip: varchar("ip", { length: 45 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
});

export const categoriesTable = pgTable("categories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const usersRelations = relations(usersTable, ({ one, many }) => ({
  email: one(emailsTable, {
    fields: [usersTable.id],
    references: [emailsTable.userId],
  }),
  sessions: many(sessionsTable),
}));

export const emailsRelations = relations(emailsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [emailsTable.userId],
    references: [usersTable.id],
  }),
}));

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}));
