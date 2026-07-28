import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DayGroup } from "@/app/_components/transaction-day-group";
import { SetBudgetButton } from "@/app/categories/set-budget-button";
import { formatDateIso, getCurrentMonthRange } from "@/lib/date-range";
import { getDayGroupLabel } from "@/lib/day-label";
import { formatVnd } from "@/lib/format";
import {
  listActiveAccountsForUser,
  sumAccountBalances,
} from "@/lib/services/account-service";
import { getCurrentUser } from "@/lib/services/auth-service";
import {
  buildMonthlyBudgetSummary,
  getBudgetAmountForMonth,
} from "@/lib/services/budget-service";
import {
  getTopSpendingCategories,
  listCategoriesForSelect,
} from "@/lib/services/category-service";
import {
  getMonthlyExpenseTotal,
  getMonthlyIncomeTotal,
  getRecentTransactionsForUser,
} from "@/lib/services/transaction-service";
import { AppHeader } from "../_components/app-header";
import { Sidebar } from "../_components/sidebar";
import { QuickAddTransactionButton } from "./quick-add-transaction-button";

export const metadata: Metadata = {
  title: "FlowBudget - Tổng quan",
};

const GLASS_CARD =
  "bg-white border border-slate-200/80 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]";

const RECENT_TRANSACTIONS_LIMIT = 5;
const TOP_CATEGORIES_LIMIT = 6;
const MAX_ACCOUNTS_SHOWN = 4;
const RING_RADIUS = 50;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const monthRange = getCurrentMonthRange();

  const [
    accounts,
    monthlyExpenseTotal,
    monthlyIncomeTotal,
    budgetAmount,
    recentGroups,
    topExpenseCategories,
    expenseCategories,
    incomeCategories,
  ] = await Promise.all([
    listActiveAccountsForUser(user.id),
    getMonthlyExpenseTotal(user.id, monthRange),
    getMonthlyIncomeTotal(user.id, monthRange),
    getBudgetAmountForMonth(user.id, monthRange),
    getRecentTransactionsForUser(user.id, RECENT_TRANSACTIONS_LIMIT),
    getTopSpendingCategories(
      user.id,
      "expense",
      monthRange,
      TOP_CATEGORIES_LIMIT,
    ),
    listCategoriesForSelect(user.id, "expense"),
    listCategoriesForSelect(user.id, "income"),
  ]);

  const budgetSummary = buildMonthlyBudgetSummary(
    budgetAmount,
    monthlyExpenseTotal,
  );
  const totalBalance = sumAccountBalances(accounts);
  const monthlySavings = monthlyIncomeTotal - monthlyExpenseTotal;
  const todayIso = formatDateIso(new Date());
  const recentGroupsView = recentGroups.map((group) => ({
    ...group,
    label: getDayGroupLabel(group.dateIso, todayIso),
  }));
  const ringOffset =
    RING_CIRCUMFERENCE * (1 - budgetSummary.spentPercent / 100);

  return (
    <>
      <Sidebar userName={user.name} />
      {/* Main Content Area */}
      <main className="ml-72 min-h-screen">
        <AppHeader
          primaryAction={
            <QuickAddTransactionButton
              accounts={accounts}
              expenseCategories={expenseCategories}
              incomeCategories={incomeCategories}
            />
          }
          title="Tổng quan"
        />
        {/* Content Canvas */}
        <div className="p-8 max-w-[1200px] mx-auto space-y-6">
          {/* Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Balance Card */}
            <div className="lg:col-span-2 rounded-2xl p-7 primary-gradient text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[180px]">
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <p className="text-xs font-medium opacity-80 uppercase tracking-wider">
                    Tổng số dư
                  </p>
                  <span className="material-symbols-outlined opacity-60">
                    account_balance_wallet
                  </span>
                </div>
                <h2 className="text-4xl font-bold mt-2">
                  {formatVnd(totalBalance)}
                </h2>
              </div>
              <div className="relative z-10 grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="text-[10px] opacity-60 uppercase font-bold tracking-widest mb-1">
                    Thu nhập tháng
                  </p>
                  <p className="text-lg font-semibold text-green-300">
                    +{formatVnd(monthlyIncomeTotal)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] opacity-60 uppercase font-bold tracking-widest mb-1">
                    Chi tiêu tháng
                  </p>
                  <p className="text-lg font-semibold text-red-300">
                    -{formatVnd(monthlyExpenseTotal)}
                  </p>
                </div>
              </div>
              {/* Decorative patterns */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            </div>
            {/* Summary Circular */}
            <div
              className={`${GLASS_CARD} rounded-2xl p-6 flex flex-col items-center justify-center text-center`}
            >
              <div className="relative w-28 h-28 mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    className="text-slate-100"
                    cx="56"
                    cy="56"
                    fill="transparent"
                    r={RING_RADIUS}
                    stroke="currentColor"
                    strokeWidth="10"
                  ></circle>
                  {budgetSummary.hasBudget && (
                    <circle
                      className={
                        budgetSummary.isOverBudget
                          ? "text-error"
                          : "text-primary"
                      }
                      cx="56"
                      cy="56"
                      fill="transparent"
                      r={RING_RADIUS}
                      stroke="currentColor"
                      strokeDasharray={RING_CIRCUMFERENCE}
                      strokeDashoffset={ringOffset}
                      strokeWidth="10"
                    ></circle>
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-xs text-slate-400 font-medium">
                    Chi phí
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {formatVnd(monthlyExpenseTotal)}
                  </p>
                </div>
              </div>
              <div className="w-full bg-slate-50 rounded-lg p-3 text-left">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">
                  Tiết kiệm tháng này
                </p>
                <span
                  className={`text-lg font-bold ${
                    monthlySavings >= 0 ? "text-primary" : "text-error"
                  }`}
                >
                  {formatVnd(Math.abs(monthlySavings))}
                </span>
              </div>
              <div className="mt-3">
                <SetBudgetButton
                  currentAmount={
                    budgetSummary.hasBudget ? budgetSummary.budgetAmount : null
                  }
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left: Recent Transactions */}
            <div className="xl:col-span-7 space-y-6">
              <div className={`${GLASS_CARD} rounded-2xl overflow-hidden`}>
                <div className="p-6 border-b border-slate-200/30 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">
                    {RECENT_TRANSACTIONS_LIMIT} giao dịch gần nhất
                  </h3>
                  <Link
                    className="text-xs font-bold text-primary hover:underline"
                    href="/transactions"
                  >
                    Xem tất cả
                  </Link>
                </div>
                {recentGroupsView.length === 0 ? (
                  <p className="p-6 text-center text-sm text-slate-400">
                    Chưa có giao dịch nào.
                  </p>
                ) : (
                  <div className="p-4 space-y-4">
                    {recentGroupsView.map((group) => (
                      <DayGroup group={group} key={group.dateIso} />
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Right: Categories & Accounts */}
            <div className="xl:col-span-5 space-y-6">
              {/* Categories Grid */}
              <div className={`${GLASS_CARD} rounded-2xl p-6`}>
                <h3 className="font-bold text-slate-800 mb-6">
                  Chi tiêu theo mục
                </h3>
                {topExpenseCategories.length === 0 ? (
                  <p className="text-sm text-slate-400">
                    Chưa có danh mục chi tiêu nào.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                    {topExpenseCategories.map((category) => (
                      <div className="flex items-center gap-3" key={category.id}>
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: category.color }}
                        >
                          <span className="material-symbols-outlined text-[24px] text-white">
                            {category.icon}
                          </span>
                        </div>
                        <div>
                          <p className="text-[11px] font-medium text-slate-500">
                            {category.name}
                          </p>
                          <p
                            className="text-sm font-bold"
                            style={{ color: category.color }}
                          >
                            {formatVnd(category.totalAmount)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Link
                  className="w-full mt-6 py-2 border-t border-slate-100 flex items-center justify-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:text-primary transition-colors"
                  href="/categories"
                >
                  Xem thêm
                  <span className="material-symbols-outlined text-[16px]">
                    expand_more
                  </span>
                </Link>
              </div>
              {/* Accounts Card */}
              <div className={`${GLASS_CARD} rounded-2xl p-6`}>
                <h3 className="font-bold text-slate-800 mb-6">
                  Tài khoản của tôi
                </h3>
                {accounts.length === 0 ? (
                  <p className="text-sm text-slate-400">
                    Chưa có tài khoản nào.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {accounts.slice(0, MAX_ACCOUNTS_SHOWN).map((account, index) => (
                      <div
                        className="flex items-center justify-between"
                        key={account.id}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center text-white relative"
                            style={{ backgroundColor: account.color }}
                          >
                            <span className="material-symbols-outlined">
                              {account.icon}
                            </span>
                            {index === 0 && (
                              <div className="absolute -bottom-1 -right-1 bg-amber-400 w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                                <span
                                  className="material-symbols-outlined text-[10px] text-white"
                                  style={{ fontVariationSettings: "'FILL' 1" }}
                                >
                                  star
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              {account.name}
                            </p>
                            <p className="text-xs text-cyan-600 font-bold">
                              {formatVnd(account.currentBalance)}
                            </p>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-slate-300">
                          chevron_right
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <Link
                  className="block w-full mt-6 py-2 bg-slate-50 rounded-lg text-xs font-bold text-primary hover:bg-slate-100 transition-colors text-center"
                  href="/accounts"
                >
                  Quản lý tài khoản
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 rounded-full primary-gradient text-white flex items-center justify-center shadow-lg shadow-indigo-200 hover:scale-110 active:scale-95 transition-all z-50">
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>
    </>
  );
}
