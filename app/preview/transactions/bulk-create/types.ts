export interface BulkTransactionRuleDraft {
  clientId: string;
  type: "income" | "expense";
  accountId: string;
  categoryId: string | null;
  categoryLabel: { name: string; icon: string; color: string } | null;
  amount: number;
  weekdays: number[];
  note: string | null;
}

export const WEEKDAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"] as const;

export function formatWeekdaysLabel(weekdays: number[]): string {
  if (weekdays.length === 7) {
    return "Tất cả các ngày";
  }
  return [...weekdays]
    .sort((a, b) => a - b)
    .map((index) => WEEKDAY_LABELS[index])
    .join(", ");
}
