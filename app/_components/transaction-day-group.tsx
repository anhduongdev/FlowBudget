import { formatVnd } from "@/lib/format";

export type TransactionType = "income" | "expense" | "transfer";

export interface TransactionListItemView {
  id: string;
  type: TransactionType;
  amount: number;
  note: string | null;
  categoryName: string | null;
  icon: string;
  color: string;
  accountName: string;
  toAccountName: string | null;
}

export interface TransactionDayGroupView {
  dateIso: string;
  label: string;
  netAmount: number;
  items: TransactionListItemView[];
}

const MONTH_YEAR_FORMATTER = new Intl.DateTimeFormat("vi-VN", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function getDayNumber(dateIso: string): number {
  return Number(dateIso.slice(8, 10));
}

function getMonthYearLabel(dateIso: string): string {
  const date = new Date(`${dateIso}T00:00:00.000Z`);
  return MONTH_YEAR_FORMATTER.format(date).toUpperCase();
}

function transactionItemTitle(item: TransactionListItemView): string {
  if (item.note) return item.note;
  if (item.type === "transfer") {
    return item.toAccountName
      ? `Chuyển đến ${item.toAccountName}`
      : "Chuyển khoản";
  }
  return item.categoryName ?? "Không có danh mục";
}

function TransactionItem({ item }: { item: TransactionListItemView }) {
  const isIncome = item.type === "income";
  const amountClassName = isIncome ? "text-tertiary" : "text-error";
  const amountPrefix = isIncome ? "+" : "-";

  return (
    <div className="flex items-center justify-between p-4 bg-white/50 hover:bg-white rounded-2xl transition-all group">
      <div className="flex items-center gap-md">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform"
          style={{ backgroundColor: item.color }}
        >
          <span
            className="material-symbols-outlined text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {item.icon}
          </span>
        </div>
        <div>
          <h4 className="font-label-md text-on-surface">
            {transactionItemTitle(item)}
          </h4>
          <p className="text-xs text-outline flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">
              account_balance_wallet
            </span>{" "}
            {item.accountName}
          </p>
        </div>
      </div>
      <div className="text-right">
        <span className={`font-label-md ${amountClassName} font-bold`}>
          {amountPrefix}
          {formatVnd(item.amount)}
        </span>
      </div>
    </div>
  );
}

export function DayGroup({ group }: { group: TransactionDayGroupView }) {
  const totalClassName =
    group.netAmount > 0
      ? "text-tertiary"
      : group.netAmount < 0
        ? "text-error"
        : "text-on-surface-variant";
  const totalPrefix = group.netAmount > 0 ? "+" : "";

  return (
    <div className="space-y-md">
      <div className="flex justify-between items-center pb-sm border-b border-outline-variant/30 px-2">
        <div className="flex items-center gap-4">
          <span className="text-[40px] font-black text-primary leading-none">
            {getDayNumber(group.dateIso)}
          </span>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
              {group.label}
            </span>
            <span className="text-label-sm font-bold text-on-surface">
              {getMonthYearLabel(group.dateIso)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className={`font-headline-md ${totalClassName} font-bold`}>
            {totalPrefix}
            {formatVnd(Math.abs(group.netAmount))}
          </span>
        </div>
      </div>
      <div className="space-y-base">
        {group.items.map((item) => (
          <TransactionItem item={item} key={item.id} />
        ))}
      </div>
    </div>
  );
}
