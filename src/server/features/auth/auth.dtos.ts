import { z } from "zod";

export const emailDTO = z
  .string()
  .trim()
  .email({ message: "Please enter a valid email address." })
  .min(5, { message: "Email must be at least 5 characters long." });

export const passwordDTO = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long." })
  .max(128, { message: "Password must be less than 128 characters long." });

export const newPasswordDTO = passwordDTO
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

export const nameDTO = z
  .string()
  .trim()
  .min(3, { message: "Name must be at least 3 characters long." })
  .max(100, { message: "Name must be less than 100 characters long." })
  .regex(/^[a-zA-Z\s]*$/, {
    message: "Name can only contain letters and spaces.",
  });

export const authorizeUserDTO = z.object({
  email: emailDTO,
  password: passwordDTO,
});

export const registerUserDTO = z.object({
  name: nameDTO,
  email: emailDTO,
  password: newPasswordDTO,
});

export const refreshTokenDTO = z.object({
  sessionToken: z.string().min(1, { message: "Session token is required." }),
});

export const accessTokenDTO = refreshTokenDTO.extend({
  userId: z
    .number()
    .positive({ message: "User ID must be a positive integer." }),
  name: z.string().min(1, { message: "Name is required." }),
  email: emailDTO,
});

export const verifyUserDTO = z.object({
  email: emailDTO,
  token: z.string().min(1, { message: "Verification token is required." }),
});

export const changePasswordDTO = z
  .object({
    oldPassword: passwordDTO
      .min(8, {
        message: "Old password must be at least 8 characters long.",
      })
      .max(128, {
        message: "Old Password must be less than 128 characters long.",
      }),
    newPassword: newPasswordDTO,
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "The new password cannot be the same as the old password.",
    path: ["newPassword"],
  });

export const forgotPasswordDTO = z.object({ email: emailDTO });

export const resetPasswordDTO = z.object({
  email: emailDTO,
  token: z.string().min(1, { message: "Reset token is required." }),
  password: passwordDTO,
});
