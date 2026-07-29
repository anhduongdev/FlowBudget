"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createPortal } from "react-dom";
import {
  formatDateIso,
  getCurrentDayRange,
  getCurrentMonthRange,
  getCurrentWeekRange,
  getCurrentYearRange,
  type DateRange,
} from "@/lib/date-range";
import { ALL_TIME_RANGE } from "@/lib/period-range-label";
import { MiniDatePicker } from "./mini-date-picker";
import { RangeCalendarPicker } from "./range-calendar-picker";

interface DateRangeTriggerProps {
  currentFrom: string;
  currentTo: string;
  label: string;
}

type Step = "closed" | "menu" | "single-day" | "range";

function inclusiveRangeToParams(range: DateRange): { from: string; to: string } {
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
}: DateRangeTriggerProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("closed");

  const now = new Date();
  const weekRange = getCurrentWeekRange(now);
  const monthRange = getCurrentMonthRange(now);
  const yearRange = getCurrentYearRange(now);
  const weekInclusiveEnd = new Date(weekRange.end);
  weekInclusiveEnd.setUTCDate(weekInclusiveEnd.getUTCDate() - 1);

  function applyRange(range: DateRange) {
    const params = inclusiveRangeToParams(range);
    router.push(`/preview/transactions?from=${params.from}&to=${params.to}`);
    setStep("closed");
  }

  function applySingleDay(iso: string) {
    router.push(`/preview/transactions?from=${iso}&to=${iso}`);
    setStep("closed");
  }

  function applyCustomRange(from: string, to: string) {
    router.push(`/preview/transactions?from=${from}&to=${to}`);
    setStep("closed");
  }

  return (
    <>
      <button
        className="flex items-center justify-between w-full bg-[#18448b]/[0.06] rounded-full px-3 py-1.5"
        onClick={() => setStep("menu")}
        type="button"
      >
        <span className="material-symbols-outlined text-[#18448b]/50" style={{ fontSize: "16px" }}>
          chevron_left
        </span>
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[#18448b]" style={{ fontSize: "14px" }}>
            calendar_month
          </span>
          <span className="text-[11px] font-semibold text-[#18448b]">
            {label}
          </span>
          <span className="material-symbols-outlined text-[#18448b]/50" style={{ fontSize: "14px" }}>
            keyboard_arrow_down
          </span>
        </span>
        <span className="material-symbols-outlined text-[#18448b]/50" style={{ fontSize: "16px" }}>
          chevron_right
        </span>
      </button>

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
