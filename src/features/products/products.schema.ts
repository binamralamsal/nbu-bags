import { z } from "zod";

import { productStatus } from "@/configs/constants";

export const newCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Category name must be at least 2 characters long." })
    .max(50, { message: "Category name must be less than 50 characters long." })
    .regex(/^[a-zA-Z\s]*$/, {
      message: "Category name can only contain letters and spaces.",
    }),
  slug: z
    .string()
    .trim()
    .min(2, { message: "Slug must be at least 2 characters long." })
    .max(50, { message: "Slug must be less than 64 characters long." })
    .regex(/^[a-z0-9-]+$/, {
      message:
        "Slug can only contain lowercase letters, numbers, and hyphens. Spaces are not allowed.",
    }),
});
export type NewCategorySchema = z.infer<typeof newCategorySchema>;

export const newProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Product name must be at least 3 characters long.")
    .max(255, "Product name must be 255 characters or fewer.")
    .describe("The name of the product."),
  slug: z
    .string()
    .trim()
    .min(2, { message: "Slug must be at least 2 characters long." })
    .max(50, { message: "Slug must be less than 300 characters long." })
    .regex(/^[a-z0-9-]+$/, {
      message:
        "Slug can only contain lowercase letters, numbers, and hyphens. Spaces are not allowed.",
    }),
  price: z
    .number({ message: "Price must only include numbers or decimal." })
    .positive("Price must be greater than 0.")
    .describe("The price of the product."),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters long.")
    .max(1000, "Description must be 1000 characters or fewer.")
    .describe("A brief description of the product."),
  status: z
    .enum(productStatus, {
      errorMap: () => ({
        message: "Status must be 'draft', 'published', or 'archived'.",
      }),
    })
    .default("draft")
    .describe("The current status of the product."),
  categoryId: z
    .number()
    .positive("Category you entered is invalid.")
    .int("Category you entered is invalid.")
    .nullable()
    .default(null)
    .describe("The category this product belongs to."),
  images: z
    .number()
    .positive("Image that you uploaded is invalid.")
    .int("Image that you uploaded is invalid.")
    .array()
    .max(5, { message: "You can't upload more than five images." })
    .describe("Images associated with the product."),
});
export type NewProductSchema = z.infer<typeof newProductSchema>;
