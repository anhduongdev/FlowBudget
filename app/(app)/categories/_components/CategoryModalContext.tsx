"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { CategoryDto } from "@/lib/services/category-service";
import { CategoryModal } from "@/app/(app)/categories/_components/CategoryModal";

type ModalState = { mode: "create"; defaultType: "expense" | "income" } | { mode: "edit"; category: CategoryDto } | null;

const CategoryModalContext = createContext<{
  openCreate: (defaultType: "expense" | "income") => void;
  openEdit: (category: CategoryDto) => void;
} | null>(null);

export function useCategoryModal() {
  const ctx = useContext(CategoryModalContext);
  if (!ctx) throw new Error("useCategoryModal phải nằm trong CategoryModalProvider");
  return ctx;
}

export function CategoryModalProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ModalState>(null);

  const value = useMemo(
    () => ({
      openCreate: (defaultType: "expense" | "income") => setState({ mode: "create", defaultType }),
      openEdit: (category: CategoryDto) => setState({ mode: "edit", category }),
    }),
    [],
  );

  return (
    <CategoryModalContext.Provider value={value}>
      {children}
      {state && <CategoryModal onClose={() => setState(null)} state={state} />}
    </CategoryModalContext.Provider>
  );
}
