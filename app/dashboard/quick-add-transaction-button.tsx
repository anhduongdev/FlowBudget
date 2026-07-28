"use client";

import { useState } from "react";
import { TransactionModal } from "@/app/transactions/transaction-modal";
import type { AccountOption } from "@/lib/services/account-service";
import type { CategoryOption } from "@/lib/services/category-service";

interface QuickAddTransactionButtonProps {
  accounts: AccountOption[];
  expenseCategories: CategoryOption[];
  incomeCategories: CategoryOption[];
  variant?: "default" | "fab";
}

const TRIGGER_CLASS_BY_VARIANT = {
  default:
    "bg-primary text-white px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-all",
  fab: "fixed bottom-8 right-8 w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all z-50",
} as const;

export function QuickAddTransactionButton({
  accounts,
  expenseCategories,
  incomeCategories,
  variant = "default",
}: QuickAddTransactionButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className={TRIGGER_CLASS_BY_VARIANT[variant]}
        onClick={() => setOpen(true)}
        type="button"
      >
        <span
          className={
            variant === "fab"
              ? "material-symbols-outlined text-3xl"
              : "material-symbols-outlined text-[18px]"
          }
        >
          add
        </span>
        {variant === "default" && "Giao dịch mới"}
      </button>
      <TransactionModal
        accounts={accounts}
        expenseCategories={expenseCategories}
        incomeCategories={incomeCategories}
        onClose={() => setOpen(false)}
        open={open}
      />
    </>
  );
}
