"use client";

import { useState } from "react";
import {
  DayGroup,
  type TransactionDayGroupView,
} from "@/app/_components/transaction-day-group";
import type { AccountOption } from "@/lib/services/account-service";
import type { CategoryOption } from "@/lib/services/category-service";
import { AppHeader, type PeriodLink } from "../_components/app-header";
import { Sidebar } from "../_components/sidebar";
import { TransactionModal } from "./transaction-modal";

interface TransactionsContentProps {
  userName: string;
  dayGroups: TransactionDayGroupView[];
  accounts: AccountOption[];
  expenseCategories: CategoryOption[];
  incomeCategories: CategoryOption[];
  filterFrom: string;
  filterTo: string;
  periodLinks: PeriodLink[];
}

export function TransactionsContent({
  userName,
  dayGroups,
  accounts,
  expenseCategories,
  incomeCategories,
  filterFrom,
  filterTo,
  periodLinks,
}: TransactionsContentProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <>
      <Sidebar userName={userName} />
      {/* Main Content Area */}
      <main className="ml-72 flex-1 min-h-screen relative">
        <AppHeader
          periodLinks={periodLinks}
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
          {/* Date range filter */}
          <form className="flex flex-wrap items-center gap-3" method="get">
            <label className="flex items-center gap-2 text-sm text-on-surface-variant">
              Từ
              <input
                className="border border-outline-variant rounded-lg px-3 py-1.5 text-sm"
                defaultValue={filterFrom}
                name="from"
                type="date"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-on-surface-variant">
              Đến
              <input
                className="border border-outline-variant rounded-lg px-3 py-1.5 text-sm"
                defaultValue={filterTo}
                name="to"
                type="date"
              />
            </label>
            <button
              className="bg-surface-container-high hover:bg-primary hover:text-white transition-all text-on-surface px-5 py-1.5 rounded-full text-sm font-semibold"
              type="submit"
            >
              Lọc
            </button>
          </form>

          {/* Transactions List */}
          <section className="space-y-xl">
            {dayGroups.length === 0 ? (
              <p className="text-center text-on-surface-variant py-xl">
                Không có giao dịch nào trong khoảng thời gian này.
              </p>
            ) : (
              dayGroups.map((group) => (
                <DayGroup
                  accounts={accounts}
                  expenseCategories={expenseCategories}
                  group={group}
                  incomeCategories={incomeCategories}
                  key={group.dateIso}
                />
              ))
            )}
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
      <TransactionModal
        accounts={accounts}
        expenseCategories={expenseCategories}
        incomeCategories={incomeCategories}
        onClose={() => setIsAddModalOpen(false)}
        open={isAddModalOpen}
      />
    </>
  );
}
