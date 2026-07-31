"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { registerAction, type AuthFormState } from "@/lib/actions/auth-actions";

const initialState: AuthFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="w-full py-4 bg-[linear-gradient(135deg,#3063b5_0%,#18448b_100%)] text-on-primary font-label-md text-md rounded-[0.75rem] shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:hover:scale-100"
      disabled={pending}
      type="submit"
    >
      {pending ? (
        <span className="material-symbols-outlined animate-spin">sync</span>
      ) : (
        <>
          <span>Đăng ký ngay</span>
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </>
      )}
    </button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      {/* Background Decoration */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute top-[60%] -right-[5%] w-[35%] h-[35%] rounded-full bg-tertiary-fixed/10 blur-3xl"></div>
      </div>
      {/* Main Auth Container */}
      <main className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row items-stretch justify-center gap-0 overflow-hidden rounded-[24px] glass-card shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_20px_25px_-5px_rgba(0,0,0,0.04)]">
        {/* Left Side: Visual/Branding (Hidden on mobile for focus) */}
        <div className="hidden md:flex w-1/2 bg-[linear-gradient(135deg,#3063b5_0%,#18448b_100%)] p-12 flex-col justify-between text-on-primary">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="FlowBudget"
                className="w-10 h-10 rounded-[0.75rem]"
                src="/logo.png"
              />
              <span className="font-headline-md text-headline-md font-bold tracking-tighter">
                FlowBudget
              </span>
            </div>
            <div className="pt-12">
              <h2 className="font-display-lg text-headline-lg leading-tight mb-4">
                Làm chủ dòng tiền của bạn.
              </h2>
              <p className="font-body-lg text-body-lg opacity-80">
                Gia nhập cộng đồng hơn 50,000 người dùng đang tối ưu hóa tài
                chính mỗi ngày cùng FlowBudget.
              </p>
            </div>
          </div>
          <div className="relative h-64 w-full rounded-2xl overflow-hidden mt-8">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm z-10"></div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-full h-full object-cover"
              alt=""
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBw_8iEVeTQ5bNZfYcyRR77MyNal1za1PCkpjUVVI-lGT3lcc46b9cOfQDk8ZXpEoSTd31UXmbPy4gCdii_lYpx73O0pqjRTxOQ8wah50EiJudKRjYYGVI1UjlKjHkcRBofGVREpzl7nVf7a0ecuD9CG3U-s6OM8Y0YtFI_o8uPE-rV7jnTwOd3MMYVedJWHzAfk3a_d5C1kH5H8YJmaqSbCodG_WvmWKFKuscdqQ_gzejSnRazZOrMEiiOyWm5NoVj4LT1bcCafQ"
            />
            <div className="absolute bottom-6 left-6 right-6 z-20">
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-[0.75rem] border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="material-symbols-outlined text-white text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    stars
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Đánh giá 5 sao
                  </span>
                </div>
                <p className="text-sm italic">
                  &quot;Công cụ tuyệt vời nhất để tôi theo dõi các khoản chi
                  tiêu và tiết kiệm cho tương lai.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Right Side: Register Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <div className="md:hidden flex items-center gap-2 mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="FlowBudget"
                className="w-8 h-8 rounded-lg"
                src="/logo.png"
              />
              <span className="font-headline-md text-headline-md font-bold text-on-surface">
                FlowBudget
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">
              Tạo tài khoản mới
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Bắt đầu hành trình tự do tài chính của bạn ngay hôm nay.
            </p>
          </div>
          <form action={formAction} className="space-y-5">
            {state.message && (
              <p
                aria-live="polite"
                className="font-label-md text-label-md text-error"
              >
                {state.message}
              </p>
            )}
            {/* Full Name Field */}
            <div className="space-y-2">
              <label
                className="font-label-md text-label-md text-on-surface-variant block ml-1"
                htmlFor="name"
              >
                Họ và tên
              </label>
              <div className="relative flex items-center group">
                <span className="material-symbols-outlined absolute left-4 text-outline group-focus-within:text-primary transition-colors">
                  person
                </span>
                <input
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-outline-variant/50 rounded-[0.75rem] font-body-md text-on-surface placeholder:text-outline/50 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300"
                  id="name"
                  name="name"
                  placeholder="Nguyễn Văn A"
                  required
                  type="text"
                />
              </div>
              {state.errors?.name && (
                <p className="font-label-sm text-label-sm text-error ml-1">
                  {state.errors.name[0]}
                </p>
              )}
            </div>
            {/* Email Field */}
            <div className="space-y-2">
              <label
                className="font-label-md text-label-md text-on-surface-variant block ml-1"
                htmlFor="email"
              >
                Địa chỉ Email
              </label>
              <div className="relative flex items-center group">
                <span className="material-symbols-outlined absolute left-4 text-outline group-focus-within:text-primary transition-colors">
                  mail
                </span>
                <input
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-outline-variant/50 rounded-[0.75rem] font-body-md text-on-surface placeholder:text-outline/50 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300"
                  id="email"
                  name="email"
                  placeholder="example@flowbudget.com"
                  required
                  type="email"
                />
              </div>
              {state.errors?.email && (
                <p className="font-label-sm text-label-sm text-error ml-1">
                  {state.errors.email[0]}
                </p>
              )}
            </div>
            {/* Password Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  className="font-label-md text-label-md text-on-surface-variant block ml-1"
                  htmlFor="password"
                >
                  Mật khẩu
                </label>
                <div className="relative flex items-center group">
                  <span className="material-symbols-outlined absolute left-4 text-outline group-focus-within:text-primary transition-colors">
                    lock
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-outline-variant/50 rounded-[0.75rem] font-body-md text-on-surface placeholder:text-outline/50 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    type="password"
                  />
                </div>
                {state.errors?.password && (
                  <p className="font-label-sm text-label-sm text-error ml-1">
                    {state.errors.password[0]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label
                  className="font-label-md text-label-md text-on-surface-variant block ml-1"
                  htmlFor="confirmPassword"
                >
                  Xác nhận
                </label>
                <div className="relative flex items-center group">
                  <span className="material-symbols-outlined absolute left-4 text-outline group-focus-within:text-primary transition-colors">
                    lock_reset
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-outline-variant/50 rounded-[0.75rem] font-body-md text-on-surface placeholder:text-outline/50 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    required
                    type="password"
                  />
                </div>
                {state.errors?.confirmPassword && (
                  <p className="font-label-sm text-label-sm text-error ml-1">
                    {state.errors.confirmPassword[0]}
                  </p>
                )}
              </div>
            </div>
            {/* Action Button */}
            <SubmitButton />
            {/* Login Redirect */}
            <div className="text-center pt-6">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Đã có tài khoản?{" "}
                <Link
                  className="text-primary font-bold hover:underline ml-1"
                  href="/login"
                >
                  Đăng nhập tại đây
                </Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
