import { formatVnd } from "@/lib/format";
import { TransactionRow } from "@/app/(app)/transactions/_components/TransactionRow";
import type { TransactionGroup as TransactionGroupType } from "@/lib/services/transaction-service";

function formatGroupDate(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  const dayMonth = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit" }).format(date);

  if (sameDay(date, today)) return `${dayMonth} - Hôm nay`;
  if (sameDay(date, yesterday)) return `${dayMonth} - Hôm qua`;
  return dayMonth;
}

export function TransactionGroup({ group }: { group: TransactionGroupType }) {
  return (
    <section className="flex flex-col gap-md">
      <div className="flex items-center justify-between">
        <h2 className="font-bold font-label-md text-on-surface">{formatGroupDate(group.date)}</h2>
        {group.net !== 0 && (
          <span className={group.net > 0 ? "font-label-sm text-secondary" : "font-label-sm text-error"}>
            {group.net > 0 ? "+" : ""}
            {formatVnd(group.net)}
          </span>
        )}
      </div>
      <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container">
        {group.transactions.map((t) => (
          <TransactionRow key={t.id} transaction={t} />
        ))}
      </div>
    </section>
  );
}
