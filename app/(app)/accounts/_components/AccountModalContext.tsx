"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { AccountDto } from "@/lib/services/account-service";
import { AccountModal } from "@/app/(app)/accounts/_components/AccountModal";

type ModalState = { mode: "create" } | { mode: "edit"; account: AccountDto } | null;

const AccountModalContext = createContext<{
  openCreate: () => void;
  openEdit: (account: AccountDto) => void;
} | null>(null);

export function useAccountModal() {
  const ctx = useContext(AccountModalContext);
  if (!ctx) throw new Error("useAccountModal phải nằm trong AccountModalProvider");
  return ctx;
}

export function AccountModalProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ModalState>(null);

  const value = useMemo(
    () => ({
      openCreate: () => setState({ mode: "create" }),
      openEdit: (account: AccountDto) => setState({ mode: "edit", account }),
    }),
    [],
  );

  return (
    <AccountModalContext.Provider value={value}>
      {children}
      {state && <AccountModal state={state} onClose={() => setState(null)} />}
    </AccountModalContext.Provider>
  );
}
