"use client";

import {
  DayGroup,
  type TransactionDayGroupView,
} from "@/app/_components/transaction-day-group";
import type { AccountOption } from "@/lib/services/account-service";
import type { CategoryOption } from "@/lib/services/category-service";
import { AppHeader, type PeriodLink } from "../_components/app-header";
import { Sidebar } from "../_components/sidebar";
import { QuickAddTransactionButton } from "../dashboard/quick-add-transaction-button";

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
  return (
    <>
      <Sidebar userName={userName} />
      {/* Main Content Area */}
      <main className="ml-72 flex-1 min-h-screen relative">
        <AppHeader
          periodLinks={periodLinks}
          primaryAction={
            <QuickAddTransactionButton
              accounts={accounts}
              expenseCategories={expenseCategories}
              incomeCategories={incomeCategories}
              variant="default"
            />
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
        <QuickAddTransactionButton
          accounts={accounts}
          expenseCategories={expenseCategories}
          incomeCategories={incomeCategories}
          variant="fab"
        />
      </main>
    </>
  );
}
