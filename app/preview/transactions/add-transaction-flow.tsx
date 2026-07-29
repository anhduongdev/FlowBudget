"use client";

import { useState } from "react";
import { formatVnd } from "@/lib/format";
import type { AccountOption } from "@/lib/services/account-service";
import type { CategorySpendingItem } from "@/lib/services/category-service";
import { AmountEntryPanel } from "./amount-entry-panel";
import { CategoryFormPanel } from "./category-form-panel";

interface AddTransactionFlowProps {
  accounts: AccountOption[];
  expenseCategories: CategorySpendingItem[];
  incomeCategories: CategorySpendingItem[];
}

type FlowType = "expense" | "income" | "transfer";

type Step =
  | { name: "closed" }
  | { name: "categories" }
  | { name: "category-form"; category: CategorySpendingItem | null }
  | { name: "amount" };

const TABS: { value: FlowType; label: string; icon: string }[] = [
  { value: "income", label: "Thu nhập", icon: "arrow_upward" },
  { value: "expense", label: "Chi phí", icon: "arrow_downward" },
  { value: "transfer", label: "Chuyển khoản", icon: "swap_horiz" },
];

export function AddTransactionFlow({
  accounts,
  expenseCategories,
  incomeCategories,
}: AddTransactionFlowProps) {
  const [step, setStep] = useState<Step>({ name: "closed" });
  const [activeType, setActiveType] = useState<FlowType>("expense");
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");
  const [toAccountId, setToAccountId] = useState(
    accounts[1]?.id ?? accounts[0]?.id ?? "",
  );
  const [selectedCategory, setSelectedCategory] =
    useState<CategorySpendingItem | null>(null);

  const categories = activeType === "income" ? incomeCategories : expenseCategories;
  const account = accounts.find((item) => item.id === accountId);
  const toAccount = accounts.find((item) => item.id === toAccountId);

  function openFlow() {
    setActiveType("expense");
    setAccountId(accounts[0]?.id ?? "");
    setStep({ name: "categories" });
  }

  function closeFlow() {
    setStep({ name: "closed" });
  }

  function selectCategory(category: CategorySpendingItem) {
    setSelectedCategory(category);
    setStep({ name: "amount" });
  }

  return (
    <>
      <button
        className="fixed bottom-28 right-[calc((100%-430px)/2+24px)] max-[430px]:right-6 w-16 h-16 bg-[#18448b] text-white shadow-[0_8px_24px_-4px_rgba(24,68,139,0.4)] rounded-[20px] flex items-center justify-center active:scale-90 transition-all z-[60]"
        onClick={openFlow}
        type="button"
      >
        <span className="material-symbols-outlined text-[36px]">add</span>
      </button>

      {step.name === "categories" && (
        <div className="fixed top-[192px] bottom-0 w-full max-w-[430px] z-[70] bg-background text-on-surface flex flex-col rounded-t-3xl overflow-hidden shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
          <button
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center"
            onClick={closeFlow}
            type="button"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-lg">
              close
            </span>
          </button>

          <div className="flex justify-around border-b border-outline-variant/30 px-4 pt-5 pb-3 shrink-0">
            {TABS.map((tab) => {
              const active = activeType === tab.value;
              return (
                <button
                  className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${
                    active
                      ? "border-[#18448b] text-[#18448b]"
                      : "border-transparent text-on-surface-variant"
                  }`}
                  key={tab.value}
                  onClick={() => setActiveType(tab.value)}
                  type="button"
                >
                  <span
                    className={`material-symbols-outlined w-7 h-7 rounded-full flex items-center justify-center text-[16px] border ${
                      active ? "border-[#18448b]" : "border-outline-variant"
                    }`}
                  >
                    {tab.icon}
                  </span>
                  <span className="text-[13px] font-semibold">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {activeType === "transfer" ? (
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
              <div>
                <p className="text-[12px] text-on-surface-variant mb-2">
                  Từ tài khoản
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {accounts.map((item) => (
                    <button
                      className="flex flex-col items-center gap-1"
                      key={item.id}
                      onClick={() => setAccountId(item.id)}
                      type="button"
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          accountId === item.id
                            ? "ring-2 ring-[#18448b] ring-offset-2 ring-offset-background"
                            : ""
                        }`}
                        style={{ backgroundColor: item.color }}
                      >
                        <span className="material-symbols-outlined text-white text-lg">
                          {item.icon}
                        </span>
                      </div>
                      <p className="text-[11px] text-center leading-tight">
                        {item.name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[12px] text-on-surface-variant mb-2">
                  Đến tài khoản
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {accounts
                    .filter((item) => item.id !== accountId)
                    .map((item) => (
                      <button
                        className="flex flex-col items-center gap-1"
                        key={item.id}
                        onClick={() => setToAccountId(item.id)}
                        type="button"
                      >
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            toAccountId === item.id
                              ? "ring-2 ring-[#18448b] ring-offset-2 ring-offset-background"
                              : ""
                          }`}
                          style={{ backgroundColor: item.color }}
                        >
                          <span className="material-symbols-outlined text-white text-lg">
                            {item.icon}
                          </span>
                        </div>
                        <p className="text-[11px] text-center leading-tight">
                          {item.name}
                        </p>
                      </button>
                    ))}
                </div>
              </div>
              {accounts.length < 2 ? (
                <p className="text-[12px] text-on-surface-variant text-center">
                  Bạn cần ít nhất 2 tài khoản để chuyển khoản.
                </p>
              ) : (
                <button
                  className="w-full py-3 rounded-xl bg-[#18448b] text-white font-semibold disabled:opacity-40"
                  disabled={!accountId || !toAccountId || accountId === toAccountId}
                  onClick={() => setStep({ name: "amount" })}
                  type="button"
                >
                  Tiếp tục
                </button>
              )}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="grid grid-cols-4 gap-x-3 gap-y-6">
                {categories.map((category) => (
                  <div
                    className="relative flex flex-col items-center gap-1.5"
                    key={category.id}
                  >
                    <button
                      className="flex flex-col items-center gap-1.5"
                      onClick={() => selectCategory(category)}
                      type="button"
                    >
                      <span
                        className="w-14 h-14 rounded-full flex items-center justify-center shadow-[0_4px_10px_-2px_rgba(0,0,0,0.15)]"
                        style={{ backgroundColor: category.color }}
                      >
                        <span className="material-symbols-outlined text-white text-2xl">
                          {category.icon}
                        </span>
                      </span>
                      <span className="text-[12px] text-center leading-tight text-on-surface">
                        {category.name}
                      </span>
                      <span
                        className={`text-[11px] font-semibold ${
                          category.totalAmount > 0
                            ? "text-[#18448b]"
                            : "text-on-surface-variant/60"
                        }`}
                      >
                        {formatVnd(category.totalAmount)}
                      </span>
                    </button>
                    <button
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.2)] flex items-center justify-center"
                      onClick={() =>
                        setStep({ name: "category-form", category })
                      }
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[12px] text-on-surface-variant">
                        edit
                      </span>
                    </button>
                  </div>
                ))}

                <button
                  className="flex flex-col items-center gap-1.5"
                  onClick={() =>
                    setStep({ name: "category-form", category: null })
                  }
                  type="button"
                >
                  <div className="w-14 h-14 rounded-full border-2 border-dashed border-outline-variant flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface-variant text-2xl">
                      add
                    </span>
                  </div>
                  <p className="text-[12px] text-center text-on-surface-variant leading-tight">
                    Thêm danh mục
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {step.name === "category-form" && (
        <CategoryFormPanel
          category={
            step.category
              ? {
                  id: step.category.id,
                  name: step.category.name,
                  icon: step.category.icon,
                  color: step.category.color,
                }
              : null
          }
          onDone={() => setStep({ name: "categories" })}
          type={activeType === "income" ? "income" : "expense"}
        />
      )}

      {step.name === "amount" && (
        <AmountEntryPanel
          accountId={accountId}
          categoryId={activeType !== "transfer" ? selectedCategory?.id : undefined}
          from={
            activeType === "income"
              ? {
                  label: "Từ danh mục",
                  name: selectedCategory?.name ?? "",
                  icon: selectedCategory?.icon ?? "category",
                  color: selectedCategory?.color ?? "#94a3b8",
                }
              : {
                  label: "Từ tài khoản",
                  name: account?.name ?? "",
                  icon: account?.icon ?? "account_balance_wallet",
                  color: account?.color ?? "#94a3b8",
                }
          }
          onBack={() => setStep({ name: "categories" })}
          onDone={closeFlow}
          to={
            activeType === "transfer"
              ? {
                  label: "Đến tài khoản",
                  name: toAccount?.name ?? "",
                  icon: toAccount?.icon ?? "account_balance_wallet",
                  color: toAccount?.color ?? "#94a3b8",
                }
              : activeType === "income"
                ? {
                    label: "Đến tài khoản",
                    name: account?.name ?? "",
                    icon: account?.icon ?? "account_balance_wallet",
                    color: account?.color ?? "#94a3b8",
                  }
                : {
                    label: "Đến danh mục",
                    name: selectedCategory?.name ?? "",
                    icon: selectedCategory?.icon ?? "category",
                    color: selectedCategory?.color ?? "#94a3b8",
                  }
          }
          toAccountId={activeType === "transfer" ? toAccountId : undefined}
          type={activeType}
        />
      )}
    </>
  );
}
