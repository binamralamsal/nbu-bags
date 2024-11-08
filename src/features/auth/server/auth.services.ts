import "server-only";

import { cookies, headers } from "next/headers";

import argon2 from "argon2";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { DatabaseError } from "pg";

import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_KEY,
  DEFAULT_COOKIE_CONFIG,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_KEY,
} from "@/configs/constants";
import { env } from "@/configs/env";
import { InternalServerError } from "@/errors/internal-server-error";
import { UnauthorizedError } from "@/errors/unauthorized-error";
import { db } from "@/libs/drizzle";
import { emailsTable, sessionsTable, usersTable } from "@/libs/drizzle/schema";
import { getIP } from "@/utils/get-ip";

import { accessTokenSchema, refreshTokenSchema } from "../auth.schema";

function hashPassword(password: string) {
  return argon2.hash(password);
}

export function verifyPassword(password: string, hashedPassword: string) {
  return argon2.verify(hashedPassword, password);
}

export async function registerUserDB(data: {
  email: string;
  name: string;
  password: string;
}) {
  const hashedPassword = await hashPassword(data.password);

  try {
    return await db.transaction(async (tx) => {
      const [{ userId, role }] = await tx
        .insert(usersTable)
        .values({
          name: data.name,
          password: hashedPassword,
        })
        .returning({ userId: usersTable.id, role: usersTable.role });

      await tx.insert(emailsTable).values({
        userId: userId,
        email: data.email,
      });

      return { userId, name: data.name, email: data.email, role };
    });
  } catch (err) {
    if (err instanceof DatabaseError && err.code === "23505") {
      throw new Error("User with that email address already exists");
    }

    throw new InternalServerError();
  }
}

export async function createSessionDB(
  userId: number,
  connection: { ip: string; userAgent: string },
) {
  return (
    await db
      .insert(sessionsTable)
      .values({
        userId,
        userAgent: connection.userAgent,
        ip: connection.ip,
      })
      .returning()
  )[0];
}

export async function logUserIn(data: {
  userId: number;
  name: string;
  email: string;
  role: string;
}) {
  const ip = await getIP();
  const userAgent = (await headers()).get("user-agent");

  const { sessionToken } = await createSessionDB(data.userId, {
    ip,
    userAgent: userAgent || "",
  });

  const accessToken = createAccessToken({ ...data, sessionToken });
  const refreshToken = createRefreshToken(sessionToken);

  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN_KEY, accessToken, {
    maxAge: ACCESS_TOKEN_EXPIRY,
    ...DEFAULT_COOKIE_CONFIG,
  });
  cookieStore.set(REFRESH_TOKEN_KEY, refreshToken, {
    maxAge: REFRESH_TOKEN_EXPIRY,
    ...DEFAULT_COOKIE_CONFIG,
  });
}

export function createAccessToken(data: {
  sessionToken: string;
  userId: number;
  name: string;
  email: string;
  role: string;
}) {
  const now = Math.floor(Date.now() / 1000);
  return jwt.sign({ ...data, exp: now + ACCESS_TOKEN_EXPIRY }, env.JWT_SECRET);
}

export function createRefreshToken(sessionToken: string) {
  const now = Math.floor(Date.now() / 1000);
  return jwt.sign(
    { sessionToken, exp: now + REFRESH_TOKEN_EXPIRY },
    env.JWT_SECRET,
  );
}

export async function authorizeUserDB(data: {
  email: string;
  password: string;
}) {
  const [user] = await db
    .select({
      userId: usersTable.id,
      name: usersTable.name,
      password: usersTable.password,
      email: emailsTable.email,
      role: usersTable.role,
    })
    .from(usersTable)
    .innerJoin(emailsTable, eq(emailsTable.userId, usersTable.id))
    .where(eq(emailsTable.email, data.email))
    .limit(1);
  const errorMessage = "Invalid username or password";

  if (!user) throw new Error(errorMessage);
  const { password: hashedPassword, ...currentUser } = user;

  if (!currentUser) throw new Error(errorMessage);

  const isAuthorized = await verifyPassword(data.password, hashedPassword);
  if (!isAuthorized) throw new Error(errorMessage);

  return currentUser;
}

export function getUserFromAccessToken(accessToken: string) {
  try {
    const decodedAccessToken = jwt.verify(accessToken, env.JWT_SECRET);
    const validatedAccessToken = accessTokenSchema.parse(decodedAccessToken);

    return validatedAccessToken;
  } catch {
    throw new UnauthorizedError();
  }
}

export function findSessionByIdDB(sessionToken: string) {
  return db.query.sessionsTable.findFirst({
    where: eq(sessionsTable.sessionToken, sessionToken),
  });
}

export async function findUserByIdDB(userId: number) {
  const [currentUser] = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      password: usersTable.password,
      email: emailsTable.email,
    })
    .from(usersTable)
    .innerJoin(emailsTable, eq(emailsTable.userId, usersTable.id))
    .where(eq(emailsTable.userId, userId))
    .limit(1);

  return currentUser;
}

export async function refreshTokensDB(refreshToken: string) {
  try {
    const decodedRefreshToken = jwt.verify(refreshToken, env.JWT_SECRET);
    const validatedRefreshToken = refreshTokenSchema.parse(decodedRefreshToken);

    const [user] = await db
      .select({
        userId: usersTable.id,
        name: usersTable.name,
        role: usersTable.role,
        sessionToken: sessionsTable.sessionToken,
        isSessionValid: sessionsTable.valid,
        email: emailsTable.email,
      })
      .from(sessionsTable)
      .where(eq(sessionsTable.sessionToken, validatedRefreshToken.sessionToken))
      .innerJoin(usersTable, eq(usersTable.id, sessionsTable.userId))
      .innerJoin(emailsTable, eq(emailsTable.userId, sessionsTable.userId));

    if (!user || !user.isSessionValid) throw new UnauthorizedError();

    const accessTokenJwt = createAccessToken({
      sessionToken: user.sessionToken,
      userId: user.userId,
      email: user.email,
      name: user.name,
      role: user.role,
    });
    const refreshTokenJwt = createRefreshToken(user.sessionToken);

    const cookieStore = await cookies();

    cookieStore.set(ACCESS_TOKEN_KEY, accessTokenJwt, {
      maxAge: ACCESS_TOKEN_EXPIRY,
      ...DEFAULT_COOKIE_CONFIG,
    });
    cookieStore.set(REFRESH_TOKEN_KEY, refreshTokenJwt, {
      maxAge: REFRESH_TOKEN_EXPIRY,
      ...DEFAULT_COOKIE_CONFIG,
    });

    return user;
  } catch {
    throw new UnauthorizedError();
  }
}

export async function logoutUserDB(rawRefreshToken: string) {
  try {
    const refreshTokenJwt = jwt.verify(rawRefreshToken, env.JWT_SECRET);
    const validatedRefreshToken = refreshTokenSchema.parse(refreshTokenJwt);

    await db
      .delete(sessionsTable)
      .where(
        eq(sessionsTable.sessionToken, validatedRefreshToken.sessionToken),
      );

    const cookieStore = await cookies();
    cookieStore.delete(REFRESH_TOKEN_KEY);
    cookieStore.delete(ACCESS_TOKEN_KEY);
  } catch {
    throw new UnauthorizedError();
  }
}
