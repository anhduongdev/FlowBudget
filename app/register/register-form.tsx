"use client";

import { useEffect } from "react";

export function RegisterForm() {
  useEffect(() => {
    const inputs = document.querySelectorAll("input");
    const onFocus = function (this: HTMLInputElement) {
      this.parentElement?.parentElement?.classList.add("scale-[1.01]");
    };
    const onBlur = function (this: HTMLInputElement) {
      this.parentElement?.parentElement?.classList.remove("scale-[1.01]");
    };
    inputs.forEach((input) => {
      input.addEventListener("focus", onFocus);
      input.addEventListener("blur", onBlur);
    });

    const submitBtn = document.querySelector<HTMLButtonElement>(
      'button[type="submit"]',
    );
    const onClick = function (this: HTMLButtonElement) {
      const originalContent = this.innerHTML;
      this.innerHTML = `<span class="material-symbols-outlined animate-spin">sync</span> <span>Đang xử lý...</span>`;
      this.disabled = true;
      this.style.opacity = "0.8";

      setTimeout(() => {
        this.innerHTML = originalContent;
        this.disabled = false;
        this.style.opacity = "1";
      }, 2000);
    };
    submitBtn?.addEventListener("click", onClick);

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener("focus", onFocus);
        input.removeEventListener("blur", onBlur);
      });
      submitBtn?.removeEventListener("click", onClick);
    };
  }, []);

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
        <div className="hidden md:flex w-1/2 bg-[linear-gradient(135deg,#4338ca_0%,#2a14b4_100%)] p-12 flex-col justify-between text-on-primary">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-[0.75rem] flex items-center justify-center">
                <span className="material-symbols-outlined text-primary font-bold">
                  account_balance_wallet
                </span>
              </div>
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
              data-alt="A sophisticated digital interface of a financial dashboard showing colorful charts and spending categories. The aesthetic is modern and premium with soft ambient lighting and a clean glassmorphism style, using deep indigo and vibrant teal accents on a light background. High quality 3D render style."
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
              <span className="material-symbols-outlined text-primary-container text-3xl">
                account_balance_wallet
              </span>
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
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Full Name Field */}
            <div className="space-y-2">
              <label
                className="font-label-md text-label-md text-on-surface-variant block ml-1"
                htmlFor="fullname"
              >
                Họ và tên
              </label>
              <div className="relative flex items-center group">
                <span className="material-symbols-outlined absolute left-4 text-outline group-focus-within:text-primary transition-colors">
                  person
                </span>
                <input
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-outline-variant/50 rounded-[0.75rem] font-body-md text-on-surface placeholder:text-outline/50 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300"
                  id="fullname"
                  placeholder="Nguyễn Văn A"
                  type="text"
                />
              </div>
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
                  placeholder="example@flowbudget.com"
                  type="email"
                />
              </div>
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
                    placeholder="••••••••"
                    type="password"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  className="font-label-md text-label-md text-on-surface-variant block ml-1"
                  htmlFor="confirm-password"
                >
                  Xác nhận
                </label>
                <div className="relative flex items-center group">
                  <span className="material-symbols-outlined absolute left-4 text-outline group-focus-within:text-primary transition-colors">
                    lock_reset
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-outline-variant/50 rounded-[0.75rem] font-body-md text-on-surface placeholder:text-outline/50 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300"
                    id="confirm-password"
                    placeholder="••••••••"
                    type="password"
                  />
                </div>
              </div>
            </div>
            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 py-2">
              <div className="flex items-center h-5">
                <input
                  className="w-5 h-5 text-primary bg-surface-container-low border-outline-variant/50 rounded focus:ring-primary focus:ring-offset-2"
                  id="terms"
                  type="checkbox"
                />
              </div>
              <label
                className="font-label-md text-label-md text-on-surface-variant"
                htmlFor="terms"
              >
                Tôi đồng ý với{" "}
                <a className="text-primary font-bold hover:underline" href="#">
                  Điều khoản dịch vụ
                </a>{" "}
                và{" "}
                <a className="text-primary font-bold hover:underline" href="#">
                  Chính sách bảo mật
                </a>{" "}
                của FlowBudget.
              </label>
            </div>
            {/* Action Button */}
            <button
              className="w-full py-4 bg-[linear-gradient(135deg,#4338ca_0%,#2a14b4_100%)] text-on-primary font-label-md text-md rounded-[0.75rem] shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group"
              type="submit"
            >
              <span>Đăng ký ngay</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
            {/* Social Sign Up (Optional context filler) */}
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-outline-variant/30"></div>
              <span className="flex-shrink mx-4 font-label-sm text-outline uppercase tracking-widest">
                Hoặc đăng ký bằng
              </span>
              <div className="flex-grow border-t border-outline-variant/30"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3 border border-outline-variant/50 rounded-[0.75rem] hover:bg-surface-container-low transition-colors duration-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Google Logo"
                  className="w-5 h-5"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9KLvE7oA9aXuHGl5-Gbc3ZsisDwZVR5RYWhj73FCSDkw0ktTqr5fS2FRSOLnGvNM77kAPtp04jK29fxMkZViyh4nVw30pEWXER94MW6J_x1aB1hn7uT8V3ZL4uqC5X7iMrk0_w2zNzPVYDacfcE4QPhyMPVf3HH-z4lRGBrJPIQcvBSe5agqafUjIVAsgLgKQJ3_ICfGEmM-tPZXjMKy3DEd3UTHJrqVYbOJQTt9sX6aiBuus8dkBvFYA4pDbeGDHfTDbn__U0A"
                />
                <span className="font-label-md">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-3 border border-outline-variant/50 rounded-[0.75rem] hover:bg-surface-container-low transition-colors duration-200">
                <span
                  className="material-symbols-outlined text-blue-600"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  qr_code_2
                </span>
                <span className="font-label-md">Facebook</span>
              </button>
            </div>
            {/* Login Redirect */}
            <div className="text-center pt-6">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Đã có tài khoản?{" "}
                <a
                  className="text-primary font-bold hover:underline ml-1"
                  href="#"
                >
                  Đăng nhập tại đây
                </a>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
