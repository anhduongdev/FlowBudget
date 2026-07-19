"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { formatVnd } from "@/lib/format";
import { NAV_ITEMS } from "@/app/(app)/_components/nav-items";
import { AddTransactionButton } from "@/app/(app)/_components/quick-add/AddTransactionButton";

export function Sidebar({ totalAssets }: { totalAssets: string }) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-sidebar-width flex-col gap-md border-r border-outline-variant bg-surface-container p-gutter md:flex">
      <div className="mb-lg flex items-center gap-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <span className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            account_balance_wallet
          </span>
        </div>
        <div>
          <h1 className="text-headline-md font-bold text-on-surface">MyFlowBudget</h1>
          <p className="font-body-md text-on-surface-variant opacity-70">Quản lý tài chính cao cấp</p>
        </div>
      </div>

      <div className="mb-md rounded-xl border border-outline-variant bg-surface-container-low p-md">
        <p className="mb-1 font-label-sm uppercase tracking-wider text-on-surface-variant">Tổng tài sản</p>
        <p className="text-numeric-lg text-primary">{formatVnd(totalAssets)}</p>
      </div>

      <nav className="custom-scrollbar flex-1 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              className={
                active
                  ? "flex items-center gap-sm rounded-lg bg-primary-container p-sm font-label-md font-bold text-on-primary-container transition-transform active:scale-95"
                  : "flex items-center gap-sm rounded-lg p-sm font-label-md text-on-surface-variant transition-colors duration-200 hover:bg-surface-container-high hover:text-on-surface"
              }
              href={item.href}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <AddTransactionButton className="mb-md flex w-full items-center justify-center gap-xs rounded-xl bg-primary py-sm font-bold text-on-primary transition-all hover:opacity-90 active:scale-95">
        <span className="material-symbols-outlined">add</span>
        <span className="font-label-md">Thêm giao dịch</span>
      </AddTransactionButton>

      <div className="flex flex-col gap-xs border-t border-outline-variant pt-md">
        <a className="flex items-center gap-sm rounded-lg p-sm font-label-md text-on-surface-variant transition-colors hover:text-on-surface" href="#">
          <span className="material-symbols-outlined">settings</span>
          <span>Cài đặt</span>
        </a>
      </div>
    </aside>
  );
}
