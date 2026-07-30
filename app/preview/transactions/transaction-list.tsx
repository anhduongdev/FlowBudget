"use client";

import { useState } from "react";
import { getDayGroupLabel } from "@/lib/day-label";
import { formatVnd } from "@/lib/format";
import type { AccountOption } from "@/lib/services/account-service";
import type {
  TransactionDayGroup,
  TransactionListItem,
} from "@/lib/services/transaction-service";
import {
  getMonthYearLabel,
  transactionItemTitle,
} from "@/lib/transaction-display";
import { EditTransactionPanel } from "./edit-transaction-panel";

interface TransactionListProps {
  dayGroups: TransactionDayGroup[];
  accounts: AccountOption[];
  todayIso: string;
  emptyMessage: string;
}

export function TransactionList({
  dayGroups,
  accounts,
  todayIso,
  emptyMessage,
}: TransactionListProps) {
  const [selected, setSelected] = useState<TransactionListItem | null>(null);

  if (dayGroups.length === 0) {
    return (
      <p className="text-center text-[13px] text-on-surface-variant py-10">
        {emptyMessage}
      </p>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {dayGroups.map((group) => {
          const isFutureGroup = group.dateIso > todayIso;
          return (
            <div className="space-y-3" key={group.dateIso}>
              {/* Day Header */}
              <div className="flex justify-between items-center border-b border-outline-variant pb-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-4xl font-extrabold leading-none ${
                      isFutureGroup ? "text-[#18448b]/10" : "text-[#18448b]/60"
                    }`}
                  >
                    {group.dateIso.slice(8, 10)}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-on-surface-variant tracking-widest uppercase">
                      {getDayGroupLabel(group.dateIso, todayIso)}
                    </span>
                    <span className="text-[11px] font-medium text-on-surface-variant/50">
                      {getMonthYearLabel(group.dateIso)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`text-[14px] font-bold ${
                      group.netAmount > 0
                        ? "text-teal-600"
                        : group.netAmount < 0
                          ? "text-error"
                          : "text-on-surface-variant"
                    }`}
                  >
                    {group.netAmount > 0 ? "+" : ""}
                    {formatVnd(Math.abs(group.netAmount))}
                  </span>
                </div>
              </div>

              {/* List Items */}
              <div className="space-y-3">
                {group.items.map((item) => (
                  <button
                    className={`w-full flex items-center gap-3 p-1.5 rounded-2xl hover:bg-white active:bg-[#18448b]/10 active:scale-[0.97] transition-all duration-200 text-left ${
                      isFutureGroup ? "opacity-60" : ""
                    }`}
                    key={item.id}
                    onClick={() => setSelected(item)}
                    type="button"
                  >
                    <div
                      className="w-10 h-10 flex items-center justify-center rounded-2xl shrink-0"
                      style={{ backgroundColor: item.color }}
                    >
                      <span
                        className="material-symbols-outlined text-white text-[20px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {item.icon}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-on-surface truncate">
                        {transactionItemTitle(item)}
                      </p>
                      <div className="flex items-center gap-1 text-on-surface-variant/60">
                        <span className="material-symbols-outlined text-[12px]">
                          account_balance_wallet
                        </span>
                        <span className="text-[10px] font-medium truncate">
                          {item.accountName}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p
                        className={`text-[14px] font-bold ${
                          item.type === "income"
                            ? "text-teal-600"
                            : item.type === "transfer"
                              ? "text-on-surface-variant"
                              : "text-error"
                        }`}
                      >
                        {item.type === "income"
                          ? "+"
                          : item.type === "transfer"
                            ? ""
                            : "-"}
                        {formatVnd(item.amount)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <EditTransactionPanel
          accounts={accounts}
          key={selected.id}
          onClose={() => setSelected(null)}
          transaction={selected}
        />
      )}
    </>
  );
}
