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
    .max(50, { message: "Slug must be less than 50 characters long." })
    .regex(/^[a-z0-9-]+$/, {
      message:
        "Slug can only contain lowercase letters, numbers, and hyphens. Spaces are not allowed.",
    }),
});
export type NewCategorySchema = z.infer<typeof newCategorySchema>;

export const newColorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Color name must be at least 2 characters long." })
    .max(50, { message: "Color name must be less than 50 characters long." })
    .regex(/^[a-zA-Z\s]*$/, {
      message: "Color name can only contain letters and spaces.",
    }),
  color: z
    .string()
    .trim()
    .startsWith("#", { message: "Please choose a proper color." })
    .length(7, { message: "Please choose a proper color." }),
  slug: z
    .string()
    .trim()
    .min(2, { message: "Slug must be at least 2 characters long." })
    .max(50, { message: "Slug must be less than 50 characters long." })
    .regex(/^[a-z0-9-]+$/, {
      message:
        "Slug can only contain lowercase letters, numbers, and hyphens. Spaces are not allowed.",
    }),
});
export type NewColorSchema = z.infer<typeof newColorSchema>;

export const newSizeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Size name must be at least 1 characters long." })
    .max(12, { message: "Size name must be less than 12 characters long." })
    .regex(/^[a-zA-Z\s]*$/, {
      message: "Size name can only contain letters and spaces.",
    }),
  slug: z
    .string()
    .trim()
    .min(1, { message: "Slug must be at least 1 characters long." })
    .max(12, { message: "Slug must be less than 12 characters long." })
    .regex(/^[a-z0-9-]+$/, {
      message:
        "Slug can only contain lowercase letters, numbers, and hyphens. Spaces are not allowed.",
    }),
});
export type NewSizeSchema = z.infer<typeof newSizeSchema>;

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
  salePrice: z
    .number({ message: "Sale price must only include numbers or decimal." })
    .positive("Sale price must be greater than 0.")
    .nullable()
    .default(null)
    .describe("The discounted price of the product."),
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
    .max(20, { message: "You can't upload more than twenty images." })
    .describe("Images associated with the product."),
  sizes: z
    .number()
    .positive("Size that you entered is invalid.")
    .int("Size that you entered is invalid.")
    .array()
    .max(20, { message: "You can't select more than twenty sizes." })
    .describe("Sizes associated with the product."),
});
export type NewProductSchema = z.infer<typeof newProductSchema>;
