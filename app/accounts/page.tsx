import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { formatDateIso } from "@/lib/date-range";
import { getDayGroupLabel } from "@/lib/day-label";
import { listActiveAccountsForUser } from "@/lib/services/account-service";
import { getCurrentUser } from "@/lib/services/auth-service";
import { listCategoriesForSelect } from "@/lib/services/category-service";
import {
  getRecentTransactionsForUser,
  getTransactionCountForUser,
} from "@/lib/services/transaction-service";
import { AccountsContent } from "./accounts-content";

export const metadata: Metadata = {
  title: "FlowBudget - Tài khoản",
};

const RECENT_TRANSACTIONS_LIMIT = 8;

export default async function AccountsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const [
    accounts,
    recentGroups,
    totalTransactionCount,
    expenseCategories,
    incomeCategories,
  ] = await Promise.all([
    listActiveAccountsForUser(user.id),
    getRecentTransactionsForUser(user.id, RECENT_TRANSACTIONS_LIMIT),
    getTransactionCountForUser(user.id),
    listCategoriesForSelect(user.id, "expense"),
    listCategoriesForSelect(user.id, "income"),
  ]);

  const todayIso = formatDateIso(new Date());

  return (
    <AccountsContent
      accounts={accounts}
      expenseCategories={expenseCategories}
      incomeCategories={incomeCategories}
      recentGroups={recentGroups.map((group) => ({
        ...group,
        isFuture: group.dateIso > todayIso,
        label: getDayGroupLabel(group.dateIso, todayIso),
      }))}
      totalTransactionCount={totalTransactionCount}
      userName={user.name}
    />
  );
}
