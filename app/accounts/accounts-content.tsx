"use client";

import Link from "next/link";
import { useState } from "react";
import {
  DayGroup,
  type TransactionDayGroupView,
} from "@/app/_components/transaction-day-group";
import { formatVnd } from "@/lib/format";
import type { AccountOption } from "@/lib/services/account-service";
import type { CategoryOption } from "@/lib/services/category-service";
import { AppHeader } from "../_components/app-header";
import { Sidebar } from "../_components/sidebar";
import { QuickAddTransactionButton } from "../dashboard/quick-add-transaction-button";
import { AccountFormModal } from "./account-form-modal";
import { AddAccountButton } from "./add-account-button";

interface AccountsContentProps {
  userName: string;
  accounts: AccountOption[];
  expenseCategories: CategoryOption[];
  incomeCategories: CategoryOption[];
  recentGroups: TransactionDayGroupView[];
  totalTransactionCount: number;
}

function AccountCard({
  account,
  isPrimary,
  onEdit,
}: {
  account: AccountOption;
  isPrimary: boolean;
  onEdit: (account: AccountOption) => void;
}) {
  return (
    <div
      className={`group relative flex items-center p-6 bg-white rounded-[24px] transition-all duration-300 ${
        isPrimary
          ? "border-2 border-primary/20 hover:shadow-xl ring-offset-2 hover:ring-2 ring-primary/10"
          : "border border-outline-variant/30 hover:shadow-lg"
      }`}
    >
      <button
        aria-label={`Sửa tài khoản ${account.name}`}
        className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant opacity-0 group-hover:opacity-100 hover:bg-surface-container-low transition-all"
        onClick={() => onEdit(account)}
        type="button"
      >
        <span className="material-symbols-outlined text-lg">edit</span>
      </button>
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
  expenseCategories,
  incomeCategories,
  recentGroups,
  totalTransactionCount,
}: AccountsContentProps) {
  const [editingAccount, setEditingAccount] = useState<AccountOption | null>(
    null,
  );

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
              onEdit={setEditingAccount}
            />
          ))}
          <AddAccountButton />
        </section>
        <AccountFormModal
          account={editingAccount}
          key={editingAccount?.id ?? "closed"}
          onClose={() => setEditingAccount(null)}
          open={editingAccount !== null}
        />
        {/* Recent transactions */}
        <section className="space-y-6">
          <div className="flex justify-between items-end mb-4">
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Giao dịch gần đây
            </h2>
          </div>
          {recentGroups.length === 0 ? (
            <p className="text-center text-on-surface-variant py-xl">
              Chưa có giao dịch nào.
            </p>
          ) : (
            <div className="space-y-6">
              {recentGroups.map((group) => (
                <DayGroup
                  accounts={accounts}
                  expenseCategories={expenseCategories}
                  group={group}
                  incomeCategories={incomeCategories}
                  key={group.dateIso}
                />
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
      <QuickAddTransactionButton
        accounts={accounts}
        expenseCategories={expenseCategories}
        incomeCategories={incomeCategories}
        variant="fab"
      />
    </>
  );
}
