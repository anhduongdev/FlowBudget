"use client";

import { useState } from "react";
import { AccountFormModal } from "./account-form-modal";

export function AddAccountButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="group relative flex items-center justify-center gap-4 p-6 border-2 border-dashed border-outline-variant/50 rounded-[24px] hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
        onClick={() => setOpen(true)}
        type="button"
      >
        <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
          <span className="material-symbols-outlined text-2xl">add</span>
        </div>
        <span className="font-label-md text-label-md text-on-surface">
          Thêm tài khoản
        </span>
      </button>
      <AccountFormModal account={null} onClose={() => setOpen(false)} open={open} />
    </>
  );
}
