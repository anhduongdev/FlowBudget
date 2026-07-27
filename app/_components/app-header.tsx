import type { ReactNode } from "react";

const PERIOD_OPTIONS = ["Ngày", "Tuần", "Tháng", "Năm"] as const;

interface AppHeaderProps {
  title: string;
  primaryAction?: ReactNode;
}

export function AppHeader({ title, primaryAction }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex justify-between items-center w-full h-16 px-8 bg-white/80 backdrop-blur-md border-b border-slate-200/30">
      <h1 className="text-xl font-bold text-on-surface">{title}</h1>
      <div className="flex items-center gap-6">
        <div className="flex items-center bg-slate-100 rounded-lg p-1">
          {PERIOD_OPTIONS.map((option, index) => (
            <button
              className={
                index === 0
                  ? "px-4 py-1 text-xs font-semibold text-primary bg-white shadow-sm rounded-md"
                  : "px-4 py-1 text-xs font-semibold text-slate-500"
              }
              key={option}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-all"
            type="button"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          {primaryAction}
        </div>
      </div>
    </header>
  );
}
