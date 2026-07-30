import {
  ALL_TIME_RANGE,
  type DateRange,
  getCurrentDayRange,
  isSameDateRange,
} from "@/lib/date-range";

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
