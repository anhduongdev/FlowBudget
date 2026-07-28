"use client";

import { useActionState, useState } from "react";
import { createPortal, useFormStatus } from "react-dom";
import {
  setCategoryBudgetAction,
  setMonthlyBudgetAction,
  type BudgetFormState,
} from "@/lib/actions/budget-actions";
import { formatVnd } from "@/lib/format";

const initialState: BudgetFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="flex-1 py-3 rounded-xl bg-primary text-white font-label-md text-label-md hover:opacity-90 transition-all disabled:opacity-70"
      disabled={pending}
      type="submit"
    >
      {pending ? (
        <span className="material-symbols-outlined animate-spin align-middle">
          progress_activity
        </span>
      ) : (
        "Lưu hạn mức"
      )}
    </button>
  );
}

interface SetBudgetButtonProps {
  currentAmount: number | null;
  categoryId?: string;
  triggerClassName?: string;
}

export function SetBudgetButton({
  currentAmount,
  categoryId,
  triggerClassName,
}: SetBudgetButtonProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(
    currentAmount !== null ? String(currentAmount) : "",
  );
  const [state, formAction] = useActionState(
    categoryId ? setCategoryBudgetAction : setMonthlyBudgetAction,
    initialState,
  );
  const [handledState, setHandledState] = useState(state);

  function resetForm() {
    setAmount(currentAmount !== null ? String(currentAmount) : "");
  }

  function handleClose() {
    resetForm();
    setOpen(false);
  }

  if (state !== handledState) {
    setHandledState(state);
    if (state.success) {
      handleClose();
    }
  }

  const previewAmount = Number(amount) || 0;

  return (
    <>
      <button
        className={
          triggerClassName ??
          "font-label-sm text-label-sm text-primary hover:underline"
        }
        onClick={() => setOpen(true)}
        type="button"
      >
        {currentAmount === null ? "Đặt hạn mức" : "Cập nhật hạn mức"}
      </button>
      {open &&
        createPortal(
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <button
              aria-label="Đóng"
              className="absolute inset-0 bg-black/40"
              onClick={handleClose}
              type="button"
            ></button>
            <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl">
              <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  Hạn mức chi tiêu tháng này
                </h3>
                <button
                  className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest/40 transition-colors"
                  onClick={handleClose}
                  type="button"
                >
                  <span className="material-symbols-outlined text-xl">
                    close
                  </span>
                </button>
              </div>

              <form action={formAction} className="p-6 space-y-5">
                {categoryId && (
                  <input name="categoryId" type="hidden" value={categoryId} />
                )}
                {state.message && (
                  <p
                    aria-live="polite"
                    className="font-label-md text-label-md text-error text-center"
                  >
                    {state.message}
                  </p>
                )}
                <div className="space-y-1">
                  <label
                    className="font-label-md text-label-md text-on-surface-variant"
                    htmlFor="budget-amount"
                  >
                    Số tiền (đ)
                  </label>
                  <input
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 font-body-md text-body-md outline-none focus:border-primary transition-colors"
                    id="budget-amount"
                    inputMode="numeric"
                    min={1}
                    name="amount"
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Ví dụ: 5000000"
                    required
                    type="number"
                    value={amount}
                  />
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    {formatVnd(previewAmount)}
                  </p>
                  {state.errors?.amount && (
                    <p className="font-label-sm text-label-sm text-error">
                      {state.errors.amount[0]}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    className="flex-1 py-3 rounded-xl border border-outline-variant text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-low transition-colors"
                    onClick={handleClose}
                    type="button"
                  >
                    Hủy
                  </button>
                  <SubmitButton />
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
