import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { RegisterForm } from "@/app/(auth)/register/_components/RegisterForm";

export const metadata: Metadata = {
  title: "Đăng ký | MyFlowBudget",
};

export default async function RegisterPage() {
  const userId = await getCurrentUserId();
  if (userId !== null) redirect("/dashboard");

  return (
    <>
      <div className="mb-lg text-center">
        <div className="mb-md inline-flex h-16 w-16 items-center justify-center rounded-xl bg-primary-container text-on-primary-container shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-[32px]">account_balance_wallet</span>
        </div>
        <h1 className="mb-xs text-headline-lg text-on-surface">Bắt đầu với MyFlowBudget</h1>
        <p className="font-body-md text-on-surface-variant">Quản lý dòng tiền của bạn một cách kỷ luật và hiện đại.</p>
      </div>

      <div className="glass-card rounded-xl p-lg shadow-2xl">
        <RegisterForm />
      </div>

      <div className="mt-lg text-center">
        <p className="font-body-md text-on-surface-variant">
          Đã có tài khoản?{" "}
          <Link className="font-bold text-primary underline decoration-2 underline-offset-4 transition-all hover:underline" href="/login">
            Đăng nhập
          </Link>
        </p>
      </div>
    </>
  );
}
