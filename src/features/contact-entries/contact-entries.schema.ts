import { z } from "zod";

export const newContactEntrySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." }),
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address." }),
  phone: z
    .string()
    .trim()
    .length(10, { message: "Phone number must be exactly 10 digits." })
    .refine((val) => val.startsWith("98") || val.startsWith("97"), {
      message: "Phone number must start with 98 or 97.",
    }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters long." })
    .max(500, { message: "Message cannot exceed 500 characters." }),
});
export type NewContactEntrySchema = z.infer<typeof newContactEntrySchema>;
