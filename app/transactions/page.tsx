import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  formatDateIso,
  getPeriodRange,
  isSameDateRange,
  parseDateRangeParams,
  type PeriodKey,
} from "@/lib/date-range";
import { getDayGroupLabel } from "@/lib/day-label";
import { listActiveAccountsForUser } from "@/lib/services/account-service";
import { getCurrentUser } from "@/lib/services/auth-service";
import { listCategoriesForSelect } from "@/lib/services/category-service";
import { getTransactionsForUser } from "@/lib/services/transaction-service";
import { TransactionsContent } from "./transactions-content";

export const metadata: Metadata = {
  title: "FlowBudget - Giao dịch chi tiết",
};

const PERIOD_TABS: { key: PeriodKey; label: string }[] = [
  { key: "day", label: "Ngày" },
  { key: "week", label: "Tuần" },
  { key: "month", label: "Tháng" },
  { key: "year", label: "Năm" },
];

function buildPeriodHref(periodRange: { start: Date; end: Date }): string {
  const inclusiveEndDate = new Date(periodRange.end);
  inclusiveEndDate.setUTCDate(inclusiveEndDate.getUTCDate() - 1);
  const params = new URLSearchParams({
    from: formatDateIso(periodRange.start),
    to: formatDateIso(inclusiveEndDate),
  });
  return `/transactions?${params.toString()}`;
}

interface TransactionsPageProps {
  searchParams: Promise<{ from?: string; to?: string }>;
}

export default async function TransactionsPage({
  searchParams,
}: TransactionsPageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const { from, to } = await searchParams;
  const range = parseDateRangeParams(from, to);
  const now = new Date();
  const todayIso = formatDateIso(now);

  const [dayGroups, accounts, expenseCategories, incomeCategories] =
    await Promise.all([
      getTransactionsForUser(user.id, range),
      listActiveAccountsForUser(user.id),
      listCategoriesForSelect(user.id, "expense"),
      listCategoriesForSelect(user.id, "income"),
    ]);

  const displayToDate = new Date(range.end);
  displayToDate.setUTCDate(displayToDate.getUTCDate() - 1);

  const periodLinks = PERIOD_TABS.map(({ key, label }) => {
    const periodRange = getPeriodRange(key, now);
    return {
      active: isSameDateRange(range, periodRange),
      href: buildPeriodHref(periodRange),
      label,
    };
  });

  return (
    <TransactionsContent
      accounts={accounts}
      dayGroups={dayGroups.map((group) => ({
        ...group,
        isFuture: group.dateIso > todayIso,
        label: getDayGroupLabel(group.dateIso, todayIso),
      }))}
      expenseCategories={expenseCategories}
      filterFrom={formatDateIso(range.start)}
      filterTo={formatDateIso(displayToDate)}
      incomeCategories={incomeCategories}
      periodLinks={periodLinks}
      userName={user.name}
    />
  );
}
