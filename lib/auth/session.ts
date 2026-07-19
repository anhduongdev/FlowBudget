import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "@/lib/env";

export const SESSION_COOKIE_NAME = "mfb_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 ngày

type SessionPayload = { userId: string; exp: number };

// Cookie session ký bằng HMAC-SHA256 (node:crypto có sẵn, không cần thư viện
// JWT ngoài). Không cần bảng sessions trong DB — đánh đổi: không thu hồi được
// phiên từ xa, chấp nhận được cho quy mô app cá nhân này.
function sign(data: string): string {
  return createHmac("sha256", env.SESSION_SECRET).update(data).digest("base64url");
}

export function signSessionToken(payload: SessionPayload): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${data}.${sign(data)}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  const [data, signature] = token.split(".");
  if (!data || !signature) return null;

  const expectedSignature = sign(data);
  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (sigBuffer.length !== expectedBuffer.length || !timingSafeEqual(sigBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as SessionPayload;
    if (typeof payload.userId !== "string" || typeof payload.exp !== "number") return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
