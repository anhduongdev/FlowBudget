import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Chạy `fn` trong 1 transaction đã set `app.current_user_id` cho session đó.
 * Bắt buộc dùng $transaction (không phải 2 lệnh rời) để đảm bảo SET và query
 * sau đó chạy trên cùng 1 connection — nếu không, connection pool có thể đưa
 * mỗi lệnh qua 1 connection khác nhau và RLS sẽ chặn nhầm.
 *
 * set_config(..., true) chỉ tồn tại trong phạm vi transaction hiện tại (tự
 * reset khi COMMIT/ROLLBACK) nên an toàn khi connection được tái sử dụng cho
 * request khác trong pool.
 */
export function withRLS<T>(userId: string, fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.current_user_id', ${userId}, TRUE)`;
    return fn(tx);
  });
}
