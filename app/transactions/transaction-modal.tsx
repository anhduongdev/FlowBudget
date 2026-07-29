"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { ConfirmDeleteButton } from "@/app/_components/confirm-delete-button";
import {
  createTransactionAction,
  deleteTransactionAction,
  updateTransactionAction,
  type TransactionFormState,
} from "@/lib/actions/transaction-actions";
import type { AccountOption } from "@/lib/services/account-service";
import type { CategoryOption } from "@/lib/services/category-service";

export interface EditableTransaction {
  id: string;
  type: "income" | "expense" | "transfer";
  accountId: string;
  toAccountId: string | null;
  categoryId: string | null;
  amount: number;
  transactionDateIso: string;
  note: string | null;
}

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  accounts: AccountOption[];
  expenseCategories: CategoryOption[];
  incomeCategories: CategoryOption[];
  transaction?: EditableTransaction | null;
}

const TRANSACTION_TYPES = [
  { value: "expense", label: "Chi phí", icon: "arrow_downward", color: "#ef4444" },
  { value: "income", label: "Thu nhập", icon: "arrow_upward", color: "#22c55e" },
  { value: "transfer", label: "Chuyển khoản", icon: "swap_horiz", color: "#3b82f6" },
] as const;

type TransactionType = (typeof TRANSACTION_TYPES)[number]["value"];

type PickerName = "account" | "toAccount" | "category" | null;

const initialState: TransactionFormState = {};

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function IconBadge({
  icon,
  color,
  size = "w-14 h-14",
  iconSize = "text-2xl",
}: {
  icon: string;
  color: string;
  size?: string;
  iconSize?: string;
}) {
  return (
    <div
      className={`${size} rounded-full flex items-center justify-center shrink-0`}
      style={{ backgroundColor: color }}
    >
      <span className={`material-symbols-outlined ${iconSize} text-white`}>
        {icon}
      </span>
    </div>
  );
}

function SelectorChip({
  label,
  icon,
  color,
  value,
  active,
  onClick,
}: {
  label: string;
  icon: string;
  color: string;
  value: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-colors ${
        active
          ? "border-primary bg-primary/5"
          : "border-outline-variant/50 hover:bg-surface-container-low"
      }`}
      onClick={onClick}
      type="button"
    >
      <IconBadge color={color} icon={icon} iconSize="text-lg" size="w-10 h-10" />
      <div className="min-w-0">
        <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide">
          {label}
        </p>
        <p className="font-label-md text-label-md text-on-surface truncate">
          {value}
        </p>
      </div>
      <span className="material-symbols-outlined text-on-surface-variant ml-auto text-lg">
        {active ? "expand_less" : "expand_more"}
      </span>
    </button>
  );
}

function SubmitButton({ disabled, label }: { disabled: boolean; label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="flex-1 py-3 rounded-xl bg-primary text-white font-label-md text-label-md hover:opacity-90 transition-all disabled:opacity-70"
      disabled={disabled || pending}
      type="submit"
    >
      {pending ? (
        <span className="material-symbols-outlined animate-spin align-middle">
          progress_activity
        </span>
      ) : (
        label
      )}
    </button>
  );
}

export function TransactionModal({
  open,
  onClose,
  accounts,
  expenseCategories,
  incomeCategories,
  transaction,
}: TransactionModalProps) {
  const isEditing = Boolean(transaction);

  function initialCategoryId(type: TransactionType): string {
    if (transaction && transaction.type === type && transaction.categoryId) {
      return transaction.categoryId;
    }
    return type === "income"
      ? (incomeCategories[0]?.id ?? "")
      : (expenseCategories[0]?.id ?? "");
  }

  const [type, setType] = useState<TransactionType>(transaction?.type ?? "expense");
  const [accountId, setAccountId] = useState(
    transaction?.accountId ?? accounts[0]?.id ?? "",
  );
  const [toAccountId, setToAccountId] = useState(
    transaction?.toAccountId ??
      accounts.find((a) => a.id !== accounts[0]?.id)?.id ??
      "",
  );
  const [categoryId, setCategoryId] = useState<string>(
    initialCategoryId(transaction?.type ?? "expense"),
  );
  const [amount, setAmount] = useState(
    transaction ? String(transaction.amount) : "",
  );
  const [date, setDate] = useState(transaction?.transactionDateIso ?? todayIsoDate());
  const [note, setNote] = useState(transaction?.note ?? "");
  const [openPicker, setOpenPicker] = useState<PickerName>(null);
  const [state, formAction] = useActionState(
    isEditing ? updateTransactionAction : createTransactionAction,
    initialState,
  );
  const [handledState, setHandledState] = useState(state);
  const [deleteState, deleteFormAction] = useActionState(
    deleteTransactionAction,
    initialState,
  );
  const [handledDeleteState, setHandledDeleteState] = useState(deleteState);

  useEffect(() => {
    if (state.success || deleteState.success) {
      onClose();
    }
    // Intentionally react only to state/deleteState transitions, not to
    // onClose identity (callers pass a fresh closure on every render).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, deleteState]);

  if (!open) return null;

  const availableTypes = TRANSACTION_TYPES.filter(
    (option) => option.value !== "transfer" || accounts.length >= 2,
  );
  const categories = type === "income" ? incomeCategories : expenseCategories;
  const hasAccounts = accounts.length > 0;
  const account = accounts.find((a) => a.id === accountId) ?? accounts[0];
  const toAccount = accounts.find((a) => a.id === toAccountId) ?? accounts[1];
  const category = categories.find((c) => c.id === categoryId);
  const activeType = TRANSACTION_TYPES.find((t) => t.value === type)!;
  const heroIcon =
    type === "transfer" ? activeType.icon : (category?.icon ?? activeType.icon);
  const heroColor =
    type === "transfer" ? activeType.color : (category?.color ?? activeType.color);

  function resetForm() {
    setType(transaction?.type ?? "expense");
    setAccountId(transaction?.accountId ?? accounts[0]?.id ?? "");
    setToAccountId(
      transaction?.toAccountId ??
        accounts.find((a) => a.id !== accounts[0]?.id)?.id ??
        "",
    );
    setCategoryId(initialCategoryId(transaction?.type ?? "expense"));
    setAmount(transaction ? String(transaction.amount) : "");
    setDate(transaction?.transactionDateIso ?? todayIsoDate());
    setNote(transaction?.note ?? "");
    setOpenPicker(null);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  if (state !== handledState) {
    setHandledState(state);
    if (state.success) {
      resetForm();
    }
  }
  if (deleteState !== handledDeleteState) {
    setHandledDeleteState(deleteState);
    if (deleteState.success) {
      resetForm();
    }
  }

  function selectType(next: TransactionType) {
    setType(next);
    setOpenPicker(null);
    setCategoryId(initialCategoryId(next));
  }

  function togglePicker(name: PickerName) {
    setOpenPicker((current) => (current === name ? null : name));
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <button
        aria-label="Đóng"
        className="absolute inset-0 bg-black/40"
        onClick={handleClose}
        type="button"
      ></button>
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
          <h3 className="text-lg font-bold text-on-surface">
            {isEditing ? "Sửa giao dịch" : "Thêm giao dịch"}
          </h3>
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest/40 transition-colors"
            onClick={handleClose}
            type="button"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {!hasAccounts ? (
          <div className="p-6 space-y-4 text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Bạn cần tạo tài khoản trước khi thêm giao dịch.
            </p>
            <Link
              className="inline-block py-3 px-6 rounded-xl bg-primary text-white font-label-md text-label-md hover:opacity-90 transition-all"
              href="/accounts"
            >
              Đi tới trang Tài khoản
            </Link>
          </div>
        ) : (
          <form action={formAction} className="p-6 space-y-5">
            {isEditing && (
              <input name="id" type="hidden" value={transaction!.id} />
            )}
            <input name="type" type="hidden" value={type} />
            <input name="accountId" type="hidden" value={account?.id ?? ""} />
            {type === "transfer" && (
              <input
                name="toAccountId"
                type="hidden"
                value={toAccount?.id ?? ""}
              />
            )}
            {type !== "transfer" && category && (
              <input name="categoryId" type="hidden" value={category.id} />
            )}
            {state.message && (
              <p
                aria-live="polite"
                className="font-label-md text-label-md text-error text-center"
              >
                {state.message}
              </p>
            )}

            {/* Amount hero */}
            <div
              className="flex flex-col items-center gap-3 py-6 rounded-2xl transition-colors"
              style={{ backgroundColor: `${heroColor}14` }}
            >
              <IconBadge
                color={heroColor}
                icon={heroIcon}
                iconSize="text-3xl"
                size="w-16 h-16"
              />
              <div className="flex items-baseline gap-2">
                <input
                  className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none text-3xl font-bold text-center bg-transparent outline-none w-40 text-on-surface placeholder:text-outline-variant"
                  inputMode="decimal"
                  name="amount"
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  type="number"
                  value={amount}
                />
                <span className="text-lg font-bold text-on-surface-variant">
                  đ
                </span>
              </div>
              {state.errors?.amount && (
                <p className="font-label-sm text-label-sm text-error">
                  {state.errors.amount[0]}
                </p>
              )}
            </div>

            {/* Type segmented pills */}
            <div className="grid grid-cols-3 gap-2">
              {availableTypes.map((option) => {
                const active = type === option.value;
                return (
                  <button
                    className="flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all"
                    key={option.value}
                    onClick={() => selectType(option.value)}
                    style={
                      active
                        ? {
                            borderColor: option.color,
                            color: option.color,
                            backgroundColor: `${option.color}14`,
                          }
                        : { borderColor: "transparent" }
                    }
                    type="button"
                  >
                    <span
                      className={`material-symbols-outlined ${
                        active ? "" : "text-on-surface-variant"
                      }`}
                    >
                      {option.icon}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        active ? "" : "text-on-surface-variant"
                      }`}
                    >
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Account / Category selector chips */}
            <div className="grid grid-cols-2 gap-3">
              <SelectorChip
                active={openPicker === "account"}
                color={account?.color ?? "#94a3b8"}
                icon={account?.icon ?? "account_balance_wallet"}
                label={type === "transfer" ? "Từ tài khoản" : "Tài khoản"}
                onClick={() => togglePicker("account")}
                value={account?.name ?? ""}
              />
              {type === "transfer" ? (
                <SelectorChip
                  active={openPicker === "toAccount"}
                  color={toAccount?.color ?? "#94a3b8"}
                  icon={toAccount?.icon ?? "account_balance_wallet"}
                  label="Đến tài khoản"
                  onClick={() => togglePicker("toAccount")}
                  value={toAccount?.name ?? ""}
                />
              ) : (
                categories.length > 0 && (
                  <SelectorChip
                    active={openPicker === "category"}
                    color={category?.color ?? "#94a3b8"}
                    icon={category?.icon ?? "category"}
                    label="Danh mục"
                    onClick={() => togglePicker("category")}
                    value={category?.name ?? ""}
                  />
                )
              )}
            </div>
            {state.errors?.toAccountId && (
              <p className="font-label-sm text-label-sm text-error -mt-3">
                {state.errors.toAccountId[0]}
              </p>
            )}

            {/* Inline pickers */}
            {openPicker === "account" && (
              <div className="grid grid-cols-4 gap-3 p-3 bg-surface-container-low rounded-xl">
                {accounts.map((option) => (
                  <button
                    className="flex flex-col items-center gap-1.5"
                    key={option.id}
                    onClick={() => {
                      setAccountId(option.id);
                      setOpenPicker(null);
                    }}
                    type="button"
                  >
                    <IconBadge color={option.color} icon={option.icon} />
                    <span className="text-xs text-on-surface-variant text-center">
                      {option.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
            {openPicker === "toAccount" && (
              <div className="grid grid-cols-4 gap-3 p-3 bg-surface-container-low rounded-xl">
                {accounts.map((option) => (
                  <button
                    className="flex flex-col items-center gap-1.5"
                    key={option.id}
                    onClick={() => {
                      setToAccountId(option.id);
                      setOpenPicker(null);
                    }}
                    type="button"
                  >
                    <IconBadge color={option.color} icon={option.icon} />
                    <span className="text-xs text-on-surface-variant text-center">
                      {option.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
            {openPicker === "category" && (
              <div className="grid grid-cols-4 gap-3 p-3 bg-surface-container-low rounded-xl max-h-56 overflow-y-auto">
                {categories.map((option) => (
                  <button
                    className="flex flex-col items-center gap-1.5"
                    key={option.id}
                    onClick={() => {
                      setCategoryId(option.id);
                      setOpenPicker(null);
                    }}
                    type="button"
                  >
                    <IconBadge color={option.color} icon={option.icon} />
                    <span className="text-xs text-on-surface-variant text-center">
                      {option.name}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Date */}
            <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-outline-variant/50">
              <span className="material-symbols-outlined text-on-surface-variant">
                calendar_month
              </span>
              <input
                className="flex-1 bg-transparent outline-none font-body-md text-body-md text-on-surface"
                name="transactionDate"
                onChange={(e) => setDate(e.target.value)}
                type="date"
                value={date}
              />
            </div>
            {state.errors?.transactionDate && (
              <p className="font-label-sm text-label-sm text-error -mt-3">
                {state.errors.transactionDate[0]}
              </p>
            )}

            {/* Note */}
            <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-outline-variant/50">
              <span className="material-symbols-outlined text-on-surface-variant">
                edit_note
              </span>
              <input
                className="flex-1 bg-transparent outline-none font-body-md text-body-md text-on-surface placeholder:text-outline"
                maxLength={255}
                name="note"
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ghi chú (không bắt buộc)"
                type="text"
                value={note}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                className="flex-1 py-3 rounded-xl border border-outline-variant text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-low transition-colors"
                onClick={handleClose}
                type="button"
              >
                Hủy
              </button>
              <SubmitButton
                disabled={!account}
                label={isEditing ? "Cập nhật giao dịch" : "Lưu giao dịch"}
              />
            </div>
          </form>
        )}

        {isEditing && (
          <form action={deleteFormAction} className="px-6 pb-6">
            <input name="id" type="hidden" value={transaction!.id} />
            {deleteState.message && (
              <p
                aria-live="polite"
                className="font-label-md text-label-md text-error text-center mb-3"
              >
                {deleteState.message}
              </p>
            )}
            <ConfirmDeleteButton
              confirmLabel="Xoá giao dịch này? Số dư tài khoản sẽ được hoàn lại."
              label="Xoá giao dịch"
            />
          </form>
        )}
      </div>
    </div>
  );
}
