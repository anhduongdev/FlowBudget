import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { formatDateIso, parseDateRangeParams } from "@/lib/date-range";
import { formatVnd } from "@/lib/format";
import { getPeriodRangeLabel } from "@/lib/period-range-label";
import {
  getTotalBalancesAsOfDates,
  listActiveAccountsForUser,
} from "@/lib/services/account-service";
import { getCurrentUser } from "@/lib/services/auth-service";
import { getCategoriesWithMonthlySpending } from "@/lib/services/category-service";
import { getTransactionsForUser } from "@/lib/services/transaction-service";
import { AddTransactionFlow } from "./add-transaction-flow";
import { DateRangeTrigger } from "./date-range-trigger";
import { TransactionList } from "./transaction-list";

export const metadata: Metadata = {
  title: "FlowBudget - Giao dịch",
};

const NAV_ITEMS = [
  { label: "Tài khoản", icon: "account_balance_wallet", active: false },
  { label: "Danh mục", icon: "pie_chart", active: false },
  { label: "Giao dịch", icon: "receipt_long", active: true },
  { label: "Ngân sách", icon: "speed", active: false },
  { label: "Tổng quan", icon: "monitoring", active: false },
] as const;

interface TransactionsPreviewPageProps {
  searchParams: Promise<{ from?: string; to?: string }>;
}

export default async function TransactionsPreviewPage({
  searchParams,
}: TransactionsPreviewPageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const { from, to } = await searchParams;
  const range = parseDateRangeParams(from, to);

  const todayIso = formatDateIso(new Date());
  const periodLabel = getPeriodRangeLabel(range);
  const inclusiveEnd = new Date(range.end);
  inclusiveEnd.setUTCDate(inclusiveEnd.getUTCDate() - 1);
  const currentFrom = formatDateIso(range.start);
  const currentTo = formatDateIso(inclusiveEnd);
  const dayBeforeFrom = new Date(range.start);
  dayBeforeFrom.setUTCDate(dayBeforeFrom.getUTCDate() - 1);
  const dayBeforeFromIso = formatDateIso(dayBeforeFrom);

  const accounts = await listActiveAccountsForUser(user.id);

  const [expenseCategories, incomeCategories, dayGroups, balancesAsOf] =
    await Promise.all([
      getCategoriesWithMonthlySpending(user.id, "expense", range),
      getCategoriesWithMonthlySpending(user.id, "income", range),
      getTransactionsForUser(user.id, range),
      getTotalBalancesAsOfDates(user.id, accounts, [
        todayIso,
        dayBeforeFromIso,
        currentTo,
      ]),
    ]);

  const totalBalance = balancesAsOf[todayIso];
  const openingBalance = balancesAsOf[dayBeforeFromIso];
  const projectedBalance = balancesAsOf[currentTo];

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <div className="w-full max-w-[430px] mx-auto min-h-screen bg-white relative shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
        {/* Top AppBar */}
        <header className="fixed top-0 w-full max-w-[430px] z-50 bg-white/85 backdrop-blur-xl px-6 py-2.5 flex flex-col items-center gap-2 border-b border-[#18448b]/10">
          <div className="flex justify-between items-center w-full">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-low active:scale-90 transition-transform"
              type="button"
            >
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                account_circle
              </span>
            </button>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-medium text-on-surface-variant uppercase tracking-wide">
                Tất cả các tài khoản
              </span>
              <h1
                className={`text-[20px] font-bold tracking-tight leading-tight ${
                  totalBalance < 0 ? "text-error" : "text-[#18448b]"
                }`}
              >
                {formatVnd(totalBalance)}
              </h1>
            </div>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-low active:scale-90 transition-transform"
              type="button"
            >
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                search
              </span>
            </button>
          </div>
          {/* Date Selector */}
          <DateRangeTrigger
            currentFrom={currentFrom}
            currentTo={currentTo}
            label={periodLabel}
          />
        </header>

        {/* Quick Stats Bento - pinned under the header, stays visible while the list scrolls */}
        <div className="fixed top-[98px] w-full max-w-[430px] z-40 bg-background px-6 pt-3 pb-3 grid grid-cols-2 gap-3 border-b border-outline-variant/20">
          <div className="bg-white p-3 rounded-2xl shadow-[0_4px_12px_-2px_rgba(0,0,0,0.05)] border border-[#18448b]/10 flex flex-col justify-between">
            <p className="text-[11px] font-medium text-on-surface-variant mb-1">
              Số dư đầu kỳ
            </p>
            <p
              className={`text-[15px] font-bold ${
                openingBalance < 0 ? "text-error" : "text-[#18448b]/80"
              }`}
            >
              {formatVnd(openingBalance)}
            </p>
          </div>
          <div className="bg-white p-3 rounded-2xl shadow-[0_4px_12px_-2px_rgba(0,0,0,0.05)] border border-[#18448b]/10 flex flex-col justify-between">
            <p className="text-[11px] font-medium text-on-surface-variant mb-1">
              Số dư dự kiến
            </p>
            <p
              className={`text-[15px] font-bold ${
                projectedBalance < 0 ? "text-error" : "text-teal-600"
              }`}
            >
              {formatVnd(projectedBalance)}
            </p>
          </div>
        </div>

        <main className="pt-[192px] pb-36 px-6 bg-background min-h-screen">
          <TransactionList
            accounts={accounts}
            dayGroups={dayGroups}
            emptyMessage="Chưa có giao dịch nào trong khoảng thời gian này."
            todayIso={todayIso}
          />
        </main>

        <AddTransactionFlow
          accounts={accounts}
          currentFrom={currentFrom}
          currentTo={currentTo}
          expenseCategories={expenseCategories}
          incomeCategories={incomeCategories}
        />

        {/* Redesigned Bottom Navigation */}
        <nav className="fixed bottom-0 w-full max-w-[430px] z-50 flex justify-between items-center px-6 pb-8 pt-4 bg-white/90 backdrop-blur-2xl border-t border-[#18448b]/10 shadow-[0_-4px_24px_-4px_rgba(0,0,0,0.03)]">
          {NAV_ITEMS.map((item) =>
            item.active ? (
              <a
                className="flex flex-col items-center gap-1 group relative py-1"
                href="#"
                key={item.label}
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-10 h-10 bg-[#18448b]/10 rounded-full scale-125"></div>
                <span
                  className="material-symbols-outlined text-[#18448b] text-[26px] relative z-10"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {item.icon}
                </span>
                <span className="text-[10px] font-bold text-[#18448b] uppercase tracking-tight relative z-10">
                  {item.label}
                </span>
              </a>
            ) : (
              <a
                className="flex flex-col items-center gap-1 text-on-surface-variant/60 transition-colors"
                href="#"
                key={item.label}
              >
                <span className="material-symbols-outlined text-[26px]">
                  {item.icon}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-tight">
                  {item.label}
                </span>
              </a>
            ),
          )}
        </nav>
      </div>
    </div>
  );
}
