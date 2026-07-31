"use client";

import Link from "next/link";
import { useState } from "react";
import { createPortal } from "react-dom";

interface BottomLogoMenuProps {
  currentFrom: string;
  currentTo: string;
}

interface NavOption {
  href: string;
  icon: string;
  label: string;
}

export function BottomLogoMenu({
  currentFrom,
  currentTo,
}: BottomLogoMenuProps) {
  const [open, setOpen] = useState(false);

  const periodQuery = `from=${currentFrom}&to=${currentTo}`;
  const options: NavOption[] = [
    {
      href: `/preview/transactions/bulk-create?${periodQuery}`,
      icon: "event_repeat",
      label: "Tạo giao dịch hàng loạt",
    },
  ];

  return (
    <>
      <button
        aria-label="Mở công cụ"
        className="absolute left-1/2 -translate-x-1/2 -top-6 w-14 h-14 rounded-full bg-white shadow-[0_8px_24px_-4px_rgba(24,68,139,0.4)] ring-4 ring-white flex items-center justify-center active:scale-95 transition-transform"
        onClick={() => setOpen(true)}
        type="button"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="FlowBudget"
          className="w-full h-full rounded-full object-cover"
          src="/logo_round.png"
        />
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-[80] flex items-end justify-center">
            <button
              aria-label="Đóng"
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(false)}
              type="button"
            />
            <div className="relative w-full max-w-[430px] flex flex-col bg-background text-on-surface rounded-t-3xl overflow-hidden shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
              <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/30">
                <h2 className="font-semibold text-[15px] text-on-surface">
                  Công cụ
                </h2>
                <button
                  className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center"
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-on-surface-variant text-lg">
                    close
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-4 gap-x-3 gap-y-4 px-5 py-6">
                {options.map((option) => (
                  <Link
                    className="flex flex-col items-center gap-1.5"
                    href={option.href}
                    key={option.href}
                    onClick={() => setOpen(false)}
                  >
                    <span className="w-14 h-14 rounded-full bg-[#18448b] flex items-center justify-center shadow-[0_4px_10px_-2px_rgba(0,0,0,0.15)]">
                      <span className="material-symbols-outlined text-white text-2xl">
                        {option.icon}
                      </span>
                    </span>
                    <span className="text-[11px] text-center leading-tight text-on-surface">
                      {option.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
