"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  createTransactionAction,
  type TransactionFormState,
} from "@/lib/actions/transaction-actions";
import { evaluateArithmeticExpression } from "@/lib/safe-calculator";
import { MiniDatePicker } from "./mini-date-picker";

interface PartyDisplay {
  label: string;
  name: string;
  icon: string;
  color: string;
}

interface AmountEntryPanelProps {
  type: "expense" | "income" | "transfer";
  accountId: string;
  toAccountId?: string;
  categoryId?: string;
  from: PartyDisplay;
  to: PartyDisplay;
  onBack: () => void;
  onDone: () => void;
}

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
  const date = new Date(`${iso}T00:00:00`);
  const formatted = date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
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

export function AmountEntryPanel({
  type,
  accountId,
  toAccountId,
  categoryId,
  from,
  to,
  onBack,
  onDone,
}: AmountEntryPanelProps) {
  const router = useRouter();
  const [expression, setExpression] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(todayIso());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [state, formAction] = useActionState(
    createTransactionAction,
    initialState,
  );
  const [handledState, setHandledState] = useState(state);

  if (state !== handledState) {
    setHandledState(state);
  }

  useEffect(() => {
    if (state.success) {
      router.refresh();
      onDone();
    }
    // Intentionally react only to state transitions, not to onDone/router
    // identity (callers pass a fresh closure on every render).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const evaluated = evaluateArithmeticExpression(expression);
  const displayAmount = evaluated !== null ? Math.max(evaluated, 0) : 0;
  const canSubmit = evaluated !== null && evaluated > 0;

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

  const typeLabel =
    type === "income" ? "Thu nhập" : type === "transfer" ? "Số tiền" : "Chi phí";

  return (
    <div className="fixed top-[192px] bottom-0 w-full max-w-[430px] z-[80] flex flex-col bg-background text-on-surface rounded-t-3xl overflow-hidden shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
      <div className="flex items-center px-2 py-1 shrink-0">
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant"
          onClick={onBack}
          type="button"
        >
          <span className="material-symbols-outlined">arrow_back</span>
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
        className="flex-1 flex flex-col px-5 pt-4 min-h-0 overflow-y-auto"
      >
        <input name="type" type="hidden" value={type} />
        <input name="accountId" type="hidden" value={accountId} />
        {type === "transfer" && toAccountId && (
          <input name="toAccountId" type="hidden" value={toAccountId} />
        )}
        {type !== "transfer" && categoryId && (
          <input name="categoryId" type="hidden" value={categoryId} />
        )}
        <input
          name="amount"
          type="hidden"
          value={evaluated !== null ? evaluated : ""}
        />
        <input name="transactionDate" type="hidden" value={date} />
        <input name="note" type="hidden" value={note} />

        {state.message && (
          <p aria-live="polite" className="text-error text-[13px] text-center mb-3">
            {state.message}
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
            <p className="text-error text-[12px]">{state.errors.amount[0]}</p>
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
                  <span className="material-symbols-outlined">backspace</span>
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
      </form>

      {showDatePicker && (
        <MiniDatePicker
          onChange={setDate}
          onClose={() => setShowDatePicker(false)}
          value={date}
        />
      )}
    </div>
  );
}
