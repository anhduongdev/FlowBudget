import Link from "next/link";
import type { Metadata } from "next";
import { LoginForm } from "@/app/(auth)/login/_components/LoginForm";

export const metadata: Metadata = {
  title: "Đăng nhập | SalaryCycle",
};

const socialProviders = [
  {
    name: "Google",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="currentColor"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="currentColor"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
          fill="currentColor"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: "Apple",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          d="M16.36 14c.08-.66.14-1.32.14-2c0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2m-5.15 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.62c-.62 1.62-1.57 3.06-2.78 4.22c-.44-.2-.84-.42-1.22-.66m0-15.12c.38-.24.78-.46 1.22-.66c1.21 1.16 2.16 2.6 2.78 4.22h-2.62c-.32-1.25-.78-2.45-1.38-3.56m-1.1 15.54c-.36.01-.73.02-1.11.02c-.38 0-.75-.01-1.11-.02c.5-1.22.88-2.52 1.11-3.88c.23 1.36.61 2.66 1.11 3.88m-1.11-17.98c.38 0 .75.01 1.11.02c-.5 1.22-.88 2.52-1.11 3.88c-.23-1.36-.61-2.66-1.11-3.88c.36-.01.73-.02 1.11-.02m-4.62 13.56c-1.21-1.16-2.16-2.6-2.78-4.22h2.62c.32 1.25.78 2.45 1.38 3.56c-.38.24-.78.46-1.22.66m0-15.12c.44.2.84.42 1.22.66c-.6 1.11-1.06 2.31-1.38 3.56H4.74c.62-1.62 1.57-3.06 2.78-4.22M3.59 14c-.16-.64-.26-1.31-.26-2s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2c0 .68.06 1.34.14 2m9.82 4h-2.82c-.32-1.29-.78-2.52-1.38-3.66h5.58c-.6 1.14-1.06 2.37-1.38 3.66m-2.82-12h2.82c.32 1.29.78 2.52 1.38 3.66H7.81c.6-1.14 1.06-2.37 1.38-3.66M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

export default function LoginPage() {
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
        <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Chào mừng trở lại</h2>
        <p className="font-body-md text-on-surface-variant">Quản lý chu kỳ tài chính của bạn một cách thông minh.</p>
      </div>

      <LoginForm />

      <div className="mt-10 flex flex-col items-center gap-6">
        <div className="w-full flex items-center gap-4">
          <div className="h-px flex-1 bg-outline-variant" />
          <span className="font-label-sm text-label-sm text-outline">Hoặc tiếp tục với</span>
          <div className="h-px flex-1 bg-outline-variant" />
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          {socialProviders.map((provider) => (
            <button
              key={provider.name}
              className="flex items-center justify-center gap-2 py-3 border border-outline-variant rounded-lg font-label-md text-label-md hover:bg-surface-variant/30 transition-all"
              type="button"
            >
              {provider.icon}
              {provider.name}
            </button>
          ))}
        </div>

        <p className="font-label-md text-label-md text-on-surface-variant">
          Chưa có tài khoản?{" "}
          <Link className="text-primary font-bold hover:underline" href="/register">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </>
  );
}
