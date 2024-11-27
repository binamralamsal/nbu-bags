import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

import {
  defaultProductStatus,
  defaultRole,
  productStatus,
  roles,
} from "@/configs/constants";

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
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
});
export type CategoriesTableSelectType = typeof categoriesTable.$inferSelect;

export const productStatusEnum = pgEnum("product_status", productStatus);

export const productsTable = pgTable("products", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  status: productStatusEnum().default(defaultProductStatus).notNull(),
  categoryId: integer("category_id").references(() => categoriesTable.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
});
export type ProductsTableSelectType = typeof productsTable.$inferSelect;

export const productFilesTable = pgTable(
  "product_files",
  {
    productId: integer("product_id")
      .notNull()
      .references(() => productsTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    fileId: integer("file_id")
      .notNull()
      .references(() => uploadedFilesTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.productId, t.fileId] }),
  }),
);

export const uploadedFilesTable = pgTable("uploaded_files", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  fileType: text("file_type").notNull(),
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
});

export const productsRelations = relations(productsTable, ({ many, one }) => ({
  productsToFiles: many(productFilesTable),
  category: one(categoriesTable, {
    fields: [productsTable.categoryId],
    references: [categoriesTable.id],
  }),
}));

export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
  products: many(productsTable),
}));

export const uploadedFilesRelations = relations(
  uploadedFilesTable,
  ({ many }) => ({
    productsToFiles: many(productFilesTable),
  }),
);

export const productFilesRelations = relations(
  productFilesTable,
  ({ one }) => ({
    product: one(productsTable, {
      fields: [productFilesTable.productId],
      references: [productsTable.id],
    }),
    file: one(uploadedFilesTable, {
      fields: [productFilesTable.fileId],
      references: [uploadedFilesTable.id],
    }),
  }),
);

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
