"use client";

import { formatVnd } from "@/lib/format";
import { deleteCategoryAction } from "@/lib/actions/category-actions";
import { useCategoryModal } from "@/app/(app)/categories/_components/CategoryModalContext";
import { DeleteConfirmButton } from "@/app/(app)/_components/DeleteConfirmButton";
import type { CategoryWithSpending } from "@/lib/services/category-service";

export function CategoryCard({ category }: { category: CategoryWithSpending }) {
  const { openEdit } = useCategoryModal();
  const color = category.color ?? "#c4c0ff";

  return (
    <div className="group flex flex-col gap-md rounded-xl border border-outline-variant bg-surface-container p-md transition-all hover:border-primary">
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: `${color}33`, color }}>
          <span className="material-symbols-outlined text-[28px]">{category.icon ?? "category"}</span>
        </div>
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button className="rounded p-1 text-on-surface-variant hover:bg-surface-container-high" onClick={() => openEdit(category)} type="button">
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>
          <DeleteConfirmButton
            action={() => deleteCategoryAction(category.id)}
            className="rounded p-1 text-error hover:bg-error-container/20"
            confirmMessage={`Xoá danh mục "${category.name}"?`}
          >
            <span className="material-symbols-outlined text-sm">delete</span>
          </DeleteConfirmButton>
        </div>
      </div>

      <div>
        <h4 className="text-body-lg font-bold text-on-surface">{category.name}</h4>
        <div className="mt-md flex items-end justify-between">
          <div>
            <p className="font-label-sm uppercase text-on-surface-variant">Tổng trong kỳ</p>
            <p className="font-numeric-lg text-headline-md">{formatVnd(category.amount)}</p>
          </div>
          <span className="rounded px-2 py-1 font-label-sm font-bold" style={{ backgroundColor: `${color}1a`, color }}>
            {category.pct}%
          </span>
        </div>
      </div>

      <div className="h-1 w-full overflow-hidden rounded-full bg-surface-container-low">
        <div className="h-full" style={{ width: `${category.pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
