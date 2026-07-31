"use client";

import { useId, useState } from "react";
import { formatVnd } from "@/lib/format";
import { evaluateArithmeticExpression } from "@/lib/safe-calculator";
import type { AccountOption } from "@/lib/services/account-service";
import type { CategoryOption } from "@/lib/services/category-service";
import { WEEKDAY_LABELS, type BulkTransactionRuleDraft } from "./types";

interface RuleFormPanelProps {
  accounts: AccountOption[];
  expenseCategories: CategoryOption[];
  incomeCategories: CategoryOption[];
  initialDraft: BulkTransactionRuleDraft | null;
  onClose: () => void;
  onSave: (draft: BulkTransactionRuleDraft) => void;
}

const ALL_WEEKDAYS = [0, 1, 2, 3, 4, 5, 6];

export function RuleFormPanel({
  accounts,
  expenseCategories,
  incomeCategories,
  initialDraft,
  onClose,
  onSave,
}: RuleFormPanelProps) {
  const noteFieldId = useId();
  const [type, setType] = useState<"expense" | "income">(
    initialDraft?.type ?? "expense",
  );
  const [accountId, setAccountId] = useState(
    initialDraft?.accountId ?? accounts[0]?.id ?? "",
  );
  const [categoryId, setCategoryId] = useState<string | null>(
    initialDraft?.categoryId ?? null,
  );
  const [amountText, setAmountText] = useState(
    initialDraft ? String(initialDraft.amount) : "",
  );
  const [weekdays, setWeekdays] = useState<number[]>(
    initialDraft?.weekdays ?? ALL_WEEKDAYS,
  );
  const [note, setNote] = useState(initialDraft?.note ?? "");

  const categories = type === "income" ? incomeCategories : expenseCategories;
  const selectedCategory = categories.find((item) => item.id === categoryId);
  const evaluatedAmount = evaluateArithmeticExpression(amountText);
  const isAllDays = weekdays.length === 7;
  const canSave =
    accountId !== "" &&
    evaluatedAmount !== null &&
    evaluatedAmount > 0 &&
    weekdays.length > 0;

  function selectType(next: "expense" | "income") {
    setType(next);
    setCategoryId(null);
  }

  function toggleWeekday(index: number) {
    setWeekdays((current) =>
      current.includes(index)
        ? current.filter((value) => value !== index)
        : [...current, index].sort((a, b) => a - b),
    );
  }

  function toggleAllDays() {
    setWeekdays((current) => (current.length === 7 ? [] : ALL_WEEKDAYS));
  }

  function handleSave() {
    if (!canSave || evaluatedAmount === null) return;

    onSave({
      clientId: initialDraft?.clientId ?? crypto.randomUUID(),
      type,
      accountId,
      categoryId,
      categoryLabel: selectedCategory
        ? {
            name: selectedCategory.name,
            icon: selectedCategory.icon,
            color: selectedCategory.color,
          }
        : null,
      amount: evaluatedAmount,
      weekdays,
      note: note.trim() || null,
    });
  }

  return (
    <>
      <button
        aria-label="Đóng"
        className="fixed inset-0 z-[65] bg-black/40"
        onClick={onClose}
        type="button"
      />
      <div className="fixed bottom-0 top-16 w-full max-w-[430px] z-[70] bg-background text-on-surface flex flex-col rounded-t-3xl overflow-hidden shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/30 shrink-0">
          <h2 className="font-semibold text-[15px] text-on-surface">
            {initialDraft ? "Sửa quy tắc" : "Thêm quy tắc"}
          </h2>
          <button
            className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center"
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-lg">
              close
            </span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          <div className="flex gap-2">
            <button
              className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold border transition-colors ${
                type === "expense"
                  ? "bg-[#18448b] text-white border-[#18448b]"
                  : "border-outline-variant text-on-surface-variant"
              }`}
              onClick={() => selectType("expense")}
              type="button"
            >
              Chi phí
            </button>
            <button
              className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold border transition-colors ${
                type === "income"
                  ? "bg-[#18448b] text-white border-[#18448b]"
                  : "border-outline-variant text-on-surface-variant"
              }`}
              onClick={() => selectType("income")}
              type="button"
            >
              Thu nhập
            </button>
          </div>

          <div>
            <p className="text-[12px] text-on-surface-variant mb-2">
              Danh mục
            </p>
            <div className="grid grid-cols-4 gap-x-3 gap-y-4">
              <button
                className="flex flex-col items-center gap-1.5"
                onClick={() => setCategoryId(null)}
                type="button"
              >
                <span
                  className={`w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center ${
                    categoryId === null
                      ? "border-[#18448b]"
                      : "border-outline-variant"
                  }`}
                >
                  <span className="material-symbols-outlined text-on-surface-variant text-lg">
                    block
                  </span>
                </span>
                <span className="text-[11px] text-center leading-tight text-on-surface-variant">
                  Không danh mục
                </span>
              </button>
              {categories.map((category) => (
                <button
                  className="flex flex-col items-center gap-1.5"
                  key={category.id}
                  onClick={() => setCategoryId(category.id)}
                  type="button"
                >
                  <span
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      categoryId === category.id
                        ? "ring-2 ring-[#18448b] ring-offset-2 ring-offset-background"
                        : ""
                    }`}
                    style={{ backgroundColor: category.color }}
                  >
                    <span className="material-symbols-outlined text-white text-lg">
                      {category.icon}
                    </span>
                  </span>
                  <span className="text-[11px] text-center leading-tight text-on-surface">
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[12px] text-on-surface-variant mb-2">
              Tài khoản
            </p>
            <div className="grid grid-cols-4 gap-x-3 gap-y-4">
              {accounts.map((account) => (
                <button
                  className="flex flex-col items-center gap-1.5"
                  key={account.id}
                  onClick={() => setAccountId(account.id)}
                  type="button"
                >
                  <span
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      accountId === account.id
                        ? "ring-2 ring-[#18448b] ring-offset-2 ring-offset-background"
                        : ""
                    }`}
                    style={{ backgroundColor: account.color }}
                  >
                    <span className="material-symbols-outlined text-white text-lg">
                      {account.icon}
                    </span>
                  </span>
                  <span className="text-[11px] text-center leading-tight text-on-surface">
                    {account.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[12px] text-on-surface-variant mb-2">
              Số tiền mỗi lần
            </p>
            <input
              className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-[16px] font-semibold text-on-surface outline-none focus:ring-2 focus:ring-[#18448b]"
              inputMode="decimal"
              onChange={(event) => setAmountText(event.target.value)}
              placeholder="0"
              type="text"
              value={amountText}
            />
            {evaluatedAmount !== null && (
              <p className="text-[12px] text-[#18448b] font-semibold mt-1.5">
                {formatVnd(evaluatedAmount)}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[12px] text-on-surface-variant">
                Áp dụng vào ngày
              </p>
              <button
                className="text-[11px] font-semibold text-[#18448b]"
                onClick={toggleAllDays}
                type="button"
              >
                {isAllDays ? "Bỏ chọn tất cả" : "Chọn tất cả"}
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {WEEKDAY_LABELS.map((label, index) => {
                const active = weekdays.includes(index);
                return (
                  <button
                    className={`w-11 h-11 rounded-full text-[12px] font-semibold transition-colors ${
                      active
                        ? "bg-[#18448b] text-white"
                        : "bg-surface-container-low text-on-surface-variant"
                    }`}
                    key={label}
                    onClick={() => toggleWeekday(index)}
                    type="button"
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label
              className="text-[12px] text-on-surface-variant mb-2 block"
              htmlFor={noteFieldId}
            >
              Ghi chú (tuỳ chọn)
            </label>
            <input
              className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-[13px] text-on-surface outline-none focus:ring-2 focus:ring-[#18448b]"
              id={noteFieldId}
              maxLength={255}
              onChange={(event) => setNote(event.target.value)}
              placeholder="VD: Ăn uống hàng ngày"
              type="text"
              value={note}
            />
          </div>
        </div>

        <div className="px-5 py-3 border-t border-outline-variant/20 shrink-0">
          <button
            className="w-full py-3 rounded-xl bg-[#18448b] text-white font-semibold disabled:opacity-40"
            disabled={!canSave}
            onClick={handleSave}
            type="button"
          >
            Xong
          </button>
        </div>
      </div>
    </>
  );
}
