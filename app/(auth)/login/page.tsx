import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { LoginForm } from "@/app/(auth)/login/_components/LoginForm";

export const metadata: Metadata = {
  title: "Đăng nhập | MyFlowBudget",
};

export default async function LoginPage() {
  const userId = await getCurrentUserId();
  if (userId !== null) redirect("/dashboard");

  return (
    <div className="glass-card rounded-2xl p-lg shadow-2xl">
      <div className="mb-lg flex flex-col items-center">
        <div className="mb-md flex h-16 w-16 items-center justify-center rounded-xl bg-primary-container shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-[40px] text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
            account_balance_wallet
          </span>
        </div>
        <h1 className="text-headline-md tracking-tight text-on-surface">MyFlowBudget</h1>
        <p className="mt-xs font-label-md text-on-surface-variant">Quản lý dòng tiền thông minh</p>
      </div>

      <LoginForm />

      <p className="mt-lg text-center font-label-md text-on-surface-variant">
        Chưa có tài khoản?{" "}
        <Link className="ml-1 font-bold text-primary hover:underline" href="/register">
          Đăng ký ngay
        </Link>
      </p>

      <div className="mt-lg text-center opacity-50">
        <p className="font-label-sm text-outline">© 2024 MyFlowBudget. Bảo mật và mã hóa.</p>
      </div>
    </div>
  );
}
