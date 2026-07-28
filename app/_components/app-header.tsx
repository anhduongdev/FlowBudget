import Link from "next/link";
import type { ReactNode } from "react";

export interface PeriodLink {
  label: string;
  href: string;
  active: boolean;
}

interface AppHeaderProps {
  title: string;
  primaryAction?: ReactNode;
  periodLinks?: PeriodLink[];
}

export function AppHeader({ title, primaryAction, periodLinks }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex justify-between items-center w-full h-16 px-8 bg-white/80 backdrop-blur-md border-b border-slate-200/30">
      <h1 className="text-xl font-bold text-on-surface">{title}</h1>
      <div className="flex items-center gap-6">
        {periodLinks && (
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            {periodLinks.map((period) => (
              <Link
                className={
                  period.active
                    ? "px-4 py-1 text-xs font-semibold text-primary bg-white shadow-sm rounded-md"
                    : "px-4 py-1 text-xs font-semibold text-slate-500 hover:text-on-surface transition-colors"
                }
                href={period.href}
                key={period.label}
              >
                {period.label}
              </Link>
            ))}
          </div>
        )}
        {primaryAction}
      </div>
    </header>
  );
}
