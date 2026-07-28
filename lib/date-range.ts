export interface DateRange {
  start: Date;
  end: Date;
}

export function getCurrentDayRange(now: Date = new Date()): DateRange {
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
}

export function getCurrentMonthRange(now: Date = new Date()): DateRange {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const end = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1),
  );
  return { start, end };
}

export function getCurrentYearRange(now: Date = new Date()): DateRange {
  const start = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  const end = new Date(Date.UTC(now.getUTCFullYear() + 1, 0, 1));
  return { start, end };
}

export function getMondayFirstWeekdayIndex(date: Date): number {
  const day = date.getUTCDay();
  return day === 0 ? 6 : day - 1;
}

export function getCurrentWeekRange(now: Date = new Date()): DateRange {
  const todayUtcMidnight = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  const weekdayIndex = getMondayFirstWeekdayIndex(todayUtcMidnight);

  const start = new Date(todayUtcMidnight);
  start.setUTCDate(start.getUTCDate() - weekdayIndex);

  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 7);

  return { start, end };
}

export function getPreviousWeekRange(now: Date = new Date()): DateRange {
  const currentWeek = getCurrentWeekRange(now);

  const start = new Date(currentWeek.start);
  start.setUTCDate(start.getUTCDate() - 7);

  return { start, end: currentWeek.start };
}

export type PeriodKey = "day" | "week" | "month" | "year";

export function getPeriodRange(
  key: PeriodKey,
  now: Date = new Date(),
): DateRange {
  switch (key) {
    case "day":
      return getCurrentDayRange(now);
    case "week":
      return getCurrentWeekRange(now);
    case "month":
      return getCurrentMonthRange(now);
    case "year":
      return getCurrentYearRange(now);
  }
}

export function isSameDateRange(a: DateRange, b: DateRange): boolean {
  return (
    a.start.getTime() === b.start.getTime() && a.end.getTime() === b.end.getTime()
  );
}

export function formatDateIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function parseIsoDateAsUtcMidnight(value: string): Date | null {
  if (!ISO_DATE_PATTERN.test(value)) {
    return null;
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function parseDateRangeParams(
  from: string | undefined,
  to: string | undefined,
): DateRange {
  if (!from || !to) {
    return getCurrentMonthRange();
  }

  const start = parseIsoDateAsUtcMidnight(from);
  const toDate = parseIsoDateAsUtcMidnight(to);
  if (!start || !toDate || start > toDate) {
    return getCurrentMonthRange();
  }

  const end = new Date(toDate);
  end.setUTCDate(end.getUTCDate() + 1);

  return { start, end };
}
