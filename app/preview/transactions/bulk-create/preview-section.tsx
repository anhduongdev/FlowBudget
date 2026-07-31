"use client";

import { formatDateVnLong, formatVnd } from "@/lib/format";
import type { BulkTransactionRuleDraft } from "./types";

export interface PreviewItem {
  dateIso: string;
  rule: BulkTransactionRuleDraft;
}

interface PreviewSectionProps {
  items: PreviewItem[];
  newTotalExpense: number;
  newTotalIncome: number;
  existingTotalExpense: number;
  existingTotalIncome: number;
  openingBalance: number;
}

export function PreviewSection({
  items,
  newTotalExpense,
  newTotalIncome,
  existingTotalExpense,
  existingTotalIncome,
  openingBalance,
}: PreviewSectionProps) {
  const projectedBalance =
    openingBalance +
    existingTotalIncome +
    newTotalIncome -
    existingTotalExpense -
    newTotalExpense;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-3 rounded-2xl shadow-[0_4px_12px_-2px_rgba(0,0,0,0.05)] border border-[#18448b]/10">
          <p className="text-[11px] font-medium text-on-surface-variant mb-1">
            Số dư đầu kỳ
          </p>
          <p
            className={`text-[15px] font-bold ${
              openingBalance < 0 ? "text-error" : "text-[#18448b]"
            }`}
          >
            {formatVnd(openingBalance)}
          </p>
        </div>
        <div className="bg-white p-3 rounded-2xl shadow-[0_4px_12px_-2px_rgba(0,0,0,0.05)] border border-[#18448b]/10">
          <p className="text-[11px] font-medium text-on-surface-variant mb-1">
            Số dư dự kiến cuối kỳ
          </p>
          <p
            className={`text-[15px] font-bold ${
              projectedBalance < 0 ? "text-error" : "text-teal-600"
            }`}
          >
            {formatVnd(projectedBalance)}
          </p>
        </div>
        <div className="bg-white p-3 rounded-2xl shadow-[0_4px_12px_-2px_rgba(0,0,0,0.05)] border border-[#18448b]/10">
          <p className="text-[11px] font-medium text-on-surface-variant mb-1">
            Tổng chi sẽ tạo
          </p>
          <p className="text-[15px] font-bold text-error">
            {formatVnd(newTotalExpense)}
          </p>
        </div>
        <div className="bg-white p-3 rounded-2xl shadow-[0_4px_12px_-2px_rgba(0,0,0,0.05)] border border-[#18448b]/10">
          <p className="text-[11px] font-medium text-on-surface-variant mb-1">
            Tổng thu sẽ tạo
          </p>
          <p className="text-[15px] font-bold text-[#18448b]">
            {formatVnd(newTotalIncome)}
          </p>
        </div>
      </div>

      {items.length > 0 && (
        <div className="bg-white rounded-2xl shadow-[0_4px_12px_-2px_rgba(0,0,0,0.05)] border border-[#18448b]/10 max-h-80 overflow-y-auto divide-y divide-outline-variant/20">
          {items.map((item, index) => (
            <div
              className="flex items-center gap-3 px-3 py-2.5"
              key={`${item.dateIso}-${item.rule.clientId}-${index}`}
            >
              <span
                className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: item.rule.categoryLabel?.color ?? "#94a3b8",
                }}
              >
                <span className="material-symbols-outlined text-white text-[14px]">
                  {item.rule.categoryLabel?.icon ?? "savings"}
                </span>
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-on-surface truncate">
                  {item.rule.categoryLabel?.name ?? "Không danh mục"}
                </p>
                <p className="text-[11px] text-on-surface-variant">
                  {formatDateVnLong(item.dateIso)}
                </p>
              </div>
              <p
                className={`text-[12px] font-bold shrink-0 ${
                  item.rule.type === "income" ? "text-[#18448b]" : "text-error"
                }`}
              >
                {item.rule.type === "income" ? "+" : "-"}
                {formatVnd(item.rule.amount)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
