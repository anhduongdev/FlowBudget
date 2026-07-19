import { formatVnd } from "@/lib/format";

export function SummaryCards({
  totalAssets,
  periodIncome,
  periodExpense,
  netFlow,
}: {
  totalAssets: string;
  periodIncome: string;
  periodExpense: string;
  netFlow: string;
}) {
  const net = Number(netFlow);

  return (
    <div className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border border-outline-variant bg-surface-container p-sm transition-all hover:bg-surface-container-high">
        <div className="mb-sm flex items-start justify-between">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <span className="material-symbols-outlined">account_balance</span>
          </div>
        </div>
        <p className="mb-xs font-label-md text-on-surface-variant">Tổng tài sản</p>
        <p className="font-numeric-lg text-on-surface">{formatVnd(totalAssets)}</p>
      </div>

      <div className="rounded-xl border border-outline-variant bg-surface-container p-sm transition-all hover:bg-surface-container-high">
        <div className="mb-sm flex items-start justify-between">
          <div className="rounded-lg bg-secondary/10 p-2 text-secondary">
            <span className="material-symbols-outlined">arrow_downward</span>
          </div>
        </div>
        <p className="mb-xs font-label-md text-on-surface-variant">Thu nhập trong kỳ</p>
        <p className="font-numeric-lg text-secondary">{formatVnd(periodIncome)}</p>
      </div>

      <div className="rounded-xl border border-outline-variant bg-surface-container p-sm transition-all hover:bg-surface-container-high">
        <div className="mb-sm flex items-start justify-between">
          <div className="rounded-lg bg-error/10 p-2 text-error">
            <span className="material-symbols-outlined">arrow_upward</span>
          </div>
        </div>
        <p className="mb-xs font-label-md text-on-surface-variant">Chi tiêu trong kỳ</p>
        <p className="font-numeric-lg text-error">{formatVnd(periodExpense)}</p>
      </div>

      <div className="rounded-xl border border-outline-variant bg-surface-container p-sm transition-all hover:bg-surface-container-high">
        <div className="mb-sm flex items-start justify-between">
          <div className="rounded-lg bg-tertiary/10 p-2 text-tertiary">
            <span className="material-symbols-outlined">balance</span>
          </div>
          <span className="font-label-sm text-on-surface-variant">Dòng tiền thuần</span>
        </div>
        <p className="mb-xs font-label-md text-on-surface-variant">Số dư</p>
        <p className={`font-numeric-lg ${net >= 0 ? "text-primary" : "text-error"}`}>
          {net >= 0 ? "+" : ""}
          {formatVnd(net)}
        </p>
      </div>
    </div>
  );
}
