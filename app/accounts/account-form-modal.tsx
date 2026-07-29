"use client";

import { useActionState, useEffect, useState } from "react";
import { createPortal, useFormStatus } from "react-dom";
import { ConfirmDeleteButton } from "@/app/_components/confirm-delete-button";
import { ACCOUNT_ICONS, ACCOUNT_TYPE_OPTIONS } from "@/lib/account-options";
import {
  createAccountAction,
  deleteAccountAction,
  updateAccountAction,
  type AccountFormState,
} from "@/lib/actions/account-actions";
import { CATEGORY_COLORS } from "@/lib/category-options";

type AccountType = (typeof ACCOUNT_TYPE_OPTIONS)[number]["value"];

export interface EditableAccount {
  id: string;
  name: string;
  type: AccountType;
  icon: string;
  color: string;
}

interface AccountFormModalProps {
  open: boolean;
  onClose: () => void;
  account?: EditableAccount | null;
}

const initialState: AccountFormState = {};

function SubmitButton({ label }: { label: string }) {
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
        label
      )}
    </button>
  );
}

export function AccountFormModal({
  open,
  onClose,
  account,
}: AccountFormModalProps) {
  const isEditing = Boolean(account);
  const [type, setType] = useState<AccountType>(
    account?.type ?? ACCOUNT_TYPE_OPTIONS[0].value,
  );
  const [name, setName] = useState(account?.name ?? "");
  const [initialBalance, setInitialBalance] = useState("");
  const [icon, setIcon] = useState<string>(account?.icon ?? ACCOUNT_ICONS[0]);
  const [color, setColor] = useState<string>(
    account?.color ?? CATEGORY_COLORS[0],
  );
  const [state, formAction] = useActionState(
    isEditing ? updateAccountAction : createAccountAction,
    initialState,
  );
  const [handledState, setHandledState] = useState(state);
  const [deleteState, deleteFormAction] = useActionState(
    deleteAccountAction,
    initialState,
  );
  const [handledDeleteState, setHandledDeleteState] = useState(deleteState);

  function resetForm() {
    setType(account?.type ?? ACCOUNT_TYPE_OPTIONS[0].value);
    setName(account?.name ?? "");
    setInitialBalance("");
    setIcon(account?.icon ?? ACCOUNT_ICONS[0]);
    setColor(account?.color ?? CATEGORY_COLORS[0]);
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

  useEffect(() => {
    if (state.success || deleteState.success) {
      onClose();
    }
    // Intentionally react only to state/deleteState transitions, not to
    // onClose identity (callers pass a fresh closure on every render).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, deleteState]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <button
        aria-label="Đóng"
        className="absolute inset-0 bg-black/40"
        onClick={handleClose}
        type="button"
      ></button>
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
          <h3 className="font-headline-md text-headline-md text-on-surface">
            {isEditing ? "Sửa tài khoản" : "Tạo tài khoản mới"}
          </h3>
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest/40 transition-colors"
            onClick={handleClose}
            type="button"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form action={formAction} className="p-6 space-y-5">
          {isEditing && <input name="id" type="hidden" value={account!.id} />}
          <input name="type" type="hidden" value={type} />
          <input name="icon" type="hidden" value={icon} />
          <input name="color" type="hidden" value={color} />
          {state.message && (
            <p
              aria-live="polite"
              className="font-label-md text-label-md text-error text-center"
            >
              {state.message}
            </p>
          )}
          {/* Preview */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
              style={{ backgroundColor: color }}
            >
              <span className="material-symbols-outlined text-3xl text-white">
                {icon}
              </span>
            </div>
            <p className="font-label-md text-label-md text-on-surface">
              {name || "Tên tài khoản"}
            </p>
          </div>

          {/* Type */}
          <div className="grid grid-cols-3 gap-2">
            {ACCOUNT_TYPE_OPTIONS.map((option) => (
              <button
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  type === option.value
                    ? "bg-primary text-white shadow-sm"
                    : "bg-surface-container-low text-on-surface-variant"
                }`}
                key={option.value}
                onClick={() => setType(option.value)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Name */}
          <div className="space-y-1">
            <label
              className="font-label-md text-label-md text-on-surface-variant"
              htmlFor="account-name"
            >
              Tên tài khoản
            </label>
            <input
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 font-body-md text-body-md outline-none focus:border-primary transition-colors"
              id="account-name"
              maxLength={100}
              name="name"
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Vietcombank"
              required
              type="text"
              value={name}
            />
            {state.errors?.name && (
              <p className="font-label-sm text-label-sm text-error">
                {state.errors.name[0]}
              </p>
            )}
          </div>

          {/* Initial balance (chỉ khi tạo mới — số dư hiện tại do giao dịch quyết định) */}
          {!isEditing && (
            <div className="space-y-1">
              <label
                className="font-label-md text-label-md text-on-surface-variant"
                htmlFor="account-initial-balance"
              >
                Số dư ban đầu (đ)
              </label>
              <input
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 font-body-md text-body-md outline-none focus:border-primary transition-colors"
                id="account-initial-balance"
                inputMode="numeric"
                min={0}
                name="initialBalance"
                onChange={(e) => setInitialBalance(e.target.value)}
                placeholder="0"
                required
                type="number"
                value={initialBalance}
              />
              {state.errors?.initialBalance && (
                <p className="font-label-sm text-label-sm text-error">
                  {state.errors.initialBalance[0]}
                </p>
              )}
            </div>
          )}

          {/* Icon picker */}
          <div className="space-y-2">
            <p className="font-label-md text-label-md text-on-surface-variant">
              Biểu tượng
            </p>
            <div className="grid grid-cols-7 gap-2 p-1">
              {ACCOUNT_ICONS.map((iconName) => (
                <button
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    icon === iconName
                      ? "bg-primary/10 ring-2 ring-primary text-primary"
                      : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                  }`}
                  key={iconName}
                  onClick={() => setIcon(iconName)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-xl">
                    {iconName}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div className="space-y-2">
            <p className="font-label-md text-label-md text-on-surface-variant">
              Màu sắc
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_COLORS.map((hex) => (
                <button
                  aria-label={hex}
                  className={`w-8 h-8 rounded-full transition-all ${
                    color === hex ? "ring-2 ring-offset-2 ring-on-surface" : ""
                  }`}
                  key={hex}
                  onClick={() => setColor(hex)}
                  style={{ backgroundColor: hex }}
                  type="button"
                ></button>
              ))}
            </div>
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
              label={isEditing ? "Cập nhật tài khoản" : "Lưu tài khoản"}
            />
          </div>
        </form>

        {isEditing && (
          <form action={deleteFormAction} className="px-6 pb-6">
            <input name="id" type="hidden" value={account!.id} />
            {deleteState.message && (
              <p
                aria-live="polite"
                className="font-label-md text-label-md text-error text-center mb-3"
              >
                {deleteState.message}
              </p>
            )}
            <ConfirmDeleteButton
              confirmLabel="Xoá tài khoản này? Lịch sử giao dịch vẫn được giữ lại."
              label="Xoá tài khoản"
            />
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
