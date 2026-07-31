import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { categories_type } from "@/app/generated/prisma/enums";
import { formatDateIso, parseDateRangeParams } from "@/lib/date-range";
import {
  getTotalBalancesAsOfDates,
  listActiveAccountsForUser,
} from "@/lib/services/account-service";
import { getCurrentUser } from "@/lib/services/auth-service";
import { listCategoriesForSelect } from "@/lib/services/category-service";
import { getTransactionsForUser } from "@/lib/services/transaction-service";
import { BulkCreateFlow } from "./bulk-create-flow";

export const metadata: Metadata = {
  title: "FlowBudget - Tạo giao dịch hàng loạt",
};

interface BulkCreateTransactionsPageProps {
  searchParams: Promise<{ from?: string; to?: string }>;
}

export default async function BulkCreateTransactionsPage({
  searchParams,
}: BulkCreateTransactionsPageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const { from, to } = await searchParams;
  const range = parseDateRangeParams(from, to);
  const inclusiveEnd = new Date(range.end);
  inclusiveEnd.setUTCDate(inclusiveEnd.getUTCDate() - 1);
  const initialFrom = formatDateIso(range.start);
  const initialTo = formatDateIso(inclusiveEnd);

  const dayBeforeFrom = new Date(range.start);
  dayBeforeFrom.setUTCDate(dayBeforeFrom.getUTCDate() - 1);
  const dayBeforeFromIso = formatDateIso(dayBeforeFrom);

  const accounts = await listActiveAccountsForUser(user.id);

  const [expenseCategories, incomeCategories, initialExistingDayGroups, balancesAsOf] =
    await Promise.all([
      listCategoriesForSelect(user.id, categories_type.expense),
      listCategoriesForSelect(user.id, categories_type.income),
      getTransactionsForUser(user.id, range),
      getTotalBalancesAsOfDates(user.id, accounts, [dayBeforeFromIso]),
    ]);

  const initialOpeningBalance = balancesAsOf[dayBeforeFromIso] ?? 0;

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <div className="w-full max-w-[430px] mx-auto min-h-screen bg-white relative rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
        <header className="sticky top-0 z-50 rounded-t-3xl bg-white/85 backdrop-blur-xl px-4 py-3 flex items-center gap-3 border-b border-[#18448b]/10">
          <Link
            className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-container-low active:scale-90 transition-transform"
            href={`/preview/transactions?from=${initialFrom}&to=${initialTo}`}
          >
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
              arrow_back
            </span>
          </Link>
          <h1 className="text-[15px] font-bold text-on-surface">
            Tạo giao dịch hàng loạt
          </h1>
        </header>

        <BulkCreateFlow
          accounts={accounts}
          expenseCategories={expenseCategories}
          incomeCategories={incomeCategories}
          initialExistingDayGroups={initialExistingDayGroups}
          initialFrom={initialFrom}
          initialOpeningBalance={initialOpeningBalance}
          initialTo={initialTo}
        />
      </div>
    </div>
  );
}
