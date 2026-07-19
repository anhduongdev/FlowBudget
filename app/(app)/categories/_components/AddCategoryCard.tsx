"use client";

import { useCategoryModal } from "@/app/(app)/categories/_components/CategoryModalContext";

export function AddCategoryCard({ defaultType }: { defaultType: "expense" | "income" }) {
  const { openCreate } = useCategoryModal();

  return (
    <button
      className="group flex min-h-[220px] flex-col items-center justify-center gap-md rounded-xl border-2 border-dashed border-outline-variant p-md transition-all hover:border-primary hover:bg-primary/5"
      onClick={() => openCreate(defaultType)}
      type="button"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant transition-all group-hover:bg-primary group-hover:text-on-primary">
        <span className="material-symbols-outlined text-[32px]">add</span>
      </div>
      <span className="font-bold text-body-md text-on-surface-variant transition-colors group-hover:text-primary">Thêm danh mục</span>
    </button>
  );
}
