import { formatVnd } from "@/lib/format";
import type { CategorySlice } from "@/lib/services/transaction-service";

export function TopCategoriesList({ categories }: { categories: CategorySlice[] }) {
  const max = Math.max(1, ...categories.map((c) => Number(c.amount)));

  return (
    <div className="rounded-2xl border border-outline-variant bg-surface-container p-md">
      <h3 className="mb-md font-bold text-body-lg">Danh mục hàng đầu</h3>
      {categories.length === 0 ? (
        <p className="py-lg text-center font-label-md text-on-surface-variant">Chưa có chi tiêu nào trong kỳ này.</p>
      ) : (
        <div className="space-y-md">
          {categories.map((c) => (
            <div key={c.id} className="space-y-xs">
              <div className="flex items-center justify-between font-label-md">
                <span className="text-on-surface">{c.name}</span>
                <span className="text-on-surface-variant">{formatVnd(c.amount)}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-highest">
                <div
                  className="h-full"
                  style={{ width: `${(Number(c.amount) / max) * 100}%`, backgroundColor: c.color ?? "#c4c0ff" }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
