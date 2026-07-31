"use client";

import { useState } from "react";
import { getMondayFirstWeekdayIndex } from "@/lib/date-range";

interface RangeCalendarPickerProps {
  initialFrom: string;
  initialTo: string;
  onApply: (from: string, to: string) => void;
  onClose: () => void;
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

const MONTH_WINDOW_BEFORE = 1;
const MONTH_WINDOW_AFTER = 4;

function toIso(year: number, month: number, day: number): string {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function formatShortVn(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "short" });
}

type DayState = "none" | "single" | "start" | "end" | "between";

function classifyDay(
  iso: string,
  start: string | null,
  end: string | null,
): DayState {
  if (!start) return "none";
  if (!end) return iso === start ? "single" : "none";
  if (iso === start && iso === end) return "single";
  if (iso === start) return "start";
  if (iso === end) return "end";
  if (iso > start && iso < end) return "between";
  return "none";
}

interface MonthSectionProps {
  year: number;
  month: number;
  rangeStart: string | null;
  rangeEnd: string | null;
  onPick: (iso: string) => void;
}

function MonthSection({
  year,
  month,
  rangeStart,
  rangeEnd,
  onPick,
}: MonthSectionProps) {
  const firstOfMonth = new Date(Date.UTC(year, month, 1));
  const leadingBlanks = getMondayFirstWeekdayIndex(firstOfMonth);
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: (number | null)[] = [
    ...Array<null>(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  return (
    <div className="mb-6">
      <p className="text-[13px] font-semibold text-on-surface-variant mb-2">
        {MONTH_LABELS[month]} năm {year}
      </p>
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, index) => {
          if (day === null) {
            return <div key={`blank-${index}`} />;
          }
          const iso = toIso(year, month, day);
          const state = classifyDay(iso, rangeStart, rangeEnd);
          const wrapperRounding =
            state === "start" || state === "single"
              ? "rounded-l-full"
              : state === "end"
                ? "rounded-r-full"
                : "";
          const wrapperBg =
            state === "none" ? "" : "bg-[#18448b]/10";
          return (
            <div
              className={`h-10 flex items-center justify-center ${wrapperBg} ${wrapperRounding}`}
              key={iso}
            >
              <button
                className={`w-9 h-9 rounded-full text-[13px] font-medium transition-colors ${
                  state === "start" || state === "end" || state === "single"
                    ? "bg-[#18448b] text-white"
                    : "text-on-surface hover:bg-surface-container-low"
                }`}
                onClick={() => onPick(iso)}
                type="button"
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function RangeCalendarPicker({
  initialFrom,
  initialTo,
  onApply,
  onClose,
}: RangeCalendarPickerProps) {
  const [rangeStart, setRangeStart] = useState<string | null>(initialFrom);
  const [rangeEnd, setRangeEnd] = useState<string | null>(initialTo);

  const anchor = new Date(`${initialFrom}T00:00:00Z`);
  const anchorYear = anchor.getUTCFullYear();
  const anchorMonth = anchor.getUTCMonth();

  const months: { year: number; month: number }[] = [];
  for (
    let offset = -MONTH_WINDOW_BEFORE;
    offset <= MONTH_WINDOW_AFTER;
    offset += 1
  ) {
    const date = new Date(Date.UTC(anchorYear, anchorMonth + offset, 1));
    months.push({ year: date.getUTCFullYear(), month: date.getUTCMonth() });
  }

  function pickDay(iso: string) {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(iso);
      setRangeEnd(null);
      return;
    }
    if (iso >= rangeStart) {
      setRangeEnd(iso);
    } else {
      setRangeEnd(rangeStart);
      setRangeStart(iso);
    }
  }

  function confirm() {
    const from = rangeStart ?? initialFrom;
    const to = rangeEnd ?? rangeStart ?? initialTo;
    onApply(from, to);
  }

  const subtitle =
    rangeStart && rangeEnd
      ? `${formatShortVn(rangeStart)} – ${formatShortVn(rangeEnd)}`
      : rangeStart
        ? `${formatShortVn(rangeStart)} – ?`
        : "Chọn ngày bắt đầu";

  return (
    <div className="fixed inset-x-0 top-0 bottom-0 mx-auto w-full max-w-[430px] z-[95] bg-background text-on-surface flex flex-col">
      <div className="flex items-center gap-3 px-4 pt-4 pb-2 shrink-0 border-b border-outline-variant/20">
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors"
          onClick={onClose}
          type="button"
        >
          <span className="material-symbols-outlined text-on-surface-variant">
            close
          </span>
        </button>
        <div>
          <p className="text-[15px] font-semibold text-on-surface leading-tight">
            Chọn khoảng
          </p>
          <p className="text-[12px] text-on-surface-variant">{subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-7 px-4 pt-3 pb-1 shrink-0">
        {WEEKDAY_LABELS.map((label) => (
          <p
            className="text-center text-[11px] font-semibold text-on-surface-variant/60"
            key={label}
          >
            {label}
          </p>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {months.map(({ year, month }) => (
          <MonthSection
            key={`${year}-${month}`}
            month={month}
            onPick={pickDay}
            rangeEnd={rangeEnd}
            rangeStart={rangeStart}
            year={year}
          />
        ))}
      </div>

      <div className="px-4 py-3 border-t border-outline-variant/20 shrink-0">
        <button
          className="w-full py-3 rounded-xl bg-[#18448b] text-white font-semibold disabled:opacity-40"
          disabled={!rangeStart}
          onClick={confirm}
          type="button"
        >
          Xong
        </button>
      </div>
    </div>
  );
}
