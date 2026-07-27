"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/actions/auth-actions";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Tổng quan", icon: "dashboard" },
  { href: "/transactions", label: "Giao dịch", icon: "payments" },
  { href: "/accounts", label: "Tài khoản", icon: "account_balance_wallet" },
  { href: "/categories", label: "Danh mục", icon: "category" },
];

const UNAVAILABLE_NAV_ITEMS: NavItem[] = [
  { href: "#", label: "Ngân sách", icon: "account_balance" },
  { href: "#", label: "Cài đặt", icon: "settings" },
];

interface SidebarProps {
  userName: string;
}

export function Sidebar({ userName }: SidebarProps) {
  const pathname = usePathname();

  return (
    <nav className="h-screen w-72 flex flex-col fixed left-0 top-0 bg-white border-r border-slate-200/50 shadow-sm py-8 px-6 z-50">
      <div className="mb-10">
        <span className="text-3xl font-black tracking-tighter text-primary">
          FlowBudget
        </span>
      </div>
      <div className="flex items-center gap-4 mb-10 p-3 rounded-[0.75rem] bg-slate-100/50">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
          {userName.charAt(0).toUpperCase()}
        </div>
        <p className="text-sm font-semibold text-on-surface truncate">
          {userName}
        </p>
      </div>
      <ul className="space-y-1 flex-grow">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-all ${
                  isActive
                    ? "text-primary font-bold bg-blue-50"
                    : "text-slate-500 hover:text-primary hover:bg-slate-50"
                }`}
                href={item.href}
              >
                <span className="material-symbols-outlined">
                  {item.icon}
                </span>
                <span className="text-sm">{item.label}</span>
              </Link>
            </li>
          );
        })}
        {UNAVAILABLE_NAV_ITEMS.map((item) => (
          <li key={item.label}>
            <a
              className="flex items-center gap-3 py-3 px-4 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-all"
              href={item.href}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-auto space-y-1 border-t border-slate-200 pt-6">
        <a
          className="flex items-center gap-3 py-3 px-4 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-all"
          href="#"
        >
          <span className="material-symbols-outlined">help_outline</span>
          <span className="text-sm">Hỗ trợ</span>
        </a>
        <form action={logoutAction}>
          <button
            className="w-full flex items-center gap-3 py-3 px-4 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all"
            type="submit"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm">Đăng xuất</span>
          </button>
        </form>
      </div>
    </nav>
  );
}
