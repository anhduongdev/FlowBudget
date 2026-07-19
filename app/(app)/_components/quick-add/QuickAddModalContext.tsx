"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { AccountDto } from "@/lib/services/account-service";
import type { CategoryDto } from "@/lib/services/category-service";
import { QuickAddModal } from "@/app/(app)/_components/quick-add/QuickAddModal";

const QuickAddModalContext = createContext<{ open: () => void } | null>(null);

export function useQuickAddModal() {
  const ctx = useContext(QuickAddModalContext);
  if (!ctx) throw new Error("useQuickAddModal phải nằm trong QuickAddModalProvider");
  return ctx;
}

type Props = {
  accounts: AccountDto[];
  categories: CategoryDto[];
  children: React.ReactNode;
};

export function QuickAddModalProvider({ accounts, categories, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const value = useMemo(() => ({ open: () => setIsOpen(true) }), []);

  return (
    <QuickAddModalContext.Provider value={value}>
      {children}
      {isOpen && <QuickAddModal accounts={accounts} categories={categories} onClose={() => setIsOpen(false)} />}
    </QuickAddModalContext.Provider>
  );
}
