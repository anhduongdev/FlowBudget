"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

interface ConfirmDeleteButtonProps {
  label: string;
  confirmLabel: string;
}

export function ConfirmDeleteButton({
  label,
  confirmLabel,
}: ConfirmDeleteButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const { pending } = useFormStatus();

  if (!confirming) {
    return (
      <button
        className="font-label-md text-label-md text-error hover:underline"
        onClick={() => setConfirming(true)}
        type="button"
      >
        {label}
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-error/30 bg-error/5 px-4 py-3">
      <span className="font-label-sm text-label-sm text-error">
        {confirmLabel}
      </span>
      <div className="flex gap-2">
        <button
          className="px-3 py-1.5 rounded-lg text-on-surface-variant font-label-sm text-label-sm hover:bg-surface-container-low transition-colors"
          onClick={() => setConfirming(false)}
          type="button"
        >
          Huỷ
        </button>
        <button
          className="px-3 py-1.5 rounded-lg bg-error text-white font-label-sm text-label-sm hover:opacity-90 transition-all disabled:opacity-70"
          disabled={pending}
          type="submit"
        >
          {pending ? (
            <span className="material-symbols-outlined animate-spin align-middle text-base">
              progress_activity
            </span>
          ) : (
            "Xoá"
          )}
        </button>
      </div>
    </div>
  );
}
