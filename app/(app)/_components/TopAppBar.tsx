"use client";

import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/actions/auth-actions";
import { NAV_ITEMS } from "@/app/(app)/_components/nav-items";
import { UserAvatar } from "@/app/(app)/_components/UserAvatar";

export function TopAppBar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const title = NAV_ITEMS.find((item) => item.href === pathname)?.label ?? "MyFlowBudget";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface/80 px-gutter backdrop-blur-md md:ml-sidebar-width md:w-[calc(100%-var(--spacing-sidebar-width))]">
      <div className="flex items-center gap-md">
        <h2 className="text-headline-md font-bold text-primary">{title}</h2>
        <div className="hidden items-center gap-2 rounded-full border border-outline-variant bg-surface-container px-sm py-1.5 sm:flex">
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant">search</span>
          <input
            className="w-48 border-none bg-transparent font-label-md text-on-surface focus:ring-0 lg:w-64"
            placeholder="Tìm kiếm giao dịch..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-md">
        <button className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-all hover:bg-surface-container">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <div className="hidden text-right sm:block">
          <p className="font-label-md text-on-surface">{userName}</p>
        </div>
        <UserAvatar name={userName} />
        <form action={logoutAction}>
          <button className="text-on-surface-variant transition-colors hover:text-error" title="Đăng xuất" type="submit">
            <span className="material-symbols-outlined">logout</span>
          </button>
        </form>
      </div>
    </header>
  );
}
