"use client";

import { useState } from "react";
import { getMondayFirstWeekdayIndex } from "@/lib/date-range";

interface MiniDatePickerProps {
  value: string;
  onChange: (iso: string) => void;
  onClose: () => void;
  /** Optional title bar shown above the calendar (confirm-mode header). */
  title?: string;
  /**
   * When true, tapping a day only stages the selection — the caller must
   * tap "OK" to commit it via onChange, and "Hủy" discards it. When false
   * (default), tapping a day commits immediately and closes the picker.
   */
  confirmMode?: boolean;
}

const WEEKDAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const MONTH_LABELS = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

function toIso(year: number, month: number, day: number): string {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatLongVn(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function MiniDatePicker({
  value,
  onChange,
  onClose,
  title,
  confirmMode = false,
}: MiniDatePickerProps) {
  const initial = new Date(`${value}T00:00:00Z`);
  const [viewYear, setViewYear] = useState(initial.getUTCFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getUTCMonth());
  const [pending, setPending] = useState(value);

  const firstOfMonth = new Date(Date.UTC(viewYear, viewMonth, 1));
  const leadingBlanks = getMondayFirstWeekdayIndex(firstOfMonth);
  const daysInMonth = new Date(Date.UTC(viewYear, viewMonth + 1, 0)).getUTCDate();
  const cells: (number | null)[] = [
    ...Array<null>(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  function goPrevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((year) => year - 1);
    } else {
      setViewMonth((month) => month - 1);
    }
  }

  function goNextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((year) => year + 1);
    } else {
      setViewMonth((month) => month + 1);
    }
  }

  function selectToday() {
    if (confirmMode) {
      setPending(todayIso());
      return;
    }
    onChange(todayIso());
    onClose();
  }

  function pickDay(iso: string) {
    if (confirmMode) {
      setPending(iso);
      return;
    }
    onChange(iso);
    onClose();
  }

  function confirm() {
    onChange(pending);
    onClose();
  }

  const selectedValue = confirmMode ? pending : value;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-6">
      <button
        aria-label="Đóng"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        type="button"
      />
      <div className="relative w-full max-w-[300px] bg-white rounded-3xl shadow-2xl p-5">
        {title && (
          <p className="text-[13px] font-semibold text-on-surface-variant mb-1">
            {title}
          </p>
        )}
        {confirmMode && (
          <p className="text-[20px] font-bold text-on-surface mb-4">
            {formatLongVn(pending)}
          </p>
        )}

        <div className="flex items-center justify-between mb-4">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors"
            onClick={goPrevMonth}
            type="button"
          >
            <span className="material-symbols-outlined text-on-surface-variant">
              chevron_left
            </span>
          </button>
          <p className="font-semibold text-on-surface text-[15px]">
            {MONTH_LABELS[viewMonth]} {viewYear}
          </p>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors"
            onClick={goNextMonth}
            type="button"
          >
            <span className="material-symbols-outlined text-on-surface-variant">
              chevron_right
            </span>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEKDAY_LABELS.map((label) => (
            <p
              className="text-center text-[11px] font-semibold text-on-surface-variant/60"
              key={label}
            >
              {label}
            </p>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, index) => {
            if (day === null) {
              return <div key={`blank-${index}`} />;
            }
            const iso = toIso(viewYear, viewMonth, day);
            const isSelected = iso === selectedValue;
            const isToday = iso === todayIso();
            return (
              <button
                className={`h-9 rounded-full text-[13px] font-medium transition-colors ${
                  isSelected
                    ? "bg-[#18448b] text-white"
                    : isToday
                      ? "text-[#18448b] font-bold hover:bg-[#18448b]/10"
                      : "text-on-surface hover:bg-surface-container-low"
                }`}
                key={iso}
                onClick={() => pickDay(iso)}
                type="button"
              >
                {day}
              </button>
            );
          })}
        </div>

        {confirmMode ? (
          <div className="flex items-center gap-2 mt-4">
            <button
              className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors"
              onClick={onClose}
              type="button"
            >
              Hủy
            </button>
            <button
              className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold bg-[#18448b] text-white hover:opacity-90 transition-colors"
              onClick={confirm}
              type="button"
            >
              OK
            </button>
          </div>
        ) : (
          <button
            className="w-full mt-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#18448b] hover:bg-[#18448b]/5 transition-colors"
            onClick={selectToday}
            type="button"
          >
            Hôm nay
          </button>
        )}
      </div>
    </div>
  );
}
