import Link from "next/link";
import { formatVnd } from "@/lib/format";
import type { TransactionDto } from "@/lib/services/transaction-service";

const ICON: Record<TransactionDto["type"], string> = { income: "arrow_downward", expense: "arrow_upward", transfer: "swap_horiz" };
const COLOR: Record<TransactionDto["type"], string> = { income: "text-secondary", expense: "text-error", transfer: "text-tertiary" };
const PREFIX: Record<TransactionDto["type"], string> = { income: "+", expense: "-", transfer: "" };

function formatWhen(date: Date, createdAt: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  const time = new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit" }).format(createdAt);

  if (sameDay(date, today)) return `Hôm nay, ${time}`;
  if (sameDay(date, yesterday)) return `Hôm qua, ${time}`;
  return `${date.getDate()} thg ${date.getMonth() + 1}, ${date.getFullYear()}`;
}

export function RecentTransactionsList({ transactions }: { transactions: TransactionDto[] }) {
  return (
    <div className="rounded-2xl border border-outline-variant bg-surface-container p-md">
      <div className="mb-md flex items-center justify-between">
        <h3 className="font-bold text-body-lg">Giao dịch gần đây</h3>
        <Link className="font-label-md text-primary hover:underline" href="/transactions">
          Xem tất cả
        </Link>
      </div>
      {transactions.length === 0 ? (
        <p className="py-lg text-center font-label-md text-on-surface-variant">Chưa có giao dịch nào.</p>
      ) : (
        <div className="space-y-xs">
          {transactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded-xl p-sm transition-all hover:bg-surface-container-high">
              <div className="flex items-center gap-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-highest">
                  <span className={`material-symbols-outlined ${COLOR[t.type]}`}>
                    {t.type === "transfer" ? "swap_horiz" : (t.category_icon ?? ICON[t.type])}
                  </span>
                </div>
                <div>
                  <p className="font-label-md text-on-surface">{t.note || t.category_name || "Giao dịch"}</p>
                  <p className="text-[12px] text-on-surface-variant">{formatWhen(t.transaction_date, t.created_at)}</p>
                </div>
              </div>
              <p className={`font-bold ${COLOR[t.type]}`}>
                {PREFIX[t.type]}
                {formatVnd(t.amount)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
