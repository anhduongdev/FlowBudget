import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { formatDateIso, parseDateRangeParams } from "@/lib/date-range";
import { getDayGroupLabel } from "@/lib/day-label";
import { listActiveAccountsForUser } from "@/lib/services/account-service";
import { getCurrentUser } from "@/lib/services/auth-service";
import { listCategoriesForSelect } from "@/lib/services/category-service";
import { getTransactionsForUser } from "@/lib/services/transaction-service";
import { TransactionsContent } from "./transactions-content";

export const metadata: Metadata = {
  title: "FlowBudget - Giao dịch chi tiết",
};

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
  const todayIso = formatDateIso(new Date());

  const [dayGroups, accounts, expenseCategories, incomeCategories] =
    await Promise.all([
      getTransactionsForUser(user.id, range),
      listActiveAccountsForUser(user.id),
      listCategoriesForSelect(user.id, "expense"),
      listCategoriesForSelect(user.id, "income"),
    ]);

  const displayToDate = new Date(range.end);
  displayToDate.setUTCDate(displayToDate.getUTCDate() - 1);

  return (
    <TransactionsContent
      accounts={accounts}
      dayGroups={dayGroups.map((group) => ({
        ...group,
        label: getDayGroupLabel(group.dateIso, todayIso),
      }))}
      expenseCategories={expenseCategories}
      filterFrom={formatDateIso(range.start)}
      filterTo={formatDateIso(displayToDate)}
      incomeCategories={incomeCategories}
      userName={user.name}
    />
  );
}
