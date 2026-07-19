"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { createAccountAction, updateAccountAction } from "@/lib/actions/account-actions";
import type { AccountDto } from "@/lib/services/account-service";

const ACCOUNT_TYPE_OPTIONS = [
  { value: "cash", label: "Tiền mặt" },
  { value: "bank", label: "Tài khoản ngân hàng" },
  { value: "ewallet", label: "Ví điện tử" },
  { value: "credit_card", label: "Thẻ tín dụng" },
  { value: "savings", label: "Tiết kiệm" },
  { value: "other", label: "Khác" },
];

const ICON_OPTIONS = ["payments", "credit_card", "savings", "account_balance", "wallet", "monetization_on"];
const COLOR_OPTIONS = ["#c4c0ff", "#4ae176", "#ffb3ad", "#ffb4ab", "#8781ff"];

type Props = { state: { mode: "create" } | { mode: "edit"; account: AccountDto }; onClose: () => void };

export function AccountModal({ state, onClose }: Props) {
  const isEdit = state.mode === "edit";
  const account = isEdit ? state.account : null;
  const action = isEdit ? updateAccountAction : createAccountAction;

  const [formState, formAction] = useActionState(action, null);
  const [icon, setIcon] = useState(account?.icon ?? ICON_OPTIONS[0]);
  const [color, setColor] = useState(account?.color ?? COLOR_OPTIONS[0]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-md backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-high shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-outline-variant p-lg">
          <h3 className="text-headline-md font-bold">{isEdit ? "Sửa tài khoản" : "Thêm tài khoản mới"}</h3>
          <button className="material-symbols-outlined text-on-surface-variant hover:text-on-surface" onClick={onClose} type="button">
            close
          </button>
        </div>

        <form
          action={(formData) => {
            if (isEdit && account) formData.set("id", account.id);
            formData.set("icon", icon);
            formData.set("color", color);
            formAction(formData);
          }}
        >
          <div className="space-y-md p-lg">
            {formState?.formError && <p className="text-body-md text-error">{formState.formError}</p>}

            <div className="space-y-xs">
              <label className="font-label-md text-on-surface-variant">Tên tài khoản</label>
              <input
                className="w-full rounded-xl border border-outline-variant bg-surface-container-low p-md text-on-surface outline-none transition-all focus:border-primary"
                defaultValue={account?.name}
                name="name"
                placeholder="Ví dụ: Thẻ Visa của tôi"
                type="text"
              />
              {formState?.fieldErrors?.name && <p className="text-label-sm text-error">{formState.fieldErrors.name[0]}</p>}
            </div>

            <div className="grid grid-cols-2 gap-md">
              <div className="space-y-xs">
                <label className="font-label-md text-on-surface-variant">Loại tài khoản</label>
                <select
                  className="w-full appearance-none rounded-xl border border-outline-variant bg-surface-container-low p-md text-on-surface outline-none transition-all focus:border-primary"
                  defaultValue={account?.type ?? "cash"}
                  name="type"
                >
                  {ACCOUNT_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-xs">
                <label className="font-label-md text-on-surface-variant">Số dư ban đầu</label>
                <input
                  className="w-full rounded-xl border border-outline-variant bg-surface-container-low p-md text-on-surface outline-none transition-all focus:border-primary"
                  defaultValue={account?.initial_balance}
                  disabled={isEdit}
                  name="initial_balance"
                  placeholder="0"
                  type="number"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-md">
              <div className="space-y-xs">
                <label className="font-label-md text-on-surface-variant">Biểu tượng</label>
                <div className="flex flex-wrap gap-xs">
                  {ICON_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      className={
                        opt === icon
                          ? "flex h-11 w-11 items-center justify-center rounded-xl border-2 border-primary bg-surface-container-lowest"
                          : "flex h-11 w-11 items-center justify-center rounded-xl border border-outline-variant bg-surface-container-lowest hover:border-primary"
                      }
                      onClick={() => setIcon(opt)}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-on-surface-variant">{opt}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-xs">
                <label className="font-label-md text-on-surface-variant">Màu chủ đạo</label>
                <div className="flex flex-wrap gap-xs">
                  {COLOR_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      className={opt === color ? "h-8 w-8 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-surface-container-high" : "h-8 w-8 rounded-full"}
                      onClick={() => setColor(opt)}
                      style={{ backgroundColor: opt }}
                      type="button"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-md bg-surface-container-low p-lg">
            <button className="flex-1 rounded-xl border border-outline-variant px-md py-sm text-on-surface transition-colors hover:bg-surface-container" onClick={onClose} type="button">
              Hủy
            </button>
            <SubmitButton isEdit={isEdit} />
          </div>
        </form>
      </div>
    </div>
  );
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="flex-1 rounded-xl bg-primary px-md py-sm font-bold text-on-primary transition-all hover:opacity-90 disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      {pending ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Tạo tài khoản"}
    </button>
  );
}
