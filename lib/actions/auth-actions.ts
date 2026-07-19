"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, SESSION_TTL_SECONDS, signSessionToken } from "@/lib/auth/session";
import { loginUser, registerUser } from "@/lib/services/auth-service";
import { ServiceError } from "@/lib/services/errors";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import type { ActionState } from "@/lib/actions/types";

async function createSessionCookie(userId: bigint, remember: boolean): Promise<void> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const token = signSessionToken({ userId: userId.toString(), exp });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    // Không tick "Ghi nhớ đăng nhập" -> cookie phiên (mất khi đóng trình
    // duyệt), thay vì luôn cố định 30 ngày.
    maxAge: remember ? SESSION_TTL_SECONDS : undefined,
    path: "/",
  });
}

export async function registerAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  try {
    const { userId } = await registerUser(parsed.data);
    await createSessionCookie(userId, true);
  } catch (error) {
    if (error instanceof ServiceError) {
      return error.field ? { fieldErrors: { [error.field]: [error.message] } } : { formError: error.message };
    }
    throw error;
  }

  redirect("/dashboard");
}

export async function loginAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  try {
    const { userId } = await loginUser(parsed.data);
    await createSessionCookie(userId, formData.get("remember") === "on");
  } catch (error) {
    if (error instanceof ServiceError) {
      return { formError: error.message };
    }
    throw error;
  }

  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/login");
}
