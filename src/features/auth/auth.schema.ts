import { z } from "zod";

import { defaultRole, roles } from "@/configs/constants";

export const emailSchema = z
  .string()
  .trim()
  .email({ message: "Please enter a valid email address." })
  .min(5, { message: "Email must be at least 5 characters long." });
export type EmailSchema = z.infer<typeof emailSchema>;

export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long." })
  .max(128, { message: "Password must be less than 128 characters long." });
export type PasswordSchema = z.infer<typeof passwordSchema>;

export const newPasswordSchema = passwordSchema
  .regex(/[A-Z]/, {
    message: "Password must include at least one uppercase letter.",
  })
  .regex(/[a-z]/, {
    message: "Password must include at least one lowercase letter.",
  })
  .regex(/[0-9]/, { message: "Password must include at least one number." })
  .regex(/[^A-Za-z0-9]/, {
    message: "Password must include at least one special character.",
  });
export type NewPasswordSchema = z.infer<typeof newPasswordSchema>;

export const nameSchema = z
  .string()
  .trim()
  .min(3, { message: "Name must be at least 3 characters long." })
  .max(100, { message: "Name must be less than 100 characters long." })
  .regex(/^[a-zA-Z\s]*$/, {
    message: "Name can only contain letters and spaces.",
  });
export type NameSchema = z.infer<typeof nameSchema>;

export const authorizeUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
export type AuthorizeUserSchema = z.infer<typeof authorizeUserSchema>;

export const registerUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: newPasswordSchema,
});
export type RegisterUserSchema = z.infer<typeof registerUserSchema>;

export const newUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: newPasswordSchema,
  role: z.enum(roles).default(defaultRole),
});
export type NewUserSchema = z.infer<typeof newUserSchema>;

export const updateUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: newPasswordSchema.optional(),
  role: z.enum(roles).default(defaultRole),
});
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

export const newUserClientSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: newPasswordSchema,
    confirmPassword: newPasswordSchema,
    role: z.enum(roles).default(defaultRole),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
export type NewUserClientSchema = z.infer<typeof newUserClientSchema>;

export const refreshTokenSchema = z.object({
  sessionToken: z.string().min(1, { message: "Session token is required." }),
});
export type RefreshTokenSchema = z.infer<typeof refreshTokenSchema>;

export const accessTokenSchema = refreshTokenSchema.extend({
  userId: z
    .number()
    .positive({ message: "User ID must be a positive integer." }),
  role: z.enum(roles).default(defaultRole),
  name: nameSchema,
  email: emailSchema,
});
export type AccessTokenSchema = z.infer<typeof accessTokenSchema>;

export const verifyUserSchema = z.object({
  email: emailSchema,
  token: z.string().min(1, { message: "Verification token is required." }),
});
export type VerifyUserSchema = z.infer<typeof verifyUserSchema>;

export const changePasswordSchema = z
  .object({
    oldPassword: passwordSchema
      .min(8, {
        message: "Old password must be at least 8 characters long.",
      })
      .max(128, {
        message: "Old Password must be less than 128 characters long.",
      }),
    newPassword: newPasswordSchema,
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "The new password cannot be the same as the old password.",
    path: ["newPassword"],
  });
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

export const forgotPasswordSchema = z.object({ email: emailSchema });
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  email: emailSchema,
  token: z.string().min(1, { message: "Reset token is required." }),
  password: newPasswordSchema,
});
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
