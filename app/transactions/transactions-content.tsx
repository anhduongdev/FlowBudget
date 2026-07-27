"use client";

import { useState } from "react";
import { AppHeader } from "../_components/app-header";
import { Sidebar } from "../_components/sidebar";
import { AddTransactionModal } from "./add-transaction-modal";

interface TransactionsContentProps {
  userName: string;
}

export function TransactionsContent({ userName }: TransactionsContentProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <>
      <Sidebar userName={userName} />
      {/* Main Content Area */}
      <main className="ml-72 flex-1 min-h-screen relative">
        <AppHeader
          primaryAction={
            <button
              className="bg-primary text-white px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-all"
              onClick={() => setIsAddModalOpen(true)}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                add
              </span>
              Giao dịch mới
            </button>
          }
          title="Giao dịch"
        />
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
          <button
            className="w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
            onClick={() => setIsAddModalOpen(true)}
            type="button"
          >
            <span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform duration-300">
              add
            </span>
          </button>
        </div>
      </main>
      <AddTransactionModal
        onClose={() => setIsAddModalOpen(false)}
        open={isAddModalOpen}
      />
    </>
  );
}
