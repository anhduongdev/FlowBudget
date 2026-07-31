"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import {
  createBulkTransactionsAction,
  type BulkTransactionActionState,
} from "@/lib/actions/bulk-transaction-actions";
import { getDatesInRangeByWeekdays, parseInclusiveDateRange } from "@/lib/date-range";
import { formatDateVnLong, formatVnd } from "@/lib/format";
import type { AccountOption } from "@/lib/services/account-service";
import type { CategoryOption } from "@/lib/services/category-service";
import {
  bulkCreateTransactionsSchema,
  MAX_BULK_RANGE_DAYS,
  MAX_GENERATED_TRANSACTIONS,
} from "@/lib/validations/bulk-transaction";
import { RangeCalendarPicker } from "../range-calendar-picker";
import { PreviewSection, type PreviewItem } from "./preview-section";
import { RuleCard } from "./rule-card";
import { RuleFormPanel } from "./rule-form-panel";
import type { BulkTransactionRuleDraft } from "./types";

interface BulkCreateFlowProps {
  accounts: AccountOption[];
  currentTotalBalance: number;
  expenseCategories: CategoryOption[];
  incomeCategories: CategoryOption[];
  initialFrom: string;
  initialTo: string;
}

type PanelState = { mode: "add" } | { mode: "edit"; index: number } | null;

const INITIAL_ACTION_STATE: BulkTransactionActionState = { status: "idle" };
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function BulkCreateFlow({
  accounts,
  currentTotalBalance,
  expenseCategories,
  incomeCategories,
  initialFrom,
  initialTo,
}: BulkCreateFlowProps) {
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [rangePickerOpen, setRangePickerOpen] = useState(false);
  const [rules, setRules] = useState<BulkTransactionRuleDraft[]>([]);
  const [panel, setPanel] = useState<PanelState>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const [state, dispatch, isPending] = useActionState(
    createBulkTransactionsAction,
    INITIAL_ACTION_STATE,
  );

  const range = useMemo(() => parseInclusiveDateRange(from, to), [from, to]);

  const previewItems = useMemo<PreviewItem[]>(() => {
    if (!range) return [];
    const items: PreviewItem[] = [];
    for (const rule of rules) {
      const dates = getDatesInRangeByWeekdays(range, rule.weekdays);
      for (const date of dates) {
        items.push({ dateIso: date.toISOString().slice(0, 10), rule });
      }
    }
    return items.sort((a, b) => a.dateIso.localeCompare(b.dateIso));
  }, [range, rules]);

  const totalExpense = previewItems
    .filter((item) => item.rule.type === "expense")
    .reduce((sum, item) => sum + item.rule.amount, 0);
  const totalIncome = previewItems
    .filter((item) => item.rule.type === "income")
    .reduce((sum, item) => sum + item.rule.amount, 0);

  const diffDays = range
    ? Math.round((range.end.getTime() - range.start.getTime()) / MS_PER_DAY)
    : 0;
  const isRangeTooLong = diffDays > MAX_BULK_RANGE_DAYS;
  const isOverGeneratedLimit = previewItems.length > MAX_GENERATED_TRANSACTIONS;

  function openEditRule(index: number) {
    setPanel({ mode: "edit", index });
  }

  function closePanel() {
    setPanel(null);
  }

  function saveRule(draft: BulkTransactionRuleDraft) {
    setRules((current) => {
      if (panel?.mode === "edit") {
        const next = [...current];
        next[panel.index] = draft;
        return next;
      }
      return [...current, draft];
    });
    setPanel(null);
  }

  function deleteRule(index: number) {
    setRules((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function handleConfirm() {
    setClientError(null);
    const payload = {
      from,
      to,
      rules: rules.map((rule) => ({
        type: rule.type,
        accountId: rule.accountId,
        categoryId: rule.categoryId ?? undefined,
        amount: rule.amount,
        weekdays: rule.weekdays,
        note: rule.note ?? undefined,
      })),
    };
    const parsed = bulkCreateTransactionsSchema.safeParse(payload);
    if (!parsed.success) {
      setClientError(
        parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ.",
      );
      return;
    }
    dispatch(parsed.data);
  }

  const editingDraft = panel?.mode === "edit" ? rules[panel.index] : null;

  if (state.status === "success" && state.summary) {
    return (
      <div className="px-6 py-10 flex flex-col items-center text-center gap-3">
        <span className="material-symbols-outlined text-[#18448b] text-5xl">
          task_alt
        </span>
        <p className="text-[16px] font-bold text-on-surface">
          Đã tạo {state.summary.transactionCount} giao dịch
        </p>
        <p className="text-[13px] text-on-surface-variant">
          Tổng chi {formatVnd(state.summary.totalExpense)} · Tổng thu{" "}
          {formatVnd(state.summary.totalIncome)}
        </p>
        <Link
          className="mt-3 px-5 py-2.5 rounded-xl bg-[#18448b] text-white text-[13px] font-semibold"
          href={`/preview/transactions?from=${from}&to=${to}`}
        >
          Về trang giao dịch
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="px-6 py-5 space-y-5 pb-28">
        <div className="bg-white rounded-2xl shadow-[0_4px_12px_-2px_rgba(0,0,0,0.05)] border border-[#18448b]/10 p-4">
          <p className="text-[12px] text-on-surface-variant mb-1">
            Kỳ áp dụng
          </p>
          <button
            className="w-full flex items-center justify-between"
            onClick={() => setRangePickerOpen(true)}
            type="button"
          >
            <span className="text-[14px] font-bold text-[#18448b]">
              {formatDateVnLong(from)} – {formatDateVnLong(to)}
            </span>
            <span className="material-symbols-outlined text-[#18448b]">
              edit_calendar
            </span>
          </button>
          {isRangeTooLong && (
            <p className="text-[11px] text-error mt-2">
              Khoảng ngày tối đa {MAX_BULK_RANGE_DAYS} ngày.
            </p>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-[13px] font-semibold text-on-surface">
            Quy tắc ({rules.length})
          </p>

          {rules.map((rule, index) => (
            <RuleCard
              account={accounts.find(
                (account) => account.id === rule.accountId,
              )}
              key={rule.clientId}
              onDelete={() => deleteRule(index)}
              onEdit={() => openEditRule(index)}
              rule={rule}
            />
          ))}

          <button
            className="w-full py-3 rounded-2xl border-2 border-dashed border-outline-variant flex items-center justify-center gap-2 text-on-surface-variant"
            onClick={() => setPanel({ mode: "add" })}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span className="text-[13px] font-semibold">Thêm quy tắc</span>
          </button>
        </div>

        <div>
          <p className="text-[13px] font-semibold text-on-surface mb-3">
            Xem trước
          </p>
          <PreviewSection
            currentTotalBalance={currentTotalBalance}
            items={previewItems}
            totalExpense={totalExpense}
            totalIncome={totalIncome}
          />
          {isOverGeneratedLimit && (
            <p className="text-[11px] text-error mt-2">
              Sẽ tạo {previewItems.length} giao dịch, vượt giới hạn{" "}
              {MAX_GENERATED_TRANSACTIONS}. Hãy thu hẹp kỳ hoặc giảm quy tắc.
            </p>
          )}
        </div>

        {(clientError || state.status === "error") && (
          <p className="text-[13px] text-error text-center">
            {clientError ?? state.message ?? "Có lỗi xảy ra, vui lòng thử lại."}
          </p>
        )}
      </div>

      <div className="fixed bottom-0 w-full max-w-[430px] bg-white/95 backdrop-blur-xl border-t border-[#18448b]/10 px-6 py-4 z-40">
        <button
          className="w-full py-3 rounded-xl bg-[#18448b] text-white font-semibold disabled:opacity-40"
          disabled={
            rules.length === 0 ||
            isPending ||
            isRangeTooLong ||
            isOverGeneratedLimit ||
            previewItems.length === 0
          }
          onClick={handleConfirm}
          type="button"
        >
          {isPending
            ? "Đang tạo..."
            : `Xác nhận tạo ${previewItems.length} giao dịch`}
        </button>
      </div>

      {rangePickerOpen && (
        <RangeCalendarPicker
          initialFrom={from}
          initialTo={to}
          onApply={(newFrom, newTo) => {
            setFrom(newFrom);
            setTo(newTo);
            setRangePickerOpen(false);
          }}
          onClose={() => setRangePickerOpen(false)}
        />
      )}

      {panel && (
        <RuleFormPanel
          accounts={accounts}
          expenseCategories={expenseCategories}
          incomeCategories={incomeCategories}
          initialDraft={editingDraft}
          onClose={closePanel}
          onSave={saveRule}
        />
      )}
    </>
  );
}
