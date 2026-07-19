"use client";

import { useState } from "react";
import { formatVnd } from "@/lib/format";
import { deleteAccountAction } from "@/lib/actions/account-actions";
import { useAccountModal } from "@/app/(app)/accounts/_components/AccountModalContext";
import { DeleteConfirmButton } from "@/app/(app)/_components/DeleteConfirmButton";
import type { AccountDto } from "@/lib/services/account-service";

const TYPE_LABELS: Record<string, string> = {
  cash: "Ví tiền mặt",
  bank: "Tài khoản ngân hàng",
  ewallet: "Ví điện tử",
  credit_card: "Thẻ tín dụng",
  savings: "Tiết kiệm",
  other: "Khác",
};

export function AccountCard({ account }: { account: AccountDto }) {
  const { openEdit } = useAccountModal();
  const [menuOpen, setMenuOpen] = useState(false);
  const color = account.color ?? "#c4c0ff";

  return (
    <div className="group relative overflow-hidden rounded-xl border border-outline-variant bg-surface-container p-md transition-all hover:-translate-y-1 hover:bg-surface-container-high">
      <div className="mb-lg flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}33`, color }}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            {account.icon ?? "payments"}
          </span>
        </div>

        <div className="relative">
          <button className="text-on-surface-variant hover:text-on-surface" onClick={() => setMenuOpen((v) => !v)} type="button">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 z-10 w-32 overflow-hidden rounded-lg border border-outline-variant bg-surface-container-high shadow-xl">
              <button
                className="block w-full px-md py-sm text-left font-label-md text-on-surface hover:bg-surface-container"
                onClick={() => {
                  setMenuOpen(false);
                  openEdit(account);
                }}
                type="button"
              >
                Sửa
              </button>
              <DeleteConfirmButton
                action={() => deleteAccountAction(account.id)}
                className="block w-full px-md py-sm text-left font-label-md text-error hover:bg-error-container/10"
                confirmMessage={`Xoá tài khoản "${account.name}"?`}
              >
                Xoá
              </DeleteConfirmButton>
            </div>
          )}
        </div>
      </div>

      <h3 className="mb-xs text-headline-md font-bold text-on-surface">{account.name}</h3>
      <p className="mb-md font-label-sm uppercase text-on-surface-variant">{TYPE_LABELS[account.type]}</p>
      <div className="flex items-baseline gap-xs">
        <span className="text-numeric-lg text-on-surface">{formatVnd(account.current_balance)}</span>
      </div>
    </div>
  );
}
