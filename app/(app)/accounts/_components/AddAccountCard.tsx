"use client";

import { useAccountModal } from "@/app/(app)/accounts/_components/AccountModalContext";

export function AddAccountCard() {
  const { openCreate } = useAccountModal();

  return (
    <button
      className="group flex flex-col items-center justify-center gap-sm rounded-xl border-2 border-dashed border-outline-variant p-md transition-all hover:border-primary hover:bg-primary/5"
      onClick={openCreate}
      type="button"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container transition-colors group-hover:bg-primary/10">
        <span className="material-symbols-outlined text-on-surface-variant transition-colors group-hover:text-primary">add</span>
      </div>
      <p className="font-label-md text-on-surface-variant transition-colors group-hover:text-primary">Thêm tài khoản mới</p>
    </button>
  );
}
