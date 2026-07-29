import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentMonthRange } from "@/lib/date-range";
import { formatVnd } from "@/lib/format";
import { listActiveAccountsForUser } from "@/lib/services/account-service";
import { getCurrentUser } from "@/lib/services/auth-service";
import {
  buildMonthlyBudgetSummary,
  getBudgetAmountForMonth,
  getCategoryBudgetSummariesForUser,
} from "@/lib/services/budget-service";
import { listCategoriesForSelect } from "@/lib/services/category-service";
import { getMonthlyExpenseTotal } from "@/lib/services/transaction-service";
import { AppHeader } from "../_components/app-header";
import { Sidebar } from "../_components/sidebar";
import { SetBudgetButton } from "../categories/set-budget-button";
import { QuickAddTransactionButton } from "../dashboard/quick-add-transaction-button";

export const metadata: Metadata = {
  title: "FlowBudget - Ngân sách",
};

const GLASS_CARD_BORDER_STYLE = { borderColor: "rgba(226, 232, 240, 0.5)" };
const CATEGORY_BUDGET_TRIGGER_CLASS =
  "px-3 py-1.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm hover:bg-primary/20 transition-colors";

export default async function BudgetsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const monthRange = getCurrentMonthRange();

  const [
    budgetAmount,
    monthlyExpenseTotal,
    categorySummaries,
    accounts,
    expenseCategories,
    incomeCategories,
  ] = await Promise.all([
    getBudgetAmountForMonth(user.id, monthRange),
    getMonthlyExpenseTotal(user.id, monthRange),
    getCategoryBudgetSummariesForUser(user.id, monthRange),
    listActiveAccountsForUser(user.id),
    listCategoriesForSelect(user.id, "expense"),
    listCategoriesForSelect(user.id, "income"),
  ]);

  const overallSummary = buildMonthlyBudgetSummary(
    budgetAmount,
    monthlyExpenseTotal,
  );

  return (
    <>
      <Sidebar userName={user.name} />
      <main className="ml-72 min-h-screen bg-background">
        <AppHeader title="Ngân sách" />
        <div className="p-margin max-w-5xl mx-auto space-y-xl pb-xxl">
          {/* Overall monthly budget */}
          <section
            className="glass-card rounded-3xl p-10 soft-shadow"
            style={GLASS_CARD_BORDER_STYLE}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm mb-4">
              Hạn mức tổng tháng này
            </span>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="flex gap-8">
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                    Đã chi tiêu
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
                      overallSummary.isOverBudget
                        ? "text-error"
                        : "text-tertiary-container"
                    }`}
                  >
                    {overallSummary.hasBudget
                      ? formatVnd(overallSummary.remainingAmount)
                      : "Chưa đặt hạn mức"}
                  </p>
                </div>
              </div>
              <SetBudgetButton
                currentAmount={
                  overallSummary.hasBudget ? overallSummary.budgetAmount : null
                }
              />
            </div>
          </section>

          {/* Per-category budgets */}
          <section>
            <h4 className="font-headline-md text-headline-md text-on-surface mb-lg">
              Hạn mức theo danh mục
            </h4>
            {categorySummaries.length === 0 ? (
              <p className="font-body-md text-body-md text-on-surface-variant">
                Chưa có danh mục chi tiêu nào. Hãy tạo danh mục trước.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                {categorySummaries.map((summary) => (
                  <div
                    className="glass-card rounded-2xl p-6 soft-shadow"
                    key={summary.category.id}
                    style={GLASS_CARD_BORDER_STYLE}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: summary.category.color }}
                        >
                          <span className="material-symbols-outlined text-lg">
                            {summary.category.icon}
                          </span>
                        </div>
                        <p className="font-label-md text-label-md text-on-surface">
                          {summary.category.name}
                        </p>
                      </div>
                      <SetBudgetButton
                        categoryId={summary.category.id}
                        currentAmount={
                          summary.hasBudget ? summary.budgetAmount : null
                        }
                        triggerClassName={CATEGORY_BUDGET_TRIGGER_CLASS}
                      />
                    </div>
                    <div className="h-2 rounded-full bg-surface-container overflow-hidden mb-2">
                      {summary.hasBudget && (
                        <div
                          className={`h-full rounded-full ${
                            summary.isOverBudget ? "bg-error" : "bg-primary"
                          }`}
                          style={{ width: `${summary.spentPercent}%` }}
                        ></div>
                      )}
                    </div>
                    <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
                      <span>{formatVnd(summary.spentAmount)} đã chi</span>
                      <span>
                        {summary.hasBudget
                          ? `/ ${formatVnd(summary.budgetAmount)}`
                          : "Chưa đặt hạn mức"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
