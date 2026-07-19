import type { Metadata } from "next";
import { z } from "zod";
import { requireCurrentUserId } from "@/lib/auth/current-user";
import { getDashboardSummary } from "@/lib/services/transaction-service";
import { PeriodToggle } from "@/app/(app)/_components/PeriodToggle";
import { SummaryCards } from "@/app/(app)/dashboard/_components/SummaryCards";
import { CategoryDonutChart } from "@/app/(app)/dashboard/_components/CategoryDonutChart";
import { DailyBarChart } from "@/app/(app)/dashboard/_components/DailyBarChart";
import { RecentTransactionsList } from "@/app/(app)/dashboard/_components/RecentTransactionsList";
import { TopCategoriesList } from "@/app/(app)/dashboard/_components/TopCategoriesList";

export const metadata: Metadata = { title: "Tổng quan | MyFlowBudget" };

const periodSchema = z.object({ period: z.enum(["today", "month", "year"]).catch("month") });

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ period?: string }> }) {
  const userId = await requireCurrentUserId();
  const { period } = periodSchema.parse(await searchParams);
  const summary = await getDashboardSummary(userId, period);
  const totalExpenseForDonut = summary.categoryBreakdown.reduce((sum, c) => sum + Number(c.amount), 0);

  return (
    <>
      <div className="flex items-center justify-end">
        <PeriodToggle basePath="/dashboard" current={period} />
      </div>

      <SummaryCards
        netFlow={summary.netFlow}
        periodExpense={summary.periodExpense}
        periodIncome={summary.periodIncome}
        totalAssets={summary.totalAssets}
      />

      <div className="grid grid-cols-1 gap-md lg:grid-cols-3">
        <CategoryDonutChart slices={summary.categoryBreakdown} totalExpense={totalExpenseForDonut} />
        <DailyBarChart series={summary.dailySeries} />
      </div>

      <div className="grid grid-cols-1 gap-md lg:grid-cols-2">
        <RecentTransactionsList transactions={summary.recentTransactions} />
        <TopCategoriesList categories={summary.topCategories} />
      </div>
    </>
  );
}
