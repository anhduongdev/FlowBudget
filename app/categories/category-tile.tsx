"use client";

import { useState } from "react";
import { formatVnd } from "@/lib/format";
import type { CategorySpendingItem } from "@/lib/services/category-service";
import { CategoryFormModal } from "./category-form-modal";

interface CategoryTileProps {
  category: CategorySpendingItem;
}

export function CategoryTile({ category }: CategoryTileProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="flex flex-col items-center text-center group cursor-pointer"
        onClick={() => setOpen(true)}
        type="button"
      >
        <p className="font-label-md text-label-md text-on-surface mb-1">
          {category.name}
        </p>
        <p className="font-label-sm text-label-sm text-on-surface-variant/60 mb-3">
          {category.transactionCount} giao dịch
        </p>
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg"
          style={{ backgroundColor: category.color }}
        >
          <span className="material-symbols-outlined text-3xl text-white">
            {category.icon}
          </span>
        </div>
        <p
          className="font-label-md text-label-md"
          style={{ color: category.color }}
        >
          {formatVnd(category.totalAmount)}
        </p>
      </button>
      <CategoryFormModal
        category={category}
        onClose={() => setOpen(false)}
        open={open}
      />
    </>
  );
}
