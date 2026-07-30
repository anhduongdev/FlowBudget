"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { createPortal, useFormStatus } from "react-dom";
import {
  deleteTransactionAction,
  updateTransactionAction,
  type TransactionFormState,
} from "@/lib/actions/transaction-actions";
import { formatDateVnLong } from "@/lib/format";
import { evaluateArithmeticExpression } from "@/lib/safe-calculator";
import type { AccountOption } from "@/lib/services/account-service";
import type { TransactionListItem } from "@/lib/services/transaction-service";
import { MiniDatePicker } from "./mini-date-picker";

interface PartyDisplay {
  label: string;
  name: string;
  icon: string;
  color: string;
}

interface EditTransactionPanelProps {
  transaction: TransactionListItem;
  accounts: AccountOption[];
  onClose: () => void;
}

type PanelMode = "view" | "edit-amount";

const initialState: TransactionFormState = {};

interface KeyDef {
  label: string;
  kind: "op" | "digit" | "equals";
  value: string;
}

const KEY_ROWS: KeyDef[][] = [
  [
    { label: "÷", kind: "op", value: "/" },
    { label: "7", kind: "digit", value: "7" },
    { label: "8", kind: "digit", value: "8" },
    { label: "9", kind: "digit", value: "9" },
  ],
  [
    { label: "×", kind: "op", value: "*" },
    { label: "4", kind: "digit", value: "4" },
    { label: "5", kind: "digit", value: "5" },
    { label: "6", kind: "digit", value: "6" },
  ],
  [
    { label: "−", kind: "op", value: "-" },
    { label: "1", kind: "digit", value: "1" },
    { label: "2", kind: "digit", value: "2" },
    { label: "3", kind: "digit", value: "3" },
  ],
  [
    { label: "+", kind: "op", value: "+" },
    { label: "=", kind: "equals", value: "=" },
    { label: "0", kind: "digit", value: "0" },
    { label: ",", kind: "digit", value: "." },
  ],
];

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatDisplayDate(iso: string): string {
  const formatted = formatDateVnLong(iso);
  return iso === todayIso() ? `Hôm nay, ${formatted}` : formatted;
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="w-full h-full rounded-2xl bg-[#18448b] flex items-center justify-center disabled:opacity-40"
      disabled={disabled || pending}
      type="submit"
    >
      {pending ? (
        <span className="material-symbols-outlined animate-spin text-white">
          progress_activity
        </span>
      ) : (
        <span className="material-symbols-outlined text-white text-2xl">
          check
        </span>
      )}
    </button>
  );
}

function DeleteConfirmSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold bg-error text-white hover:opacity-90 transition-colors disabled:opacity-70"
      disabled={pending}
      type="submit"
    >
      {pending ? (
        <span className="material-symbols-outlined animate-spin align-middle text-[16px]">
          progress_activity
        </span>
      ) : (
        "Xóa"
      )}
    </button>
  );
}

export function EditTransactionPanel({
  transaction,
  accounts,
  onClose,
}: EditTransactionPanelProps) {
  const router = useRouter();
  const isTransfer = transaction.type === "transfer";
  const formRef = useRef<HTMLFormElement>(null);

  const account = accounts.find((item) => item.id === transaction.accountId);
  const toAccount = accounts.find(
    (item) => item.id === transaction.toAccountId,
  );

  const from: PartyDisplay =
    transaction.type === "income"
      ? {
          label: "Từ danh mục",
          name: transaction.categoryName ?? "",
          icon: transaction.icon,
          color: transaction.color,
        }
      : {
          label: "Từ tài khoản",
          name: account?.name ?? transaction.accountName,
          icon: account?.icon ?? "account_balance_wallet",
          color: account?.color ?? "#94a3b8",
        };

  const to: PartyDisplay = isTransfer
    ? {
        label: "Đến tài khoản",
        name: toAccount?.name ?? transaction.toAccountName ?? "",
        icon: toAccount?.icon ?? "account_balance_wallet",
        color: toAccount?.color ?? "#94a3b8",
      }
    : transaction.type === "income"
      ? {
          label: "Đến tài khoản",
          name: account?.name ?? transaction.accountName,
          icon: account?.icon ?? "account_balance_wallet",
          color: account?.color ?? "#94a3b8",
        }
      : {
          label: "Đến danh mục",
          name: transaction.categoryName ?? "",
          icon: transaction.icon,
          color: transaction.color,
        };

  const [mode, setMode] = useState<PanelMode>("view");
  const [expression, setExpression] = useState(String(transaction.amount));
  const [note, setNote] = useState(transaction.note ?? "");
  const [date, setDate] = useState(transaction.transactionDateIso);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [quickDatePick, setQuickDatePick] = useState(false);
  const quickSaveRequestedRef = useRef(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const [state, formAction] = useActionState(
    updateTransactionAction,
    initialState,
  );
  const [handledState, setHandledState] = useState(state);
  const [deleteState, deleteFormAction] = useActionState(
    deleteTransactionAction,
    initialState,
  );
  const [handledDeleteState, setHandledDeleteState] = useState(deleteState);

  if (state !== handledState) {
    setHandledState(state);
  }
  if (deleteState !== handledDeleteState) {
    setHandledDeleteState(deleteState);
  }

  useEffect(() => {
    if (state.success || deleteState.success) {
      router.refresh();
      onClose();
    }
    // Intentionally react only to state/deleteState transitions, not to
    // onClose/router identity (callers pass a fresh closure on every render).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, deleteState]);

  useEffect(() => {
    if (quickSaveRequestedRef.current) {
      quickSaveRequestedRef.current = false;
      formRef.current?.requestSubmit();
    }
  }, [date]);

  const evaluated = evaluateArithmeticExpression(expression);
  const displayAmount = evaluated !== null ? Math.max(evaluated, 0) : 0;
  const canSubmit = evaluated !== null && evaluated > 0;
  const otherFieldError = Object.entries(state.errors ?? {}).find(
    ([field]) => field !== "amount",
  )?.[1][0];

  function pressKey(key: KeyDef) {
    setExpression((current) => {
      if (key.kind === "equals") {
        const result = evaluateArithmeticExpression(current);
        return result !== null ? String(result) : current;
      }
      if (key.kind === "op") {
        if (current === "") return current;
        const lastChar = current[current.length - 1];
        if ("+-*/".includes(lastChar)) {
          return current.slice(0, -1) + key.value;
        }
        return current + key.value;
      }
      return current + key.value;
    });
  }

  function backspace() {
    setExpression((current) => current.slice(0, -1));
  }

  function openQuickDatePicker() {
    setQuickDatePick(true);
    setShowDatePicker(true);
  }

  function handleDateChange(iso: string) {
    setDate(iso);
    if (quickDatePick) {
      quickSaveRequestedRef.current = true;
    }
  }

  function closeDatePicker() {
    setShowDatePicker(false);
    setQuickDatePick(false);
  }

  const typeLabel =
    transaction.type === "income"
      ? "Thu nhập"
      : isTransfer
        ? "Số tiền"
        : "Chi phí";

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center">
      <button
        aria-label="Đóng"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        type="button"
      />
      <div
        className={`relative w-full max-w-[430px] flex flex-col bg-background text-on-surface rounded-t-3xl overflow-hidden shadow-[0_-8px_30px_rgba(0,0,0,0.12)] ${
          mode === "edit-amount" ? "h-[calc(100%-192px)]" : ""
        }`}
      >
        <div className="flex items-center justify-between px-2 py-1 shrink-0">
          {mode === "edit-amount" ? (
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant"
              onClick={() => setMode("view")}
              type="button"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          ) : (
            <div className="w-8 h-8" />
          )}
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

        <div className="flex shrink-0">
          <div className="flex-1 bg-[#18448b] px-3 py-2 flex items-center justify-center gap-2">
            <div
              className="w-7 h-7 shrink-0 rounded-full bg-white flex items-center justify-center"
              style={{ color: from.color }}
            >
              <span className="material-symbols-outlined text-[16px]">
                {from.icon}
              </span>
            </div>
            <div className="min-w-0 text-left">
              <p className="text-[9px] text-white/70 leading-tight">
                {from.label}
              </p>
              <p className="text-[12px] font-bold text-white truncate leading-tight">
                {from.name}
              </p>
            </div>
          </div>
          <div className="flex-1 bg-[#2f6db3] px-3 py-2 flex items-center justify-center gap-2">
            <div
              className="w-7 h-7 shrink-0 rounded-full bg-white flex items-center justify-center"
              style={{ color: to.color }}
            >
              <span className="material-symbols-outlined text-[16px]">
                {to.icon}
              </span>
            </div>
            <div className="min-w-0 text-left">
              <p className="text-[9px] text-white/70 leading-tight">
                {to.label}
              </p>
              <p className="text-[12px] font-bold text-white truncate leading-tight">
                {to.name}
              </p>
            </div>
          </div>
        </div>

        <form
          action={formAction}
          className="flex-1 flex flex-col min-h-0 overflow-y-auto"
          ref={formRef}
        >
          <input name="id" type="hidden" value={transaction.id} />
          <input name="type" type="hidden" value={transaction.type} />
          <input name="accountId" type="hidden" value={transaction.accountId} />
          {isTransfer && (
            <input
              name="toAccountId"
              type="hidden"
              value={transaction.toAccountId ?? ""}
            />
          )}
          {!isTransfer && transaction.categoryId && (
            <input
              name="categoryId"
              type="hidden"
              value={transaction.categoryId}
            />
          )}
          <input
            name="amount"
            type="hidden"
            value={evaluated !== null ? evaluated : ""}
          />
          <input name="transactionDate" type="hidden" value={date} />
          <input name="note" type="hidden" value={note} />

          {mode === "view" ? (
            <div className="flex flex-col px-5 pt-5 gap-4">
              <button
                className="flex flex-col items-center gap-2 py-6 rounded-2xl transition-colors hover:opacity-90"
                onClick={() => setMode("edit-amount")}
                style={{ backgroundColor: `${transaction.color}14` }}
                type="button"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center shadow-[0_4px_10px_-2px_rgba(0,0,0,0.15)]"
                  style={{ backgroundColor: transaction.color }}
                >
                  <span className="material-symbols-outlined text-white text-2xl">
                    {transaction.icon}
                  </span>
                </div>
                <p className="text-[12px] text-on-surface-variant">
                  {typeLabel}
                </p>
                <p className="text-[28px] font-bold text-[#18448b] leading-tight">
                  {Math.round(transaction.amount).toLocaleString("vi-VN")} đ
                </p>
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col px-5 pt-4 min-h-0 overflow-y-auto">
              {(state.message || otherFieldError) && (
                <p
                  aria-live="polite"
                  className="text-error text-[13px] text-center mb-3"
                >
                  {state.message || otherFieldError}
                </p>
              )}

              <div className="text-center mb-2.5 shrink-0">
                <p className="text-[12px] text-on-surface-variant mb-0.5">
                  {typeLabel}
                </p>
                <p className="text-[28px] font-bold text-[#18448b] leading-tight">
                  {Math.round(displayAmount).toLocaleString("vi-VN")} đ
                </p>
                <p className="text-[12px] text-on-surface-variant/60 mt-0.5 h-[16px]">
                  {expression.replace(/\*/g, "×").replace(/\//g, "÷")}
                </p>
                {state.errors?.amount && (
                  <p className="text-error text-[12px]">
                    {state.errors.amount[0]}
                  </p>
                )}
              </div>

              <input
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2 text-center text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-[#18448b] transition-colors mb-2.5 shrink-0"
                maxLength={255}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Ghi chú..."
                value={note}
              />

              <div className="grid grid-cols-5 gap-2 flex-1 min-h-[260px] shrink-0">
                {KEY_ROWS.map((row, rowIndex) => (
                  <div className="contents" key={rowIndex}>
                    {row.map((key) => (
                      <button
                        className={`rounded-2xl flex items-center justify-center text-xl font-semibold ${
                          key.kind === "op"
                            ? "bg-surface-container-low text-[#18448b]"
                            : key.kind === "equals"
                              ? "bg-[#18448b]/10 text-[#18448b] font-bold"
                              : "bg-white border border-outline-variant/40 text-on-surface"
                        }`}
                        key={key.label}
                        onClick={() => pressKey(key)}
                        type="button"
                      >
                        {key.label}
                      </button>
                    ))}
                    {rowIndex === 0 && (
                      <button
                        className="rounded-2xl bg-surface-container-low flex items-center justify-center text-on-surface-variant"
                        onClick={backspace}
                        type="button"
                      >
                        <span className="material-symbols-outlined">
                          backspace
                        </span>
                      </button>
                    )}
                    {rowIndex === 1 && (
                      <button
                        className="rounded-2xl bg-surface-container-low flex items-center justify-center text-on-surface-variant"
                        onClick={() => setShowDatePicker(true)}
                        type="button"
                      >
                        <span className="material-symbols-outlined">
                          calendar_month
                        </span>
                      </button>
                    )}
                    {rowIndex === 2 && (
                      <div className="row-span-2">
                        <SubmitButton disabled={!canSubmit} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                className="text-center text-on-surface-variant text-[12px] py-2 shrink-0 hover:text-[#18448b] transition-colors"
                onClick={() => setShowDatePicker(true)}
                type="button"
              >
                {formatDisplayDate(date)}
              </button>
            </div>
          )}
        </form>

        {mode === "view" && (
          <div className="grid grid-cols-2 gap-4 px-10 pb-8 pt-5 shrink-0">
            <button
              className="flex flex-col items-center gap-1.5"
              onClick={() => setConfirmingDelete(true)}
              type="button"
            >
              <span className="w-12 h-12 rounded-full bg-error flex items-center justify-center">
                <span className="material-symbols-outlined text-white">
                  delete
                </span>
              </span>
              <span className="text-[11px] font-semibold text-on-surface-variant">
                Xóa
              </span>
            </button>
            <button
              className="flex flex-col items-center gap-1.5"
              onClick={openQuickDatePicker}
              type="button"
            >
              <span className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface-variant">
                  calendar_month
                </span>
              </span>
              <span className="text-[11px] font-semibold text-on-surface-variant">
                Ngày
              </span>
            </button>
          </div>
        )}

        {showDatePicker && (
          <MiniDatePicker
            onChange={handleDateChange}
            onClose={closeDatePicker}
            value={date}
          />
        )}

        {confirmingDelete && (
          <div className="fixed inset-0 z-[95] flex items-center justify-center p-6">
            <button
              aria-label="Đóng"
              className="absolute inset-0 bg-black/40"
              onClick={() => setConfirmingDelete(false)}
              type="button"
            />
            <div className="relative w-full max-w-[300px] bg-white rounded-3xl shadow-2xl p-5 text-center space-y-4">
              <p className="text-[14px] font-semibold text-on-surface">
                Xóa giao dịch này?
              </p>
              <p className="text-[12px] text-on-surface-variant">
                Số dư tài khoản sẽ được hoàn lại. Hành động này không thể hoàn
                tác.
              </p>
              {deleteState.message && (
                <p className="text-error text-[12px]">{deleteState.message}</p>
              )}
              <form
                action={deleteFormAction}
                className="flex items-center gap-2"
              >
                <input name="id" type="hidden" value={transaction.id} />
                <button
                  className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors"
                  onClick={() => setConfirmingDelete(false)}
                  type="button"
                >
                  Hủy
                </button>
                <DeleteConfirmSubmitButton />
              </form>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
