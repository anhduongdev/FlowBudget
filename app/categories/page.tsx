import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  getCurrentMonthRange,
  getCurrentWeekRange,
  getPreviousWeekRange,
} from "@/lib/date-range";
import { formatVnd } from "@/lib/format";
import { listActiveAccountsForUser } from "@/lib/services/account-service";
import { getCurrentUser } from "@/lib/services/auth-service";
import {
  buildMonthlyBudgetSummary,
  getBudgetAmountForMonth,
} from "@/lib/services/budget-service";
import { getCategoriesWithMonthlySpending } from "@/lib/services/category-service";
import {
  buildWeekOverWeekInsight,
  getCurrentWeekExpenseBreakdown,
  getMonthlyExpenseTotal,
  getPreviousWeekExpenseTotal,
} from "@/lib/services/transaction-service";
import { AppHeader } from "../_components/app-header";
import { Sidebar } from "../_components/sidebar";
import { QuickAddTransactionButton } from "../dashboard/quick-add-transaction-button";
import { AddCategoryButton } from "./add-category-button";
import { CategoryTile } from "./category-tile";
import { ExpenseCategoryGrid } from "./expense-category-grid";
import { getWeekInsightMessage } from "./insight-message";
import { SetBudgetButton } from "./set-budget-button";

export const metadata: Metadata = {
  title: "FlowBudget - Danh mục chi tiêu",
};

const GLASS_CARD_BORDER_STYLE = { borderColor: "rgba(226, 232, 240, 0.5)" };
const WEEKDAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"] as const;

export default async function CategoriesPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const monthRange = getCurrentMonthRange();
  const weekRange = getCurrentWeekRange();
  const previousWeekRange = getPreviousWeekRange();

  const [
    expenseCategories,
    incomeCategories,
    monthlyExpenseTotal,
    weeklyBreakdown,
    previousWeekTotal,
    budgetAmount,
    accounts,
  ] = await Promise.all([
    getCategoriesWithMonthlySpending(user.id, "expense", monthRange),
    getCategoriesWithMonthlySpending(user.id, "income", monthRange),
    getMonthlyExpenseTotal(user.id, monthRange),
    getCurrentWeekExpenseBreakdown(user.id, weekRange),
    getPreviousWeekExpenseTotal(user.id, previousWeekRange),
    getBudgetAmountForMonth(user.id, monthRange),
    listActiveAccountsForUser(user.id),
  ]);

  const budgetSummary = buildMonthlyBudgetSummary(
    budgetAmount,
    monthlyExpenseTotal,
  );
  const weekInsight = buildWeekOverWeekInsight(
    weeklyBreakdown.weekTotal,
    previousWeekTotal,
  );
  const weekInsightMessage = getWeekInsightMessage(weekInsight);

  return (
    <>
      <Sidebar userName={user.name} />
      {/* Main Content Area */}
      <main className="ml-72 min-h-screen bg-background">
        <AppHeader primaryAction={<AddCategoryButton />} title="Danh mục" />
        {/* Page Content */}
        <div className="p-margin max-w-7xl mx-auto">
          {/* Category Overview Section with Donut Chart */}
          <section className="mb-xxl grid grid-cols-1 lg:grid-cols-3 gap-gutter items-center">
            <div
              className="lg:col-span-2 glass-card rounded-3xl p-10 soft-shadow"
              style={GLASS_CARD_BORDER_STYLE}
            >
              <div className="max-w-xl">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm mb-4">
                  Tổng quan tháng này
                </span>
                <h3 className="font-headline-lg text-headline-lg text-on-surface mb-2">
                  Quản lý chi tiêu thông minh
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Theo dõi các danh mục chi tiêu của bạn qua biểu đồ trực quan
                  để kiểm soát ngân sách hiệu quả hơn.
                </p>
                <div className="mt-8 flex gap-8">
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                      Tổng chi tiêu
                    </p>
                    <p className="font-headline-lg text-headline-lg text-primary">
                      {formatVnd(monthlyExpenseTotal)}
                    </p>
                  </div>
                  <div className="border-l border-outline-variant/30 pl-8">
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                      Hạn mức còn lại
                    </p>
                    <p
                      className={`font-headline-lg text-headline-lg ${
                        budgetSummary.isOverBudget
                          ? "text-error"
                          : "text-tertiary-container"
                      }`}
                    >
                      {budgetSummary.hasBudget
                        ? formatVnd(budgetSummary.remainingAmount)
                        : "Chưa đặt hạn mức"}
                    </p>
                    <SetBudgetButton
                      currentAmount={
                        budgetSummary.hasBudget
                          ? budgetSummary.budgetAmount
                          : null
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Donut Chart Inspired by Reference */}
            <div
              className="glass-card rounded-3xl p-8 soft-shadow flex items-center justify-center relative h-full"
              style={GLASS_CARD_BORDER_STYLE}
            >
              <svg className="circular-chart" viewBox="0 0 36 36">
                <path
                  className="circle-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                ></path>
                {budgetSummary.hasBudget && (
                  <path
                    className={
                      budgetSummary.isOverBudget
                        ? "circle stroke-[#fb7185]"
                        : "circle stroke-primary"
                    }
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                    strokeDasharray={`${budgetSummary.spentPercent}, 100`}
                  ></path>
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  Chi phí
                </p>
                <p className="font-headline-md text-headline-md text-on-surface">
                  {formatVnd(monthlyExpenseTotal)}
                </p>
                <p
                  className={`font-label-sm text-label-sm ${
                    budgetSummary.isOverBudget
                      ? "text-error"
                      : "text-tertiary-container"
                  }`}
                >
                  {budgetSummary.hasBudget
                    ? formatVnd(budgetSummary.remainingAmount)
                    : "Chưa đặt hạn mức"}
                </p>
              </div>
            </div>
          </section>
          {/* Expense Categories Section with Minimalist Grid */}
          <section className="mb-xxl">
            <ExpenseCategoryGrid categories={expenseCategories} />
          </section>
          {/* Income Categories Section */}
          <section className="mb-xxl">
            <div className="flex justify-between items-center mb-lg">
              <div>
                <h4 className="font-headline-md text-headline-md text-on-surface">
                  Danh mục Thu nhập
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Các nguồn dòng tiền chảy vào
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-y-10 gap-x-gutter">
              {incomeCategories.length === 0 ? (
                <p className="col-span-full font-body-md text-body-md text-on-surface-variant">
                  Chưa có danh mục thu nhập nào.
                </p>
              ) : (
                incomeCategories.map((category) => (
                  <CategoryTile category={category} key={category.id} />
                ))
              )}
            </div>
          </section>
          {/* Bottom Analysis Bento */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter pb-xxl">
            <div
              className="lg:col-span-2 glass-card soft-shadow rounded-3xl p-8"
              style={GLASS_CARD_BORDER_STYLE}
            >
              <h4 className="font-headline-md text-headline-md text-on-surface mb-6">
                Thống kê theo thời gian
              </h4>
              <div className="h-64 flex items-end justify-between gap-4">
                {weeklyBreakdown.barHeightPercents.map((percent, index) => (
                  <div
                    className="w-full bg-surface-container rounded-t-lg relative"
                    key={WEEKDAY_LABELS[index]}
                    style={{ height: `${percent}%` }}
                    title={formatVnd(weeklyBreakdown.weekdayTotals[index])}
                  >
                    <div
                      className={`absolute inset-0 rounded-t-lg transition-all cursor-default ${
                        index === weeklyBreakdown.todayIndex
                          ? "bg-primary hover:bg-primary/90"
                          : "bg-primary/20 hover:bg-primary/30"
                      }`}
                    ></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-on-surface-variant font-label-sm text-label-sm px-1">
                {WEEKDAY_LABELS.map((label, index) => (
                  <span
                    className={
                      index === weeklyBreakdown.todayIndex
                        ? "text-primary font-bold"
                        : ""
                    }
                    key={label}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <div
              className="glass-card soft-shadow rounded-3xl p-8 flex flex-col justify-between"
              style={GLASS_CARD_BORDER_STYLE}
            >
              <div>
                <h4 className="font-headline-md text-headline-md text-on-surface mb-2">
                  Thông tin thú vị
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {weekInsightMessage}
                </p>
              </div>
              <div className="mt-8">
                <div className="w-full h-40 rounded-2xl overflow-hidden mb-4 bg-primary-fixed">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="w-full h-full object-cover"
                    alt=""
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1_-SSgKfsn2NnwvBniSvt0WoVXH0UswfvFruh4tOTJucC76B7Cga4q3nyB32YxZ22kAw5pDQ03pPMR-hwFfcHlCECvxrKHTn5_Aqy1vzO369eoPRgLGKm9j1tP61rMTyv4k0dYZcWYbTLknGG46EkqeSlxFaebuXSBzf6GHwB0rQgQjCapUrwMLaN_5m45sr0qXZKEV9EqrpV-Sk-_gRNS3D6-IPycnh_-pSM-arBKe2lz6QLUv5V3mB-4-7yQ3HNb9NQ2K_9Iw"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <QuickAddTransactionButton
        accounts={accounts}
        expenseCategories={expenseCategories}
        incomeCategories={incomeCategories}
        variant="fab"
      />
    </>
  );
}
