import { formatVnd } from "@/lib/format";
import type { CategorySlice } from "@/lib/services/transaction-service";

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type DonutSegment = CategorySlice & { dasharray: string; dashoffset: number };

export function CategoryDonutChart({ slices, totalExpense }: { slices: CategorySlice[]; totalExpense: number }) {
  const segments = slices.reduce<{ list: DonutSegment[]; cumulative: number }>(
    (acc, slice) => {
      const fraction = totalExpense > 0 ? Number(slice.amount) / totalExpense : 0;
      const dasharray = `${fraction * CIRCUMFERENCE} ${CIRCUMFERENCE}`;
      const dashoffset = -acc.cumulative * CIRCUMFERENCE;
      return { list: [...acc.list, { ...slice, dasharray, dashoffset }], cumulative: acc.cumulative + fraction };
    },
    { list: [], cumulative: 0 },
  ).list;

  return (
    <div className="rounded-2xl border border-outline-variant bg-surface-container p-md lg:col-span-1">
      <h3 className="mb-md font-bold text-body-lg">Chi tiêu theo danh mục</h3>
      {slices.length === 0 ? (
        <p className="py-xl text-center font-label-md text-on-surface-variant">Chưa có chi tiêu nào trong kỳ này.</p>
      ) : (
        <>
          <div className="relative mx-auto flex aspect-square w-full max-w-[240px] items-center justify-center">
            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="transparent" r={RADIUS} stroke="#33343c" strokeWidth="12" />
              {segments.map((seg) => (
                <circle
                  key={seg.id}
                  className="donut-segment"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r={RADIUS}
                  stroke={seg.color ?? "#c4c0ff"}
                  strokeDasharray={seg.dasharray}
                  strokeDashoffset={seg.dashoffset}
                  strokeWidth="12"
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-label-sm text-on-surface-variant">Tổng cộng</span>
              <span className="font-bold text-body-lg">{formatVnd(totalExpense)}</span>
            </div>
          </div>
          <div className="mt-md space-y-2">
            {segments.map((seg) => (
              <div key={seg.id} className="flex items-center justify-between">
                <div className="flex items-center gap-xs">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: seg.color ?? "#c4c0ff" }} />
                  <span className="font-label-md text-on-surface-variant">{seg.name}</span>
                </div>
                <span className="font-bold font-label-md">{seg.pct}%</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
