"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, type AuthFormState } from "@/lib/actions/auth-actions";

const GLASS_CARD_OVERRIDE_STYLE = { borderColor: "rgba(226, 232, 240, 0.5)" };
const GLASS_CARD_SHADOW =
  "shadow-[0_10px_25px_-5px_rgba(0,0,0,0.04),0_8px_10px_-6px_rgba(0,0,0,0.04)]";

const initialState: AuthFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="w-full primary-gradient-btn text-white font-label-md text-label-md py-md rounded-[0.75rem] flex items-center justify-center space-x-sm shadow-xl mt-lg disabled:opacity-70"
      disabled={pending}
      type="submit"
    >
      {pending ? (
        <span className="material-symbols-outlined animate-spin">
          progress_activity
        </span>
      ) : (
        <>
          <span>Đăng nhập ngay</span>
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "20px" }}
          >
            arrow_forward
          </span>
        </>
      )}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center p-md md:p-xxl bg-surface relative overflow-hidden">
      {/* Animated Atmospheric Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-tertiary-fixed-dim/10 rounded-full blur-[100px]"></div>
      <main className="w-full max-w-[1200px] grid md:grid-cols-2 gap-xxl items-center z-10">
        {/* Left Side: Branding & Visuals (Desktop Only) */}
        <div className="hidden md:flex flex-col space-y-lg text-left">
          <div className="flex items-center space-x-sm mb-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="FlowBudget"
              className="w-12 h-12 rounded-[0.75rem] shadow-lg"
              src="/logo.png"
            />
            <span className="font-headline-md text-headline-md text-on-surface tracking-tighter">
              FlowBudget
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface max-w-md">
            Kiểm soát tài chính thông minh, khởi đầu tương lai bền vững.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-sm">
            Nền tảng quản lý ngân sách tinh tế giúp bạn tối ưu hóa từng đồng
            tiền và đạt được mục tiêu tiết kiệm nhanh hơn.
          </p>
          <div className="relative w-full pt-xxl">
            <div
              className={`glass-card p-lg rounded-[0.75rem] floating-element max-w-[320px] relative z-20 ${GLASS_CARD_SHADOW}`}
              style={GLASS_CARD_OVERRIDE_STYLE}
            >
              <div className="flex justify-between items-center mb-md">
                <span className="font-label-md text-label-md text-on-surface-variant">
                  Số dư hiện tại
                </span>
                <span className="material-symbols-outlined text-primary">
                  trending_up
                </span>
              </div>
              <div className="font-headline-md text-headline-md text-primary mb-sm">
                ₫124,592,000
              </div>
              <div className="flex items-center space-x-xs">
                <span className="text-tertiary-fixed-variant font-label-sm text-label-sm bg-tertiary-fixed/20 px-2 py-0.5 rounded-full">
                  +12.5% tháng này
                </span>
              </div>
            </div>
            <div
              className={`absolute top-40 left-20 glass-card p-md rounded-[0.75rem] blur-[1px] opacity-60 scale-90 -z-10 ${GLASS_CARD_SHADOW}`}
              style={GLASS_CARD_OVERRIDE_STYLE}
            >
              <div className="w-40 h-2 bg-outline-variant rounded-full mb-2"></div>
              <div className="w-24 h-2 bg-outline-variant/40 rounded-full"></div>
            </div>
          </div>
        </div>
        {/* Right Side: Login Form */}
        <div className="w-full flex justify-center md:justify-end">
          <div
            className={`glass-card w-full max-w-[480px] p-lg md:p-xl rounded-[24px] flex flex-col items-center ${GLASS_CARD_SHADOW}`}
            style={GLASS_CARD_OVERRIDE_STYLE}
          >
            {/* Logo & Mobile Branding */}
            <div className="flex md:hidden items-center space-x-sm mb-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="FlowBudget"
                className="w-10 h-10 rounded-lg shadow-md"
                src="/logo.png"
              />
              <span className="font-headline-md text-headline-md text-on-surface tracking-tighter">
                FlowBudget
              </span>
            </div>
            <div className="text-center mb-xl">
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
                Chào mừng trở lại
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Vui lòng nhập thông tin để truy cập tài khoản
              </p>
            </div>
            <form action={formAction} className="w-full space-y-lg">
              {state.message && (
                <p
                  aria-live="polite"
                  className="font-label-md text-label-md text-error text-center"
                >
                  {state.message}
                </p>
              )}
              {/* Email Field */}
              <div className="space-y-sm">
                <label
                  className="font-label-md text-label-md text-on-surface flex items-center"
                  htmlFor="email"
                >
                  <span
                    className="material-symbols-outlined text-sm mr-2"
                    style={{ fontSize: "18px" }}
                  >
                    mail
                  </span>
                  Email của bạn
                </label>
                <div className="relative group">
                  <input
                    className="w-full bg-surface-container-low border border-outline-variant rounded-[0.75rem] px-lg py-md font-body-md text-body-md outline-none transition-all duration-300 input-focus-effect focus:bg-white"
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    required
                    type="email"
                  />
                </div>
                {state.errors?.email && (
                  <p className="font-label-sm text-label-sm text-error">
                    {state.errors.email[0]}
                  </p>
                )}
              </div>
              {/* Password Field */}
              <div className="space-y-sm">
                <div className="flex justify-between items-center">
                  <label
                    className="font-label-md text-label-md text-on-surface flex items-center"
                    htmlFor="password"
                  >
                    <span
                      className="material-symbols-outlined text-sm mr-2"
                      style={{ fontSize: "18px" }}
                    >
                      lock
                    </span>
                    Mật khẩu
                  </label>
                </div>
                <div className="relative group">
                  <input
                    className="w-full bg-surface-container-low border border-outline-variant rounded-[0.75rem] px-lg py-md font-body-md text-body-md outline-none transition-all duration-300 input-focus-effect focus:bg-white"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    type="password"
                  />
                </div>
                {state.errors?.password && (
                  <p className="font-label-sm text-label-sm text-error">
                    {state.errors.password[0]}
                  </p>
                )}
              </div>
              {/* Submit Button */}
              <SubmitButton />
            </form>
            {/* Footer Link */}
            <div className="mt-xl text-center">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Chưa có tài khoản?{" "}
                <Link
                  className="text-primary font-bold hover:underline transition-all ml-1"
                  href="/register"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
