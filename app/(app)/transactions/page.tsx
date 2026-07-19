import type { Metadata } from "next";
import { z } from "zod";
import { requireCurrentUserId } from "@/lib/auth/current-user";
import { listTransactionsGroupedByDate } from "@/lib/services/transaction-service";
import { PeriodToggle } from "@/app/(app)/_components/PeriodToggle";
import { TransactionGroup } from "@/app/(app)/transactions/_components/TransactionGroup";

export const metadata: Metadata = { title: "Giao dịch | MyFlowBudget" };

const periodSchema = z.object({ period: z.enum(["today", "month", "year"]).catch("month") });

export default async function TransactionsPage({ searchParams }: { searchParams: Promise<{ period?: string }> }) {
  const userId = await requireCurrentUserId();
  const { period } = periodSchema.parse(await searchParams);
  const groups = await listTransactionsGroupedByDate(userId, period);

  return (
    <>
      <div className="flex items-center justify-end">
        <PeriodToggle basePath="/transactions" current={period} />
      </div>

      {groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-sm rounded-xl border-2 border-dashed border-outline-variant p-xl text-on-surface-variant opacity-80">
          <span className="material-symbols-outlined text-[48px]">history</span>
          <p className="font-label-md">Chưa có giao dịch nào trong khoảng thời gian này.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-lg">
          {groups.map((group) => (
            <TransactionGroup key={group.date.toISOString()} group={group} />
          ))}
        </div>
      )}
    </>
  );
}
