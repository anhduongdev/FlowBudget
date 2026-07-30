"use client";

import { useEffect } from "react";

interface TransactionToastProps {
  message: string;
  onClose: () => void;
}

const AUTO_DISMISS_MS = 4000;

export function TransactionToast({ message, onClose }: TransactionToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className="fixed inset-x-0 bottom-28 z-[100] flex justify-center px-6">
      <div className="w-full max-w-[380px] bg-[#18448b] text-white rounded-2xl shadow-[0_8px_24px_-4px_rgba(0,0,0,0.3)] px-4 py-3 flex items-center gap-3">
        <span className="material-symbols-outlined text-[20px] shrink-0">
          event_available
        </span>
        <p className="flex-1 text-[13px] leading-snug">{message}</p>
        <button
          aria-label="Đóng"
          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors shrink-0"
          onClick={onClose}
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
    </div>
  );
}
