import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";

export async function getCurrentUserId(): Promise<bigint | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifySessionToken(token);
  if (!payload) return null;

  try {
    return BigInt(payload.userId);
  } catch {
    return null;
  }
}

export async function requireCurrentUserId(): Promise<bigint> {
  const userId = await getCurrentUserId();
  if (userId === null) {
    redirect("/login");
  }
  return userId;
}
