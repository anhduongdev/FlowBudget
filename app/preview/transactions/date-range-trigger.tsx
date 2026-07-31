"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createPortal } from "react-dom";
import {
  ALL_TIME_RANGE,
  detectPeriodShape,
  formatDateIso,
  getCurrentDayRange,
  getCurrentMonthRange,
  getCurrentWeekRange,
  getCurrentYearRange,
  parseDateRangeParams,
  shiftDateRange,
  type DateRange,
} from "@/lib/date-range";
import { MiniDatePicker } from "./mini-date-picker";
import { RangeCalendarPicker } from "./range-calendar-picker";

interface DateRangeTriggerProps {
  currentFrom: string;
  currentTo: string;
  label: string;
  /**
   * Khi truyền vào, component gọi callback này thay vì tự điều hướng tới
   * `/preview/transactions?from=...&to=...` — cho phép tái dùng UI chọn kỳ
   * này ở những trang khác chỉ cần cập nhật state cục bộ (không đổi URL).
   */
  onChange?: (from: string, to: string) => void;
}

type Step = "closed" | "menu" | "single-day" | "range";

function inclusiveRangeToParams(range: DateRange): {
  from: string;
  to: string;
} {
  const inclusiveEnd = new Date(range.end);
  inclusiveEnd.setUTCDate(inclusiveEnd.getUTCDate() - 1);
  return { from: formatDateIso(range.start), to: formatDateIso(inclusiveEnd) };
}

function formatShortVn(date: Date): string {
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "short" });
}

export function DateRangeTrigger({
  currentFrom,
  currentTo,
  label,
  onChange,
}: DateRangeTriggerProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("closed");

  const now = new Date();
  const weekRange = getCurrentWeekRange(now);
  const monthRange = getCurrentMonthRange(now);
  const yearRange = getCurrentYearRange(now);
  const weekInclusiveEnd = new Date(weekRange.end);
  weekInclusiveEnd.setUTCDate(weekInclusiveEnd.getUTCDate() - 1);

  function navigate(from: string, to: string) {
    if (onChange) {
      onChange(from, to);
    } else {
      router.push(`/preview/transactions?from=${from}&to=${to}`);
    }
    setStep("closed");
  }

  function applyRange(range: DateRange) {
    const params = inclusiveRangeToParams(range);
    navigate(params.from, params.to);
  }

  function applySingleDay(iso: string) {
    navigate(iso, iso);
  }

  function applyCustomRange(from: string, to: string) {
    navigate(from, to);
  }

  const currentRange = parseDateRangeParams(currentFrom, currentTo);
  const isAllTime = detectPeriodShape(currentRange) === "all-time";
  const todayIso = formatDateIso(now);
  const isOutsideCurrentPeriod = todayIso < currentFrom || todayIso > currentTo;
  const accentColorClass = isOutsideCurrentPeriod
    ? "text-error"
    : "text-[#18448b]";
  const accentMutedColorClass = isOutsideCurrentPeriod
    ? "text-error/50"
    : "text-[#18448b]/50";
  const accentBgClass = isOutsideCurrentPeriod
    ? "bg-error/10"
    : "bg-[#18448b]/[0.06]";

  function goToAdjacentPeriod(direction: -1 | 1) {
    applyRange(shiftDateRange(currentRange, direction));
  }

  return (
    <>
      <div
        className={`flex items-center justify-between w-full rounded-full px-1 py-1.5 ${accentBgClass}`}
      >
        <button
          className="px-2 disabled:opacity-30"
          disabled={isAllTime}
          onClick={() => goToAdjacentPeriod(-1)}
          type="button"
        >
          <span
            className={`material-symbols-outlined ${accentMutedColorClass}`}
            style={{ fontSize: "16px" }}
          >
            chevron_left
          </span>
        </button>
        <button
          className="flex items-center gap-1"
          onClick={() => setStep("menu")}
          type="button"
        >
          <span
            className={`material-symbols-outlined ${accentColorClass}`}
            style={{ fontSize: "14px" }}
          >
            calendar_month
          </span>
          <span className={`text-[11px] font-semibold ${accentColorClass}`}>
            {label}
          </span>
          <span
            className={`material-symbols-outlined ${accentMutedColorClass}`}
            style={{ fontSize: "14px" }}
          >
            keyboard_arrow_down
          </span>
        </button>
        <button
          className="px-2 disabled:opacity-30"
          disabled={isAllTime}
          onClick={() => goToAdjacentPeriod(1)}
          type="button"
        >
          <span
            className={`material-symbols-outlined ${accentMutedColorClass}`}
            style={{ fontSize: "16px" }}
          >
            chevron_right
          </span>
        </button>
      </div>

      {/*
        Portaled to document.body: this trigger lives inside <header>, which
        has backdrop-blur (backdrop-filter). backdrop-filter establishes a
        new containing block for position:fixed descendants, so without the
        portal these popups would size themselves against the small header
        box instead of the viewport.
      */}
      {step !== "closed" &&
        createPortal(
          <>
            {step === "menu" && (
              <div className="fixed inset-x-0 top-[192px] bottom-0 w-full max-w-[430px] mx-auto z-[70] bg-background text-on-surface flex flex-col rounded-t-3xl overflow-hidden shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
                <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/30 shrink-0">
                  <h2 className="font-semibold text-[15px] text-on-surface">
                    Kỳ
                  </h2>
                  <button
                    className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center"
                    onClick={() => setStep("closed")}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-on-surface-variant text-lg">
                      close
                    </span>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
                  <button
                    className="w-full rounded-2xl bg-[#18448b]/10 border border-[#18448b]/20 py-4 flex flex-col items-center gap-1.5"
                    onClick={() => setStep("range")}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[#18448b]">
                      date_range
                    </span>
                    <span className="text-[13px] font-semibold text-[#18448b]">
                      Chọn khoảng
                    </span>
                    <span className="text-[11px] text-[#18448b]/70">
                      {label}
                    </span>
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      className="rounded-2xl bg-surface-container-low py-4 flex flex-col items-center gap-1.5"
                      onClick={() => applyRange(ALL_TIME_RANGE)}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-on-surface-variant">
                        all_inclusive
                      </span>
                      <span className="text-[13px] font-semibold text-on-surface">
                        Tất cả thời gian
                      </span>
                    </button>
                    <button
                      className="rounded-2xl bg-surface-container-low py-4 flex flex-col items-center gap-1.5"
                      onClick={() => setStep("single-day")}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-on-surface-variant">
                        event
                      </span>
                      <span className="text-[13px] font-semibold text-on-surface">
                        Chọn ngày
                      </span>
                    </button>

                    <button
                      className="rounded-2xl bg-surface-container-low py-4 flex flex-col items-center gap-1.5"
                      onClick={() => applyRange(weekRange)}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-on-surface-variant">
                        view_week
                      </span>
                      <span className="text-[13px] font-semibold text-on-surface">
                        Tuần
                      </span>
                      <span className="text-[11px] text-on-surface-variant">
                        {formatShortVn(weekRange.start)} –{" "}
                        {formatShortVn(weekInclusiveEnd)}
                      </span>
                    </button>
                    <button
                      className="rounded-2xl bg-surface-container-low py-4 flex flex-col items-center gap-1.5"
                      onClick={() => applyRange(getCurrentDayRange(now))}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-on-surface-variant">
                        today
                      </span>
                      <span className="text-[13px] font-semibold text-on-surface">
                        Hôm nay
                      </span>
                      <span className="text-[11px] text-on-surface-variant">
                        {formatShortVn(now)}
                      </span>
                    </button>

                    <button
                      className="rounded-2xl bg-surface-container-low py-4 flex flex-col items-center gap-1.5"
                      onClick={() => applyRange(yearRange)}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-on-surface-variant">
                        calendar_today
                      </span>
                      <span className="text-[13px] font-semibold text-on-surface">
                        Năm
                      </span>
                      <span className="text-[11px] text-on-surface-variant">
                        Năm {now.getUTCFullYear()}
                      </span>
                    </button>
                    <button
                      className="rounded-2xl bg-surface-container-low py-4 flex flex-col items-center gap-1.5"
                      onClick={() => applyRange(monthRange)}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-on-surface-variant">
                        calendar_view_month
                      </span>
                      <span className="text-[13px] font-semibold text-on-surface">
                        Tháng
                      </span>
                      <span className="text-[11px] text-on-surface-variant">
                        Tháng {now.getMonth() + 1} {now.getFullYear()}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === "single-day" && (
              <MiniDatePicker
                confirmMode
                onChange={applySingleDay}
                onClose={() => setStep("closed")}
                title="Chọn ngày"
                value={currentFrom}
              />
            )}

            {step === "range" && (
              <RangeCalendarPicker
                initialFrom={currentFrom}
                initialTo={currentTo}
                onApply={applyCustomRange}
                onClose={() => setStep("closed")}
              />
            )}
          </>,
          document.body,
        )}
    </>
  );
}
