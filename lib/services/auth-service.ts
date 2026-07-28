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
  findUserCredentialsById,
  updateUserName,
  updateUserPassword,
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

export async function updateUserProfile(userId: bigint, name: string) {
  return updateUserName(userId, name);
}

export async function changeUserPassword(
  userId: bigint,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const credentials = await findUserCredentialsById(userId);
  if (!credentials) {
    throw new InvalidCredentialsError("Người dùng không tồn tại.");
  }

  const isCurrentPasswordValid = await verifyPassword(
    currentPassword,
    credentials.password_hash,
  );
  if (!isCurrentPasswordValid) {
    throw new InvalidCredentialsError("Mật khẩu hiện tại không đúng.");
  }

  const newPasswordHash = await hashPassword(newPassword);
  await updateUserPassword(userId, newPasswordHash);
}
