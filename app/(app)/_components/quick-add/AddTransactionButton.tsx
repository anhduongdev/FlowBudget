"use client";

import { useQuickAddModal } from "@/app/(app)/_components/quick-add/QuickAddModalContext";

export function AddTransactionButton({ className, children }: { className?: string; children: React.ReactNode }) {
  const { open } = useQuickAddModal();
  return (
    <button className={className} onClick={open} type="button">
      {children}
    </button>
  );
}
