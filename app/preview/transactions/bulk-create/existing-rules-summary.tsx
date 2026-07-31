"use client";

import { getMondayFirstWeekdayIndex } from "@/lib/date-range";
import { formatVnd } from "@/lib/format";
import type { TransactionDayGroup } from "@/lib/services/transaction-service";
import { formatWeekdaysLabel } from "./types";

interface ExistingRuleSummary {
  key: string;
  type: "income" | "expense";
  categoryName: string | null;
  icon: string;
  color: string;
  accountName: string;
  amount: number;
  weekdays: number[];
  count: number;
}

// Không có bảng nào lưu lại "quy tắc" gốc đã dùng để tạo hàng loạt — suy luận
// lại pattern (danh mục + tài khoản + số tiền giống nhau → gộp 1 dòng, thứ
// trong tuần lấy từ ngày thực tế của các giao dịch khớp) thay vì liệt kê
// từng giao dịch, để khớp đúng cách người dùng tư duy khi tạo quy tắc.
function summarizeExistingTransactions(
  dayGroups: TransactionDayGroup[],
): ExistingRuleSummary[] {
  const map = new Map<string, ExistingRuleSummary>();

  for (const group of dayGroups) {
    const weekdayIndex = getMondayFirstWeekdayIndex(
      new Date(`${group.dateIso}T00:00:00Z`),
    );
    for (const item of group.items) {
      if (item.type === "transfer") continue;

      const key = `${item.type}:${item.categoryId ?? "none"}:${item.accountId}:${item.amount}`;
      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
        if (!existing.weekdays.includes(weekdayIndex)) {
          existing.weekdays.push(weekdayIndex);
        }
      } else {
        map.set(key, {
          key,
          type: item.type,
          categoryName: item.categoryName,
          icon: item.icon,
          color: item.color,
          accountName: item.accountName,
          amount: item.amount,
          weekdays: [weekdayIndex],
          count: 1,
        });
      }
    }
  }

  return [...map.values()].sort((a, b) => b.count - a.count);
}

interface ExistingRulesSummaryProps {
  dayGroups: TransactionDayGroup[];
  emptyMessage: string;
}

export function ExistingRulesSummary({
  dayGroups,
  emptyMessage,
}: ExistingRulesSummaryProps) {
  const summaries = summarizeExistingTransactions(dayGroups);

  if (summaries.length === 0) {
    return (
      <p className="text-center text-[13px] text-on-surface-variant py-6">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {summaries.map((summary) => (
        <div
          className="bg-white rounded-2xl shadow-[0_4px_12px_-2px_rgba(0,0,0,0.05)] border border-[#18448b]/10 p-3 flex items-center gap-3"
          key={summary.key}
        >
          <span
            className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center"
            style={{ backgroundColor: summary.color }}
          >
            <span className="material-symbols-outlined text-white text-lg">
              {summary.icon}
            </span>
          </span>

          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-on-surface truncate">
              {summary.categoryName ?? "Không danh mục"}
            </p>
            <p className="text-[11px] text-on-surface-variant truncate">
              {summary.accountName} · {formatWeekdaysLabel(summary.weekdays)}
            </p>
          </div>

          <div className="flex flex-col items-end gap-0.5 shrink-0">
            <p
              className={`text-[13px] font-bold ${
                summary.type === "income" ? "text-[#18448b]" : "text-error"
              }`}
            >
              {summary.type === "income" ? "+" : "-"}
              {formatVnd(summary.amount)}
            </p>
            <p className="text-[11px] text-on-surface-variant">
              ×{summary.count}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
