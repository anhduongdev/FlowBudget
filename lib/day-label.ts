const WEEKDAY_NAMES = [
  "Chủ Nhật",
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy",
] as const;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function getDayGroupLabel(dateIso: string, todayIso: string): string {
  const date = new Date(`${dateIso}T00:00:00.000Z`);
  const today = new Date(`${todayIso}T00:00:00.000Z`);
  const diffDays = Math.round((today.getTime() - date.getTime()) / MS_PER_DAY);

  if (diffDays === 0) {
    return "Hôm nay";
  }
  if (diffDays === 1) {
    return "Hôm qua";
  }

  return WEEKDAY_NAMES[date.getUTCDay()];
}
