"use client";

import { formatVnd } from "@/lib/format";
import type { AccountOption } from "@/lib/services/account-service";
import { formatWeekdaysLabel, type BulkTransactionRuleDraft } from "./types";

interface RuleCardProps {
  rule: BulkTransactionRuleDraft;
  account: AccountOption | undefined;
  onEdit: () => void;
  onDelete: () => void;
}

export function RuleCard({ rule, account, onEdit, onDelete }: RuleCardProps) {
  const icon = rule.categoryLabel?.icon ?? "savings";
  const color = rule.categoryLabel?.color ?? "#94a3b8";
  const name = rule.categoryLabel?.name ?? "Không danh mục";

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_12px_-2px_rgba(0,0,0,0.05)] border border-[#18448b]/10 p-3 flex items-center gap-3">
      <span
        className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center"
        style={{ backgroundColor: color }}
      >
        <span className="material-symbols-outlined text-white text-lg">
          {icon}
        </span>
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-on-surface truncate">
          {name}
        </p>
        <p className="text-[11px] text-on-surface-variant truncate">
          {account?.name ?? "Tài khoản đã xoá"} · {formatWeekdaysLabel(rule.weekdays)}
        </p>
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0">
        <p
          className={`text-[13px] font-bold ${
            rule.type === "income" ? "text-[#18448b]" : "text-error"
          }`}
        >
          {rule.type === "income" ? "+" : "-"}
          {formatVnd(rule.amount)}
        </p>
        <div className="flex items-center gap-1">
          <button
            aria-label="Sửa quy tắc"
            className="w-6 h-6 rounded-full bg-surface-container-low flex items-center justify-center"
            onClick={onEdit}
            type="button"
          >
            <span className="material-symbols-outlined text-[13px] text-on-surface-variant">
              edit
            </span>
          </button>
          <button
            aria-label="Xoá quy tắc"
            className="w-6 h-6 rounded-full bg-surface-container-low flex items-center justify-center"
            onClick={onDelete}
            type="button"
          >
            <span className="material-symbols-outlined text-[13px] text-error">
              delete
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
