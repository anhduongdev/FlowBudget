import Link from "next/link";
import type { Metadata } from "next";
import { RegisterForm } from "@/app/(auth)/register/_components/RegisterForm";

export const metadata: Metadata = {
  title: "Đăng ký | SalaryCycle",
};

export default function RegisterPage() {
  return (
    <>
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            account_balance_wallet
          </span>
          <h1 className="font-headline-lg text-headline-lg font-black tracking-tight text-on-surface">
            SalaryCycle
          </h1>
        </div>
        <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Tạo tài khoản mới</h2>
        <p className="font-body-md text-on-surface-variant">Bắt đầu quản lý tài chính theo chu kỳ lương của bạn.</p>
      </div>

      <RegisterForm />

      <p className="font-label-md text-label-md text-on-surface-variant mt-10 text-center">
        Đã có tài khoản?{" "}
        <Link className="text-primary font-bold hover:underline" href="/login">
          Đăng nhập
        </Link>
      </p>
    </>
  );
}
