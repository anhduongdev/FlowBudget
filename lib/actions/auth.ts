"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";
import { loginSchema, registerSchema } from "@/lib/validations/auth";

export type AuthActionState = {
  fieldErrors?: Record<string, string[]>;
  formError?: string;
} | null;

export async function registerAction(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const { fullName, email, password } = parsed.data;

  const existing = await prisma.users.findFirst({ where: { email } });
  if (existing) {
    return { fieldErrors: { email: ["Email này đã được đăng ký"] } };
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.users.create({
    data: { email, password_hash: passwordHash, full_name: fullName },
  });

  await createSession(user.id);
  redirect("/dashboard");
}

export async function loginAction(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const { email, password } = parsed.data;

  const user = await prisma.users.findFirst({ where: { email, deleted_at: null } });
  const passwordOk = user ? await verifyPassword(password, user.password_hash) : false;

  // Cố tình không phân biệt "sai email" và "sai mật khẩu" trong thông báo lỗi
  // để tránh lộ thông tin email nào đã tồn tại trong hệ thống.
  if (!user || !passwordOk) {
    return { formError: "Email hoặc mật khẩu không đúng" };
  }

  await createSession(user.id);
  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}
