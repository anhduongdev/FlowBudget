import { formatVnd } from "@/lib/format";
import type { CategoryWithSpending } from "@/lib/services/category-service";

export function CategorySummaryHeader({
  total,
  topCategory,
  type,
}: {
  total: string;
  topCategory: CategoryWithSpending | null;
  type: "expense" | "income";
}) {
  return (
    <div className="grid grid-cols-1 gap-lg lg:grid-cols-12">
      <div className="glass-card relative flex items-center justify-between overflow-hidden rounded-xl p-lg lg:col-span-8">
        <div>
          <p className="mb-1 font-label-md uppercase tracking-widest text-on-surface-variant">
            {type === "expense" ? "Chi tiêu hàng tháng" : "Thu nhập hàng tháng"}
          </p>
          <h3 className={`text-display-lg ${type === "expense" ? "text-error" : "text-secondary"}`}>{formatVnd(total)}</h3>
        </div>
      </div>

      <div className="flex flex-col justify-center rounded-xl border border-outline-variant bg-surface-container-highest p-lg lg:col-span-4">
        <p className="mb-1 font-label-md text-on-surface-variant">{type === "expense" ? "Chi tiêu nhiều nhất" : "Thu nhập nhiều nhất"}</p>
        {topCategory ? (
          <div className="flex items-center gap-md">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{ backgroundColor: `${topCategory.color ?? "#c4c0ff"}33`, color: topCategory.color ?? "#c4c0ff" }}
            >
              <span className="material-symbols-outlined">{topCategory.icon ?? "category"}</span>
            </div>
            <div>
              <p className="font-bold text-body-lg">{topCategory.name}</p>
              <p className="font-label-md text-on-surface-variant">{formatVnd(topCategory.amount)} trong tháng này</p>
            </div>
          </div>
        ) : (
          <p className="font-label-md text-on-surface-variant">Chưa có dữ liệu</p>
        )}
      </div>
    </div>
  );
}
