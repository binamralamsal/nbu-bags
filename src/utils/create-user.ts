import { input, password, select } from "@inquirer/prompts";
import argon2 from "argon2";
import { DatabaseError } from "pg";
import { z } from "zod";

import {
  emailSchema,
  nameSchema,
  newPasswordSchema,
} from "@/features/auth/auth.schema";
import { db } from "@/libs/drizzle";
import { emailsTable, usersTable } from "@/libs/drizzle/schema";

const validate = (input: string, zodSchema: z.Schema) => {
  const parsed = zodSchema.safeParse(input);
  if (parsed.success) return true;

  return parsed.error.issues[0].message;
};

const nameInput = await input({
  message: "👤 What name should I assign to the new user?",
  validate: (input) => validate(input, nameSchema),
});

const emailInput = await input({
  message: "📧 What email address should I use for the user?",
  validate: (input) => validate(input, emailSchema),
});

const passwordInput = await password({
  message: "🔑 Please set a password for the user:",
  validate: (input) => validate(input, newPasswordSchema),
});

const roleInput = await select({
  message: "👥 Select the user's role:",
  choices: [
    {
      name: "User",
      value: "user",
      description:
        "Standard users can browse, add items to the cart, and make purchases.",
    },
    {
      name: "Admin",
      value: "admin",
      description:
        "Admins can manage products, users, and access the admin dashboard.",
    },
  ] as const,
  default: "user",
});

const hashedPassword = await argon2.hash(passwordInput);

try {
  await db.transaction(async (tx) => {
    const [{ userId }] = await tx
      .insert(usersTable)
      .values({
        name: nameInput,
        password: hashedPassword,
        role: roleInput,
      })
      .returning({ userId: usersTable.id });

    await tx.insert(emailsTable).values({
      userId: userId,
      email: emailInput,
    });
  });

  console.log("✅ User created successfully!");
} catch (err) {
  if (err instanceof DatabaseError && err.code === "23505") {
    console.error(
      "🚫 A user with this email address already exists. Please try a different email.",
    );
  } else if (err instanceof Error) {
    console.error(`❗ An error occurred: ${err.message}`);
  } else {
    console.error("⚠️ An unexpected error occurred.");
  }
} finally {
  process.exit(0);
}
