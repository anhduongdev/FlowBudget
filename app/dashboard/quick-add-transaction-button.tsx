"use client";

import { useState } from "react";
import { AddTransactionModal } from "@/app/transactions/add-transaction-modal";
import type { AccountOption } from "@/lib/services/account-service";
import type { CategoryOption } from "@/lib/services/category-service";

interface QuickAddTransactionButtonProps {
  accounts: AccountOption[];
  expenseCategories: CategoryOption[];
  incomeCategories: CategoryOption[];
}

export function QuickAddTransactionButton({
  accounts,
  expenseCategories,
  incomeCategories,
}: QuickAddTransactionButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="bg-primary text-white px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-all"
        onClick={() => setOpen(true)}
        type="button"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
        Giao dịch mới
      </button>
      <AddTransactionModal
        accounts={accounts}
        expenseCategories={expenseCategories}
        incomeCategories={incomeCategories}
        onClose={() => setOpen(false)}
        open={open}
      />
    </>
  );
}
