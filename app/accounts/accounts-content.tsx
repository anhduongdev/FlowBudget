"use client";

import { useEffect } from "react";
import { AppHeader } from "../_components/app-header";
import { Sidebar } from "../_components/sidebar";

interface AccountsContentProps {
  userName: string;
}

export function AccountsContent({ userName }: AccountsContentProps) {
  useEffect(() => {
    const groups = document.querySelectorAll<HTMLElement>(".group");
    const onMouseEnter = (e: Event) => {
      (e.currentTarget as HTMLElement).style.transition =
        "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    };
    groups.forEach((card) => {
      card.addEventListener("mouseenter", onMouseEnter);
    });

    const searchInput = document.querySelector<HTMLInputElement>(
      'input[type="text"]',
    );
    const searchContainer = searchInput?.parentElement;
    const onFocus = () => {
      searchContainer?.classList.add("ring-2", "ring-primary/20", "bg-white");
    };
    const onBlur = () => {
      searchContainer?.classList.remove(
        "ring-2",
        "ring-primary/20",
        "bg-white",
      );
    };
    if (searchInput && searchContainer) {
      searchInput.addEventListener("focus", onFocus);
      searchInput.addEventListener("blur", onBlur);
    }

    return () => {
      groups.forEach((card) => {
        card.removeEventListener("mouseenter", onMouseEnter);
      });
      if (searchInput && searchContainer) {
        searchInput.removeEventListener("focus", onFocus);
        searchInput.removeEventListener("blur", onBlur);
      }
    };
  }, []);

  return (
    <>
      <Sidebar userName={userName} />
      {/* Main Content Canvas */}
      <main className="ml-72 min-h-screen">
        <AppHeader title="Tài khoản" />
        <div className="p-10">
        {/* Account Cards Grid - Updated to match IMAGE_13 style */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-xxl">
          {/* Account: Thẻ (Primary) */}
          <div className="group relative flex items-center p-6 bg-white border-2 border-primary/20 rounded-[24px] transition-all duration-300 hover:shadow-xl cursor-pointer ring-offset-2 hover:ring-2 ring-primary/10">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-[#5C6BC0] flex items-center justify-center text-white">
                <span
                  className="material-symbols-outlined text-3xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  credit_card
                </span>
              </div>
              {/* 'Chính' tag / star icon indicator from IMAGE_13 */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-[14px] text-white"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              </div>
            </div>
            <div className="ml-6 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-label-md text-label-md text-on-surface-variant mb-0.5">
                    Thẻ
                  </h3>
                  <span className="font-headline-md text-headline-md font-bold text-primary">
                    9.166.000 ₫
                  </span>
                </div>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Chính
                </span>
              </div>
            </div>
          </div>
          {/* Account: Tiền mặt */}
          <div className="group relative flex items-center p-6 bg-white border border-outline-variant/30 rounded-[24px] transition-all duration-300 hover:shadow-lg cursor-pointer">
            <div className="w-16 h-16 rounded-2xl bg-[#26A69A] flex items-center justify-center text-white">
              <span
                className="material-symbols-outlined text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                account_balance_wallet
              </span>
            </div>
            <div className="ml-6 flex-1">
              <h3 className="font-label-md text-label-md text-on-surface-variant mb-0.5">
                Tiền mặt
              </h3>
              <span className="font-headline-md text-headline-md font-bold text-on-surface">
                0 ₫
              </span>
            </div>
          </div>
          {/* Add Account Button */}
          <button className="group relative flex items-center justify-center gap-4 p-6 border-2 border-dashed border-outline-variant/50 rounded-[24px] hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <span className="material-symbols-outlined text-2xl">add</span>
            </div>
            <span className="font-label-md text-label-md text-on-surface">
              Thêm tài khoản
            </span>
          </button>
        </section>
        {/* Transaction List - Updated to match date-grouped format from IMAGE_15 */}
        <section className="space-y-6">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">
                Giao dịch gần đây
              </h2>
              <div className="flex items-center gap-2 text-on-surface-variant mt-1">
                <span className="material-symbols-outlined text-sm">
                  calendar_month
                </span>
                <span className="font-body-md text-body-md">
                  11 Thg 7 – 10 Thg 8 2026
                </span>
              </div>
            </div>
            <button className="flex items-center gap-2 text-primary font-label-md text-label-md hover:underline decoration-2 underline-offset-4 transition-all">
              Xem báo cáo{" "}
              <span className="material-symbols-outlined">
                arrow_forward
              </span>
            </button>
          </div>
          <div className="glass-card rounded-[32px] overflow-hidden border border-outline-variant/30 shadow-sm">
            {/* Group: Day 25 */}
            <div className="border-b border-outline-variant/10">
              <div className="bg-surface-container-low/30 px-8 py-3 flex justify-between items-center">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-light text-primary/80">
                    25
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-outline tracking-wider leading-none mb-0.5">
                      Hôm nay
                    </span>
                    <span className="text-xs font-semibold text-on-surface-variant leading-none">
                      Tháng 7 2026
                    </span>
                  </div>
                </div>
                <span className="font-label-md text-label-md text-error">
                  - 239.000 ₫
                </span>
              </div>
              <div className="divide-y divide-outline-variant/10 px-4">
                {/* Transaction item */}
                <div className="flex items-center justify-between p-4 group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-yellow-400/20 flex items-center justify-center text-yellow-600">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        shopping_bag
                      </span>
                    </div>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface">
                        ShoppeVip
                      </p>
                      <div className="flex items-center gap-1.5 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[14px]">
                          credit_card
                        </span>
                        <span className="text-xs">Thẻ</span>
                      </div>
                    </div>
                  </div>
                  <span className="font-label-md text-label-md text-error">
                    29.000 ₫
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-blue-400/20 flex items-center justify-center text-blue-600">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        shopping_basket
                      </span>
                    </div>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface">
                        Bách hóa
                      </p>
                      <div className="flex items-center gap-1.5 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[14px]">
                          credit_card
                        </span>
                        <span className="text-xs">Thẻ</span>
                      </div>
                    </div>
                  </div>
                  <span className="font-label-md text-label-md text-error">
                    210.000 ₫
                  </span>
                </div>
              </div>
            </div>
            {/* Group: Day 24 */}
            <div className="border-b border-outline-variant/10">
              <div className="bg-surface-container-low/30 px-8 py-3 flex justify-between items-center">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-light text-on-surface/40">
                    24
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-outline tracking-wider leading-none mb-0.5">
                      Hôm qua
                    </span>
                    <span className="text-xs font-semibold text-on-surface-variant leading-none">
                      Tháng 7 2026
                    </span>
                  </div>
                </div>
                <span className="font-label-md text-label-md text-error">
                  - 80.000 ₫
                </span>
              </div>
              <div className="divide-y divide-outline-variant/10 px-4">
                <div className="flex items-center justify-between p-4 group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-blue-400/20 flex items-center justify-center text-blue-600">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        shopping_basket
                      </span>
                    </div>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface">
                        Bách hóa
                      </p>
                      <div className="flex items-center gap-1.5 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[14px]">
                          credit_card
                        </span>
                        <span className="text-xs">Thẻ</span>
                      </div>
                    </div>
                  </div>
                  <span className="font-label-md text-label-md text-error">
                    80.000 ₫
                  </span>
                </div>
              </div>
            </div>
            {/* Group: Day 23 */}
            <div>
              <div className="bg-surface-container-low/30 px-8 py-3 flex justify-between items-center">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-light text-on-surface/40">
                    23
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-outline tracking-wider leading-none mb-0.5">
                      Thứ năm
                    </span>
                    <span className="text-xs font-semibold text-on-surface-variant leading-none">
                      Tháng 7 2026
                    </span>
                  </div>
                </div>
                <span className="font-label-md text-label-md text-error">
                  - 493.000 ₫
                </span>
              </div>
              <div className="divide-y divide-outline-variant/10 px-4">
                <div className="flex items-center justify-between p-4 group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-blue-400/20 flex items-center justify-center text-blue-600">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        shopping_basket
                      </span>
                    </div>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface">
                        Bách hóa
                      </p>
                      <div className="flex items-center gap-1.5 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[14px]">
                          credit_card
                        </span>
                        <span className="text-xs">Thẻ</span>
                      </div>
                    </div>
                  </div>
                  <span className="font-label-md text-label-md text-error">
                    28.000 ₫
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-blue-400/20 flex items-center justify-center text-blue-600">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        shopping_basket
                      </span>
                    </div>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface">
                        Bách hóa
                      </p>
                      <div className="flex items-center gap-1.5 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[14px]">
                          credit_card
                        </span>
                        <span className="text-xs">Thẻ</span>
                      </div>
                    </div>
                  </div>
                  <span className="font-label-md text-label-md text-error">
                    450.000 ₫
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <button className="bg-surface-container-high hover:bg-primary hover:text-white transition-all text-on-surface px-8 py-3 rounded-full font-label-md">
              Xem tất cả 43 giao dịch
            </button>
          </div>
        </section>
        </div>
      </main>
      {/* Floating Action Button for Mobile */}
      <button className="md:hidden fixed bottom-8 right-8 w-16 h-16 rounded-full bg-primary text-on-primary shadow-2xl flex items-center justify-center z-[100] active:scale-95 transition-transform">
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </>
  );
}
