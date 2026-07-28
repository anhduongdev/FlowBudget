"use client";

import { useMemo, useState } from "react";
import type { CategorySpendingItem } from "@/lib/services/category-service";
import { CategoryTile } from "./category-tile";

interface ExpenseCategoryGridProps {
  categories: CategorySpendingItem[];
}

const SORT_MODES = [
  { key: "default", label: "Mặc định" },
  { key: "name", label: "Tên A-Z" },
  { key: "amount", label: "Chi tiêu nhiều nhất" },
] as const;

type SortKey = (typeof SORT_MODES)[number]["key"];

function sortCategories(
  categories: CategorySpendingItem[],
  sortKey: SortKey,
): CategorySpendingItem[] {
  if (sortKey === "name") {
    return [...categories].sort((a, b) => a.name.localeCompare(b.name, "vi"));
  }
  if (sortKey === "amount") {
    return [...categories].sort((a, b) => b.totalAmount - a.totalAmount);
  }
  return categories;
}

export function ExpenseCategoryGrid({ categories }: ExpenseCategoryGridProps) {
  const [sortIndex, setSortIndex] = useState(0);
  const sortMode = SORT_MODES[sortIndex];
  const sortedCategories = useMemo(
    () => sortCategories(categories, sortMode.key),
    [categories, sortMode.key],
  );

  return (
    <>
      <div className="flex justify-between items-center mb-lg">
        <div>
          <h4 className="font-headline-md text-headline-md text-on-surface">
            Danh mục Chi tiêu
          </h4>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Phân bổ nguồn vốn vào các mục đích thiết yếu
          </p>
        </div>
        <button
          className="flex items-center gap-2 text-primary font-label-md text-label-md hover:underline"
          onClick={() => setSortIndex((index) => (index + 1) % SORT_MODES.length)}
          type="button"
        >
          Sắp xếp: {sortMode.label}
          <span className="material-symbols-outlined text-sm">swap_vert</span>
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-y-10 gap-x-gutter">
        {sortedCategories.length === 0 ? (
          <p className="col-span-full font-body-md text-body-md text-on-surface-variant">
            Chưa có danh mục chi tiêu nào.
          </p>
        ) : (
          sortedCategories.map((category) => (
            <CategoryTile category={category} key={category.id} />
          ))
        )}
      </div>
    </>
  );
}
