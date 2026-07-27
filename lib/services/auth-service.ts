import { cache } from "react";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import {
  createSession,
  destroySession,
  getSessionUserId,
} from "@/lib/auth/session";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "@/lib/repositories/user-repository";
import type { RegisterInput, LoginInput } from "@/lib/validations/auth";

export class EmailAlreadyRegisteredError extends Error {}
export class InvalidCredentialsError extends Error {}

export async function registerUser(input: RegisterInput) {
  const existingUser = await findUserByEmail(input.email);
  if (existingUser) {
    throw new EmailAlreadyRegisteredError("Email này đã được đăng ký.");
  }

  const passwordHash = await hashPassword(input.password);
  const user = await createUser({
    name: input.name,
    email: input.email,
    passwordHash,
  });

  await createSession(user.id.toString());
  return user;
}

export async function loginUser(input: LoginInput) {
  const user = await findUserByEmail(input.email);
  if (!user) {
    throw new InvalidCredentialsError("Email hoặc mật khẩu không đúng.");
  }

  const isPasswordValid = await verifyPassword(
    input.password,
    user.password_hash,
  );
  if (!isPasswordValid) {
    throw new InvalidCredentialsError("Email hoặc mật khẩu không đúng.");
  }

  await createSession(user.id.toString());
  return user;
}

export async function logoutUser(): Promise<void> {
  await destroySession();
}

export const getCurrentUser = cache(async () => {
  const userId = await getSessionUserId();
  if (!userId) {
    return null;
  }
  return findUserById(BigInt(userId));
});
