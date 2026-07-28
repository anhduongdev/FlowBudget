"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  DayGroup,
  type TransactionDayGroupView,
} from "@/app/_components/transaction-day-group";
import { formatVnd } from "@/lib/format";
import type { AccountOption } from "@/lib/services/account-service";
import { AppHeader } from "../_components/app-header";
import { Sidebar } from "../_components/sidebar";
import { AddAccountButton } from "./add-account-button";

interface AccountsContentProps {
  userName: string;
  accounts: AccountOption[];
  recentGroups: TransactionDayGroupView[];
  totalTransactionCount: number;
}

function AccountCard({
  account,
  isPrimary,
}: {
  account: AccountOption;
  isPrimary: boolean;
}) {
  return (
    <div
      className={`group relative flex items-center p-6 bg-white rounded-[24px] transition-all duration-300 cursor-pointer ${
        isPrimary
          ? "border-2 border-primary/20 hover:shadow-xl ring-offset-2 hover:ring-2 ring-primary/10"
          : "border border-outline-variant/30 hover:shadow-lg"
      }`}
    >
      <div className="relative">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white"
          style={{ backgroundColor: account.color }}
        >
          <span
            className="material-symbols-outlined text-3xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {account.icon}
          </span>
        </div>
        {isPrimary && (
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
            <span
              className="material-symbols-outlined text-[14px] text-white"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
          </div>
        )}
      </div>
      <div className="ml-6 flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-label-md text-label-md text-on-surface-variant mb-0.5">
              {account.name}
            </h3>
            <span
              className={`font-headline-md text-headline-md font-bold ${
                isPrimary ? "text-primary" : "text-on-surface"
              }`}
            >
              {formatVnd(account.currentBalance)}
            </span>
          </div>
          {isPrimary && (
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Chính
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function AccountsContent({
  userName,
  accounts,
  recentGroups,
  totalTransactionCount,
}: AccountsContentProps) {
  useEffect(() => {
    const groups = document.querySelectorAll<HTMLElement>(".group");
    const onMouseEnter = (e: Event) => {
      (e.currentTarget as HTMLElement).style.transition =
        "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    };
    groups.forEach((card) => {
      card.addEventListener("mouseenter", onMouseEnter);
    });

    const searchInput = document.querySelector<HTMLInputElement>(
      'input[type="text"]',
    );
    const searchContainer = searchInput?.parentElement;
    const onFocus = () => {
      searchContainer?.classList.add("ring-2", "ring-primary/20", "bg-white");
    };
    const onBlur = () => {
      searchContainer?.classList.remove(
        "ring-2",
        "ring-primary/20",
        "bg-white",
      );
    };
    if (searchInput && searchContainer) {
      searchInput.addEventListener("focus", onFocus);
      searchInput.addEventListener("blur", onBlur);
    }

    return () => {
      groups.forEach((card) => {
        card.removeEventListener("mouseenter", onMouseEnter);
      });
      if (searchInput && searchContainer) {
        searchInput.removeEventListener("focus", onFocus);
        searchInput.removeEventListener("blur", onBlur);
      }
    };
  }, []);

  return (
    <>
      <Sidebar userName={userName} />
      {/* Main Content Canvas */}
      <main className="ml-72 min-h-screen">
        <AppHeader title="Tài khoản" />
        <div className="p-10">
        {/* Account Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-xxl">
          {accounts.length === 0 && (
            <p className="font-body-md text-body-md text-on-surface-variant self-center">
              Bạn chưa có tài khoản nào. Hãy thêm tài khoản đầu tiên.
            </p>
          )}
          {accounts.map((account, index) => (
            <AccountCard
              account={account}
              isPrimary={index === 0}
              key={account.id}
            />
          ))}
          <AddAccountButton />
        </section>
        {/* Recent transactions */}
        <section className="space-y-6">
          <div className="flex justify-between items-end mb-4">
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Giao dịch gần đây
            </h2>
            <button className="flex items-center gap-2 text-primary font-label-md text-label-md hover:underline decoration-2 underline-offset-4 transition-all">
              Xem báo cáo{" "}
              <span className="material-symbols-outlined">
                arrow_forward
              </span>
            </button>
          </div>
          {recentGroups.length === 0 ? (
            <p className="text-center text-on-surface-variant py-xl">
              Chưa có giao dịch nào.
            </p>
          ) : (
            <div className="space-y-6">
              {recentGroups.map((group) => (
                <DayGroup group={group} key={group.dateIso} />
              ))}
            </div>
          )}
          {totalTransactionCount > 0 && (
            <div className="flex justify-center mt-8">
              <Link
                className="bg-surface-container-high hover:bg-primary hover:text-white transition-all text-on-surface px-8 py-3 rounded-full font-label-md"
                href="/transactions"
              >
                Xem tất cả {totalTransactionCount} giao dịch
              </Link>
            </div>
          )}
        </section>
        </div>
      </main>
      {/* Floating Action Button for Mobile */}
      <button className="md:hidden fixed bottom-8 right-8 w-16 h-16 rounded-full bg-primary text-on-primary shadow-2xl flex items-center justify-center z-[100] active:scale-95 transition-transform">
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </>
  );
}
