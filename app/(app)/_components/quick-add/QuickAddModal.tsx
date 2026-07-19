"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { createTransactionAction } from "@/lib/actions/transaction-actions";
import type { AccountDto } from "@/lib/services/account-service";
import type { CategoryDto } from "@/lib/services/category-service";

type TxnType = "expense" | "income" | "transfer";

const TYPE_TABS: { value: TxnType; label: string }[] = [
  { value: "expense", label: "Chi tiêu" },
  { value: "income", label: "Thu nhập" },
  { value: "transfer", label: "Chuyển khoản" },
];

function todayInputValue(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function QuickAddModal({
  accounts,
  categories,
  onClose,
}: {
  accounts: AccountDto[];
  categories: CategoryDto[];
  onClose: () => void;
}) {
  const [state, formAction] = useActionState(createTransactionAction, null);
  const [type, setType] = useState<TxnType>("expense");
  const categoriesForType = categories.filter((c) => c.type === type);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/60 p-md backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-outline-variant bg-surface-container shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-outline-variant px-lg py-md">
          <h3 className="text-headline-md font-bold text-on-surface">Thêm nhanh</h3>
          <button className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high" onClick={onClose} type="button">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form action={formAction} className="flex flex-col gap-md p-lg">
          {state?.formError && <p className="text-body-md text-error">{state.formError}</p>}

          <div className="flex rounded-xl border border-outline-variant bg-surface-container-low p-1">
            {TYPE_TABS.map((tab) => (
              <button
                key={tab.value}
                className={
                  tab.value === type
                    ? "flex-1 rounded-lg bg-error-container py-2 font-bold text-on-error-container transition-all"
                    : "flex-1 rounded-lg py-2 font-bold text-on-surface-variant transition-all hover:bg-surface-container-high"
                }
                onClick={() => setType(tab.value)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>
          <input name="type" type="hidden" value={type} />

          <div className="space-y-base">
            <label className="ml-1 font-label-sm text-on-surface-variant">Số tiền</label>
            <div className="relative">
              <input
                className="w-full rounded-xl bg-surface-container-high py-lg pl-md pr-12 text-right text-numeric-lg text-primary outline-none focus:ring-2 focus:ring-primary"
                name="amount"
                placeholder="0"
                type="text"
                inputMode="decimal"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-primary">đ</span>
            </div>
            {state?.fieldErrors?.amount && <p className="text-label-sm text-error">{state.fieldErrors.amount[0]}</p>}
          </div>

          <div className="grid grid-cols-2 gap-md">
            {type !== "transfer" && (
              <div className="space-y-base">
                <label className="ml-1 font-label-sm text-on-surface-variant">Danh mục</label>
                <select
                  className="w-full appearance-none rounded-xl bg-surface-container-high px-md py-md font-label-md focus:ring-2 focus:ring-primary"
                  name="category_id"
                >
                  {categoriesForType.length === 0 && <option value="">Chưa có danh mục</option>}
                  {categoriesForType.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {state?.fieldErrors?.category_id && <p className="text-label-sm text-error">{state.fieldErrors.category_id[0]}</p>}
              </div>
            )}

            <div className="space-y-base">
              <label className="ml-1 font-label-sm text-on-surface-variant">{type === "transfer" ? "Từ tài khoản" : "Tài khoản"}</label>
              <select className="w-full appearance-none rounded-xl bg-surface-container-high px-md py-md font-label-md focus:ring-2 focus:ring-primary" name="account_id">
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
              {state?.fieldErrors?.account_id && <p className="text-label-sm text-error">{state.fieldErrors.account_id[0]}</p>}
            </div>

            {type === "transfer" && (
              <div className="space-y-base">
                <label className="ml-1 font-label-sm text-on-surface-variant">Đến tài khoản</label>
                <select
                  className="w-full appearance-none rounded-xl bg-surface-container-high px-md py-md font-label-md focus:ring-2 focus:ring-primary"
                  name="to_account_id"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
                {state?.fieldErrors?.to_account_id && <p className="text-label-sm text-error">{state.fieldErrors.to_account_id[0]}</p>}
              </div>
            )}

            <div className="space-y-base">
              <label className="ml-1 font-label-sm text-on-surface-variant">Ngày</label>
              <input
                className="w-full rounded-xl bg-surface-container-high px-md py-md font-label-md focus:ring-2 focus:ring-primary"
                defaultValue={todayInputValue()}
                name="transaction_date"
                type="date"
              />
            </div>
          </div>

          <div className="space-y-base">
            <label className="ml-1 font-label-sm text-on-surface-variant">Ghi chú (Tùy chọn)</label>
            <textarea
              className="w-full resize-none rounded-xl bg-surface-container-high px-md py-md font-label-md focus:ring-2 focus:ring-primary"
              name="note"
              placeholder="Nội dung giao dịch?"
              rows={2}
            />
          </div>

          <div className="mt-md flex gap-md">
            <button className="flex-1 rounded-xl border border-outline py-lg font-bold text-on-surface transition-all hover:bg-surface-container-high" onClick={onClose} type="button">
              Hủy
            </button>
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="flex-1 rounded-xl bg-primary py-lg font-bold text-on-primary transition-all hover:opacity-90 disabled:opacity-60" disabled={pending} type="submit">
      {pending ? "Đang lưu..." : "Lưu giao dịch"}
    </button>
  );
}
