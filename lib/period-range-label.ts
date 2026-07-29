import {
  type DateRange,
  getCurrentDayRange,
  isSameDateRange,
} from "@/lib/date-range";

export const ALL_TIME_RANGE: DateRange = {
  start: new Date(Date.UTC(2000, 0, 1)),
  end: new Date(Date.UTC(2100, 0, 1)),
};

function formatShortVn(date: Date): string {
  return `${date.getUTCDate()} THG ${date.getUTCMonth() + 1}`;
}

export function getPeriodRangeLabel(
  range: DateRange,
  now: Date = new Date(),
): string {
  if (isSameDateRange(range, ALL_TIME_RANGE)) {
    return "Tất cả thời gian";
  }
  if (isSameDateRange(range, getCurrentDayRange(now))) {
    return "Hôm nay";
  }

  const inclusiveEnd = new Date(range.end);
  inclusiveEnd.setUTCDate(inclusiveEnd.getUTCDate() - 1);

  if (range.start.getTime() === inclusiveEnd.getTime()) {
    return `${formatShortVn(range.start)} ${range.start.getUTCFullYear()}`;
  }

  return `${formatShortVn(range.start)} – ${formatShortVn(inclusiveEnd)} ${inclusiveEnd.getUTCFullYear()}`;
}
