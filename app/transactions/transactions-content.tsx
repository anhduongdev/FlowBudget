"use client";

import { useEffect } from "react";

export function TransactionsContent() {
  useEffect(() => {
    const header = document.querySelector("header");
    const onScroll = () => {
      if (window.scrollY > 20) {
        header?.classList.add("shadow-md");
      } else {
        header?.classList.remove("shadow-md");
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Sidebar Navigation */}
      <aside className="h-screen w-72 flex flex-col fixed left-0 top-0 bg-white/70 backdrop-blur-xl border-r border-outline-variant/30 shadow-2xl py-8 px-6 z-50">
        <div className="mb-10">
          <h1 className="font-display-lg text-display-lg font-black tracking-tighter text-primary">
            FlowBudget
          </h1>
        </div>
        <nav className="flex-1 space-y-2">
          {/* Dashboard */}
          <a
            className="flex items-center gap-4 py-3 px-4 rounded-[0.75rem] text-on-surface-variant hover:bg-surface-container-highest/40 transition-all duration-300 ease-in-out group"
            href="#"
          >
            <span className="material-symbols-outlined group-hover:text-primary">
              dashboard
            </span>
            <span className="font-label-md text-label-md">Dashboard</span>
          </a>
          {/* Transactions - ACTIVE */}
          <a
            className="flex items-center gap-4 py-3 px-4 rounded-[0.75rem] text-primary font-bold border-r-4 border-primary bg-surface-container-low/50 scale-[0.98] transition-transform duration-200"
            href="#"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              payments
            </span>
            <span className="font-label-md text-label-md">Transactions</span>
          </a>
          {/* Accounts */}
          <a
            className="flex items-center gap-4 py-3 px-4 rounded-[0.75rem] text-on-surface-variant hover:bg-surface-container-highest/40 transition-all duration-300 ease-in-out group"
            href="#"
          >
            <span className="material-symbols-outlined group-hover:text-primary">
              account_balance_wallet
            </span>
            <span className="font-label-md text-label-md">Accounts</span>
          </a>
          {/* Budgets */}
          <a
            className="flex items-center gap-4 py-3 px-4 rounded-[0.75rem] text-on-surface-variant hover:bg-surface-container-highest/40 transition-all duration-300 ease-in-out group"
            href="#"
          >
            <span className="material-symbols-outlined group-hover:text-primary">
              account_balance
            </span>
            <span className="font-label-md text-label-md">Budgets</span>
          </a>
          {/* Savings */}
          <a
            className="flex items-center gap-4 py-3 px-4 rounded-[0.75rem] text-on-surface-variant hover:bg-surface-container-highest/40 transition-all duration-300 ease-in-out group"
            href="#"
          >
            <span className="material-symbols-outlined group-hover:text-primary">
              savings
            </span>
            <span className="font-label-md text-label-md">Savings</span>
          </a>
          {/* Settings */}
          <a
            className="flex items-center gap-4 py-3 px-4 rounded-[0.75rem] text-on-surface-variant hover:bg-surface-container-highest/40 transition-all duration-300 ease-in-out group"
            href="#"
          >
            <span className="material-symbols-outlined group-hover:text-primary">
              settings
            </span>
            <span className="font-label-md text-label-md">Settings</span>
          </a>
        </nav>
        <div className="mt-auto pt-8 border-t border-outline-variant/30">
          <div className="flex items-center gap-4 mb-6 px-2">
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Alex Sterling"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqN2aWM1kpe5HGtVJ0mcyCad9RcY5tk-mIuXNjYCrJgAo5CLcdAKQpAmgk15KWSlmpLmtXOp0VHyQH2GInCDOvSHPc-1y3PIA_s5KvbOpKNlsWbpugzC1BNb6p3UbUk64cSAh5Hd62LkDuwbKK4EakLvuDmUj-bozSm4DNQxeDhFPeYYCA3cK3sM_g6JDXecO2UviT5xXfne8zIQOwiaJREY4YNW_t0bwwVTUFKRH04c7Hulws4tDnDS-Vnw1hqp6UpP4QAJn51g"
              />
            </div>
            <div>
              <p className="font-label-md text-label-md text-on-surface">
                Alex Sterling
              </p>
              <p className="text-xs text-outline">$124,592.00</p>
            </div>
          </div>
          <div className="space-y-1">
            <a
              className="flex items-center gap-4 py-2 px-4 rounded-[0.75rem] text-on-surface-variant hover:bg-surface-container-highest/40 transition-all group"
              href="#"
            >
              <span className="material-symbols-outlined text-sm">
                help_outline
              </span>
              <span className="text-sm font-medium">Support</span>
            </a>
            <a
              className="flex items-center gap-4 py-2 px-4 rounded-[0.75rem] text-error hover:bg-error-container/20 transition-all group"
              href="#"
            >
              <span className="material-symbols-outlined text-sm">
                logout
              </span>
              <span className="text-sm font-medium">Logout</span>
            </a>
          </div>
        </div>
      </aside>
      {/* Main Content Area */}
      <main className="ml-72 flex-1 min-h-screen relative">
        {/* Top Navigation */}
        <header className="flex justify-between items-center w-full h-20 px-8 sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30">
          <div className="flex items-center gap-8">
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
              Giao dịch
            </h2>
            <nav className="hidden lg:flex items-center gap-6">
              <a
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors"
                href="#"
              >
                Ngày
              </a>
              <a
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors"
                href="#"
              >
                Tuần
              </a>
              <a
                className="font-label-sm text-label-sm text-primary font-semibold border-b-2 border-primary pb-1"
                href="#"
              >
                Tháng
              </a>
              <a
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors"
                href="#"
              >
                Năm
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                search
              </span>
              <input
                className="bg-surface-container-low border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 w-64"
                placeholder="Tìm kiếm giao dịch..."
                type="text"
              />
            </div>
            <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-highest/50 transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">
                notifications
              </span>
            </button>
          </div>
        </header>
        {/* Content Canvas */}
        <div className="p-xl space-y-xl max-w-6xl mx-auto">
          {/* Transactions List */}
          <section className="space-y-xl">
            {/* Date Group: 25 THÁNG 7 */}
            <div className="space-y-md">
              <div className="flex justify-between items-center pb-sm border-b border-outline-variant/30 px-2">
                <div className="flex items-center gap-4">
                  <span className="text-[40px] font-black text-primary leading-none">
                    25
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                      Hôm nay
                    </span>
                    <span className="text-label-sm font-bold text-on-surface">
                      THÁNG 7 2026
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-headline-md text-error font-bold">
                    239.000 đ
                  </span>
                </div>
              </div>
              <div className="space-y-base">
                {/* Transaction Item 1 */}
                <div className="flex items-center justify-between p-4 bg-white/50 hover:bg-white rounded-2xl transition-all group">
                  <div className="flex items-center gap-md">
                    <div className="w-12 h-12 rounded-full bg-[#FFD54F] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                      <span
                        className="material-symbols-outlined text-2xl"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        shopping_bag
                      </span>
                    </div>
                    <div>
                      <h4 className="font-label-md text-on-surface">
                        ShopeeVip
                      </h4>
                      <p className="text-xs text-outline flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          credit_card
                        </span>{" "}
                        Thẻ
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-md text-error font-bold">
                      29.000 đ
                    </span>
                  </div>
                </div>
                {/* Transaction Item 2 */}
                <div className="flex items-center justify-between p-4 bg-white/50 hover:bg-white rounded-2xl transition-all group">
                  <div className="flex items-center gap-md">
                    <div className="w-12 h-12 rounded-full bg-[#42A5F5] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                      <span
                        className="material-symbols-outlined text-2xl"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        shopping_basket
                      </span>
                    </div>
                    <div>
                      <h4 className="font-label-md text-on-surface">
                        Bách hóa
                      </h4>
                      <p className="text-xs text-outline flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          credit_card
                        </span>{" "}
                        Thẻ
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-md text-error font-bold">
                      210.000 đ
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Date Group: 24 THÁNG 7 */}
            <div className="space-y-md">
              <div className="flex justify-between items-center pb-sm border-b border-outline-variant/30 px-2 opacity-80">
                <div className="flex items-center gap-4">
                  <span className="text-[40px] font-black text-outline-variant leading-none">
                    24
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                      Hôm qua
                    </span>
                    <span className="text-label-sm font-bold text-on-surface">
                      THÁNG 7 2026
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-headline-md text-error font-bold">
                    80.000 đ
                  </span>
                </div>
              </div>
              <div className="space-y-base">
                <div className="flex items-center justify-between p-4 bg-white/50 hover:bg-white rounded-2xl transition-all group">
                  <div className="flex items-center gap-md">
                    <div className="w-12 h-12 rounded-full bg-[#42A5F5] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                      <span
                        className="material-symbols-outlined text-2xl"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        shopping_basket
                      </span>
                    </div>
                    <div>
                      <h4 className="font-label-md text-on-surface">
                        Bách hóa
                      </h4>
                      <p className="text-xs text-outline flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          credit_card
                        </span>{" "}
                        Thẻ
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-md text-error font-bold">
                      80.000 đ
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Date Group: 23 THÁNG 7 */}
            <div className="space-y-md">
              <div className="flex justify-between items-center pb-sm border-b border-outline-variant/30 px-2 opacity-80">
                <div className="flex items-center gap-4">
                  <span className="text-[40px] font-black text-outline-variant leading-none">
                    23
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                      Thứ Năm
                    </span>
                    <span className="text-label-sm font-bold text-on-surface">
                      THÁNG 7 2026
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-headline-md text-error font-bold">
                    493.000 đ
                  </span>
                </div>
              </div>
              <div className="space-y-base">
                <div className="flex items-center justify-between p-4 bg-white/50 hover:bg-white rounded-2xl transition-all group">
                  <div className="flex items-center gap-md">
                    <div className="w-12 h-12 rounded-full bg-[#42A5F5] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                      <span
                        className="material-symbols-outlined text-2xl"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        shopping_basket
                      </span>
                    </div>
                    <div>
                      <h4 className="font-label-md text-on-surface">
                        Bách hóa
                      </h4>
                      <p className="text-xs text-outline flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          credit_card
                        </span>{" "}
                        Thẻ
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-md text-error font-bold">
                      28.000 đ
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/50 hover:bg-white rounded-2xl transition-all group">
                  <div className="flex items-center gap-md">
                    <div className="w-12 h-12 rounded-full bg-[#EF5350] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                      <span
                        className="material-symbols-outlined text-2xl"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        home
                      </span>
                    </div>
                    <div>
                      <h4 className="font-label-md text-on-surface">
                        Tiền phòng
                      </h4>
                      <p className="text-xs text-outline flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          account_balance
                        </span>{" "}
                        Tiền mặt
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-md text-error font-bold">
                      450.000 đ
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/50 hover:bg-white rounded-2xl transition-all group">
                  <div className="flex items-center gap-md">
                    <div className="w-12 h-12 rounded-full bg-[#42A5F5] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                      <span
                        className="material-symbols-outlined text-2xl"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        shopping_basket
                      </span>
                    </div>
                    <div>
                      <h4 className="font-label-md text-on-surface">
                        Bách hóa
                      </h4>
                      <p className="text-xs text-outline flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          credit_card
                        </span>{" "}
                        Thẻ
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-md text-error font-bold">
                      15.000 đ
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Date Group: 22 THÁNG 7 */}
            <div className="space-y-md">
              <div className="flex justify-between items-center pb-sm border-b border-outline-variant/30 px-2 opacity-80">
                <div className="flex items-center gap-4">
                  <span className="text-[40px] font-black text-outline-variant leading-none">
                    22
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                      Thứ Tư
                    </span>
                    <span className="text-label-sm font-bold text-on-surface">
                      THÁNG 7 2026
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-headline-md text-tertiary font-bold">
                    47.000 đ
                  </span>
                </div>
              </div>
              <div className="space-y-base">
                <div className="flex items-center justify-between p-4 bg-white/50 hover:bg-white rounded-2xl transition-all group">
                  <div className="flex items-center gap-md">
                    <div className="w-12 h-12 rounded-full bg-tertiary flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                      <span
                        className="material-symbols-outlined text-2xl"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        payments
                      </span>
                    </div>
                    <div>
                      <h4 className="font-label-md text-on-surface">
                        Thu nhập thêm
                      </h4>
                      <p className="text-xs text-outline flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          account_balance
                        </span>{" "}
                        Chuyển khoản
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-md text-tertiary font-bold">
                      +47.000 đ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        {/* Floating Action Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <button className="w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group">
            <span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform duration-300">
              add
            </span>
          </button>
        </div>
      </main>
    </>
  );
}
