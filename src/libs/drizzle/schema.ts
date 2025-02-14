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

export type UsersTableSelectType = typeof usersTable.$inferSelect;

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

export const sizesTable = pgTable("sizes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
});
export type SizesTableSelectType = typeof sizesTable.$inferSelect;

export const colorsTable = pgTable("colors", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  color: text("color").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
});
export type ColorsTableSelectType = typeof colorsTable.$inferSelect;

export const productStatusEnum = pgEnum("product_status", productStatus);

export const productsTable = pgTable("products", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  salePrice: integer("sale_price"),
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

export const productSizesTable = pgTable(
  "product_sizes",
  {
    productId: integer("product_id")
      .notNull()
      .references(() => productsTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    sizeId: integer("size_id")
      .notNull()
      .references(() => sizesTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.productId, t.sizeId] }),
  }),
);

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
    colorId: integer("color_id").references(() => colorsTable.id, {
      onDelete: "set null",
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

export const contactEntriesTable = pgTable("contact_entries", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
});
export type ContactEntriesSelectType = typeof contactEntriesTable.$inferSelect;

export const productsRelations = relations(productsTable, ({ many, one }) => ({
  productsToFiles: many(productFilesTable),
  productToSizes: many(productSizesTable),
  category: one(categoriesTable, {
    fields: [productsTable.categoryId],
    references: [categoriesTable.id],
  }),
}));

export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
  products: many(productsTable),
}));

export const sizesRelations = relations(sizesTable, ({ many }) => ({
  productToSizes: many(productSizesTable),
}));

export const colorsRelations = relations(colorsTable, ({ many }) => ({
  productsToFiles: many(productFilesTable),
}));

export const uploadedFilesRelations = relations(
  uploadedFilesTable,
  ({ many }) => ({
    productsToFiles: many(productFilesTable),
  }),
);

export const productSizesRelations = relations(
  productSizesTable,
  ({ one }) => ({
    product: one(productsTable, {
      fields: [productSizesTable.productId],
      references: [productsTable.id],
    }),
    file: one(sizesTable, {
      fields: [productSizesTable.sizeId],
      references: [sizesTable.id],
    }),
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
    color: one(colorsTable, {
      fields: [productFilesTable.colorId],
      references: [colorsTable.id],
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
