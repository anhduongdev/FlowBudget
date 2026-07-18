import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/auth/session";
import { logoutAction } from "@/lib/actions/auth";
import { prisma } from "@/lib/prisma";
import { withRLS } from "@/lib/with-rls";

// Trang tạm thời để verify luồng auth end-to-end (đăng ký/đăng nhập → có
// session → xem được dữ liệu riêng của mình). Dashboard thật sẽ thay thế sau.
export default async function DashboardPage() {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/login");
  }

  const user = await prisma.users.findUniqueOrThrow({ where: { id: userId } });
  const wallets = await withRLS(userId, (tx) => tx.wallets.findMany());

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 text-center">
      <p className="text-on-surface-variant">
        Xin chào, <span className="text-on-surface font-bold">{user.full_name ?? user.email}</span>
      </p>
      <p className="text-body-sm text-on-surface-variant">Bạn có {wallets.length} ví (mặc định khi mới đăng ký: 0).</p>
      <form action={logoutAction}>
        <button
          className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-full hover:opacity-90 transition-all"
          type="submit"
        >
          Đăng xuất
        </button>
      </form>
    </div>
  );
}
