import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { withRLS } from "@/lib/with-rls";

const SESSION_COOKIE = "session_token";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 ngày

// Token trong cookie là chuỗi ngẫu nhiên có entropy cao (32 byte), khác với
// mật khẩu người dùng — không cần thuật toán chậm (scrypt), chỉ cần hash
// một chiều để nếu lộ DB thì không suy ngược ra token thật trong cookie.
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await withRLS(userId, (tx) =>
    tx.user_sessions.create({
      data: { user_id: userId, refresh_token_hash: hashToken(token), expires_at: expiresAt },
    }),
  );

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

/**
 * Lấy user_id hiện tại từ cookie session, hoặc null nếu chưa đăng nhập /
 * session hết hạn / đã bị thu hồi.
 *
 * Dùng fn_lookup_session_user (SECURITY DEFINER) qua $queryRaw vì đây là bước
 * xác định danh tính — chạy TRƯỚC khi biết app.current_user_id để SET, nên
 * withRLS() chưa dùng được ở bước này (xem db/schema.sql mục 19).
 */
export async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const rows = await prisma.$queryRaw<{ fn_lookup_session_user: string | null }[]>`
    SELECT fn_lookup_session_user(${hashToken(token)})
  `;
  return rows[0]?.fn_lookup_session_user ?? null;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    const userId = await getCurrentUserId();
    if (userId) {
      await withRLS(userId, (tx) =>
        tx.user_sessions.updateMany({
          where: { user_id: userId, refresh_token_hash: hashToken(token) },
          data: { revoked_at: new Date() },
        }),
      );
    }
  }

  cookieStore.delete(SESSION_COOKIE);
}
