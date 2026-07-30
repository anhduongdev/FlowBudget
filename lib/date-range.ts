export interface DateRange {
  start: Date;
  end: Date;
}

export const ALL_TIME_RANGE: DateRange = {
  start: new Date(Date.UTC(2000, 0, 1)),
  end: new Date(Date.UTC(2100, 0, 1)),
};

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

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type PeriodShape = "day" | "week" | "month" | "year" | "all-time" | "custom";

function isMonthRangeShape(range: DateRange): boolean {
  const { start, end } = range;
  if (start.getUTCDate() !== 1 || end.getUTCDate() !== 1) {
    return false;
  }
  const monthsBetween =
    (end.getUTCFullYear() - start.getUTCFullYear()) * 12 +
    (end.getUTCMonth() - start.getUTCMonth());
  return monthsBetween === 1;
}

function isYearRangeShape(range: DateRange): boolean {
  const { start, end } = range;
  return (
    start.getUTCMonth() === 0 &&
    start.getUTCDate() === 1 &&
    end.getUTCMonth() === 0 &&
    end.getUTCDate() === 1 &&
    end.getUTCFullYear() - start.getUTCFullYear() === 1
  );
}

export function detectPeriodShape(range: DateRange): PeriodShape {
  if (isSameDateRange(range, ALL_TIME_RANGE)) {
    return "all-time";
  }

  const diffDays = Math.round((range.end.getTime() - range.start.getTime()) / MS_PER_DAY);

  if (diffDays === 1) {
    return "day";
  }
  if (diffDays === 7 && getMondayFirstWeekdayIndex(range.start) === 0) {
    return "week";
  }
  if (isYearRangeShape(range)) {
    return "year";
  }
  if (isMonthRangeShape(range)) {
    return "month";
  }
  return "custom";
}

export function shiftDateRange(range: DateRange, direction: -1 | 1): DateRange {
  const shape = detectPeriodShape(range);

  switch (shape) {
    case "all-time":
      return range;
    case "day":
    case "week": {
      const stepDays = shape === "day" ? 1 : 7;
      const start = new Date(range.start);
      start.setUTCDate(start.getUTCDate() + direction * stepDays);
      const end = new Date(range.end);
      end.setUTCDate(end.getUTCDate() + direction * stepDays);
      return { start, end };
    }
    case "month": {
      const year = range.start.getUTCFullYear();
      const month = range.start.getUTCMonth() + direction;
      return {
        start: new Date(Date.UTC(year, month, 1)),
        end: new Date(Date.UTC(year, month + 1, 1)),
      };
    }
    case "year": {
      const year = range.start.getUTCFullYear() + direction;
      return {
        start: new Date(Date.UTC(year, 0, 1)),
        end: new Date(Date.UTC(year + 1, 0, 1)),
      };
    }
    case "custom": {
      const lengthMs = range.end.getTime() - range.start.getTime();
      return {
        start: new Date(range.start.getTime() + direction * lengthMs),
        end: new Date(range.end.getTime() + direction * lengthMs),
      };
    }
  }
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
