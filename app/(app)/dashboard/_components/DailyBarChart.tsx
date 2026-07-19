import type { DailyPoint } from "@/lib/services/transaction-service";

export function DailyBarChart({ series }: { series: DailyPoint[] }) {
  const now = new Date();
  const todayIso = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString().slice(0, 10);
  const max = Math.max(1, ...series.flatMap((d) => [d.income, d.expense]));

  return (
    <div className="rounded-2xl border border-outline-variant bg-surface-container p-md lg:col-span-2">
      <div className="mb-md flex items-center justify-between">
        <h3 className="font-bold text-body-lg">Thu nhập và Chi tiêu hàng ngày</h3>
        <div className="flex items-center gap-md">
          <div className="flex items-center gap-xs">
            <span className="h-2 w-2 rounded-full bg-secondary" />
            <span className="font-label-sm text-on-surface-variant">Thu</span>
          </div>
          <div className="flex items-center gap-xs">
            <span className="h-2 w-2 rounded-full bg-error" />
            <span className="font-label-sm text-on-surface-variant">Chi</span>
          </div>
        </div>
      </div>
      <div className="flex h-64 items-end justify-between gap-xs px-2">
        {series.map((day) => {
          const isToday = day.date === todayIso;
          return (
            <div key={day.date} className="group flex flex-1 flex-col items-center gap-1">
              <div className="flex h-full w-full items-end justify-center gap-px">
                <div
                  className="chart-bar w-1/3 rounded-t-sm bg-secondary/40 group-hover:bg-secondary/80"
                  style={{ height: `${(day.income / max) * 100}%` }}
                />
                <div
                  className="chart-bar w-1/3 rounded-t-sm bg-error/40 group-hover:bg-error/80"
                  style={{ height: `${(day.expense / max) * 100}%` }}
                />
              </div>
              <span className={`text-[10px] ${isToday ? "font-bold text-primary" : "text-on-surface-variant"}`}>{day.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
