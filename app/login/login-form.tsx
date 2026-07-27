"use client";

import { useEffect, useRef } from "react";

const GLASS_CARD_OVERRIDE_STYLE = { borderColor: "rgba(226, 232, 240, 0.5)" };
const GLASS_CARD_SHADOW =
  "shadow-[0_10px_25px_-5px_rgba(0,0,0,0.04),0_8px_10px_-6px_rgba(0,0,0,0.04)]";

export function LoginForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const inputs = document.querySelectorAll("input");
    const onFocus = (e: FocusEvent) => {
      (e.currentTarget as HTMLInputElement).parentElement?.classList.add(
        "scale-[1.01]",
      );
    };
    const onBlur = (e: FocusEvent) => {
      (e.currentTarget as HTMLInputElement).parentElement?.classList.remove(
        "scale-[1.01]",
      );
    };
    inputs.forEach((input) => {
      input.addEventListener("focus", onFocus);
      input.addEventListener("blur", onBlur);
    });

    const form = formRef.current;
    const onSubmit = (e: SubmitEvent) => {
      e.preventDefault();
      const btn = submitBtnRef.current;
      if (!btn) return;
      const originalContent = btn.innerHTML;
      btn.innerHTML =
        '<span class="material-symbols-outlined animate-spin">progress_activity</span>';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML =
          '<span class="material-symbols-outlined">check_circle</span> <span>Thành công!</span>';
        btn.classList.replace("primary-gradient-btn", "bg-tertiary");
        setTimeout(() => {
          btn.innerHTML = originalContent;
          btn.classList.replace("bg-tertiary", "primary-gradient-btn");
          btn.disabled = false;
        }, 2000);
      }, 1500);
    };
    form?.addEventListener("submit", onSubmit);

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener("focus", onFocus);
        input.removeEventListener("blur", onBlur);
      });
      form?.removeEventListener("submit", onSubmit);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-md md:p-xxl bg-surface relative overflow-hidden">
      {/* Animated Atmospheric Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-tertiary-fixed-dim/10 rounded-full blur-[100px]"></div>
      <main className="w-full max-w-[1200px] grid md:grid-cols-2 gap-xxl items-center z-10">
        {/* Left Side: Branding & Visuals (Desktop Only) */}
        <div className="hidden md:flex flex-col space-y-lg text-left">
          <div className="flex items-center space-x-sm mb-sm">
            <div className="w-12 h-12 bg-primary rounded-[0.75rem] flex items-center justify-center shadow-lg">
              <span
                className="material-symbols-outlined text-white text-[32px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                account_balance_wallet
              </span>
            </div>
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
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md">
                <span
                  className="material-symbols-outlined text-white text-[24px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  account_balance_wallet
                </span>
              </div>
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
            <form
              ref={formRef}
              action="#"
              className="w-full space-y-lg"
              method="POST"
            >
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
                  <a
                    className="font-label-sm text-label-sm text-primary hover:underline transition-all"
                    href="#"
                  >
                    Quên mật khẩu?
                  </a>
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
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined">
                      visibility
                    </span>
                  </button>
                </div>
              </div>
              {/* Remember Me & Policy */}
              <div className="flex items-center">
                <input
                  className="h-4 w-4 text-primary focus:ring-primary border-outline-variant rounded"
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                />
                <label
                  className="ml-2 block font-label-sm text-label-sm text-on-surface-variant"
                  htmlFor="remember-me"
                >
                  Duy trì đăng nhập trong 30 ngày
                </label>
              </div>
              {/* Submit Button */}
              <button
                ref={submitBtnRef}
                className="w-full primary-gradient-btn text-white font-label-md text-label-md py-md rounded-[0.75rem] flex items-center justify-center space-x-sm shadow-xl mt-lg"
                type="submit"
              >
                <span>Đăng nhập ngay</span>
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "20px" }}
                >
                  arrow_forward
                </span>
              </button>
            </form>
            {/* Divider */}
            <div className="w-full flex items-center my-xl">
              <div className="flex-grow border-t border-outline-variant/30"></div>
              <span className="px-md font-label-sm text-label-sm text-outline uppercase tracking-wider">
                Hoặc
              </span>
              <div className="flex-grow border-t border-outline-variant/30"></div>
            </div>
            {/* Social Logins */}
            <div className="w-full grid grid-cols-2 gap-md">
              <button className="flex items-center justify-center space-x-sm py-sm px-md border border-outline-variant rounded-[0.75rem] hover:bg-surface-container transition-colors duration-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Google Logo"
                  className="w-5 h-5"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdx1kg_88e71FlyeAZ5oXonIA2-2CHh0raJowAizyb5G9UD7ucNaFBpmv4bfAlJMHNAHv8zvt-5UzSoqH9lHbBARCdG9kByJQEtLLOTL0FUJ2VHhbjqsBlmpdRKtfZGN6Dcs0VuxJv6rGMQZ42dhK8IRfWMzhLF0JvYlNbrapRnyg4rP1yPlUpN0Qa7EfD4mhGYx-uj-bwtzDqPHS3J1VHOonM4kUo2R5m_FvdDcGqk7YNtWb_ol8d0nPRqNPAoHNsXZ69UkNL8w"
                />
                <span className="font-label-sm text-label-sm text-on-surface">
                  Google
                </span>
              </button>
              <button className="flex items-center justify-center space-x-sm py-sm px-md border border-outline-variant rounded-[0.75rem] hover:bg-surface-container transition-colors duration-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Apple Logo"
                  className="w-5 h-5"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVgXb5CBUanseMGBm5gHQItCBSS47-Zk3JLB1dtCH3ZFxFfEyz01ucxEigpycakt3im5fHhe_bwme6SoJ1OrKWWkqSbxH-O-PzrurWQMYoLzdxXB5cUcfUFPyCYCSHkdLhSbN9EYv2NAANiPXM_g6nZ62xIrKd8cwWH0o1_DqsJ-aABGIb3HH7o9Iues8wxhB0NwQZIJWG7R6o3hLDR4P_N2Demge340vkfbUrOAd-PHYGGIyW4vgeUVN8qNvVkbqfcicNOoy8WA"
                />
                <span className="font-label-sm text-label-sm text-on-surface">
                  Apple ID
                </span>
              </button>
            </div>
            {/* Footer Link */}
            <div className="mt-xl text-center">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Chưa có tài khoản?{" "}
                <a
                  className="text-primary font-bold hover:underline transition-all ml-1"
                  href="#"
                >
                  Đăng ký ngay
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
