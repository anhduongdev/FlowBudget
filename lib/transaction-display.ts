const MONTH_YEAR_FORMATTER = new Intl.DateTimeFormat("vi-VN", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function getMonthYearLabel(dateIso: string): string {
  const date = new Date(`${dateIso}T00:00:00.000Z`);
  return MONTH_YEAR_FORMATTER.format(date).toUpperCase();
}

interface TransactionTitleSource {
  note: string | null;
  type: "income" | "expense" | "transfer";
  toAccountName: string | null;
  categoryName: string | null;
}

export function transactionItemTitle(item: TransactionTitleSource): string {
  if (item.note) return item.note;
  if (item.type === "transfer") {
    return item.toAccountName
      ? `Chuyển đến ${item.toAccountName}`
      : "Chuyển khoản";
  }
  return item.categoryName ?? "Không có danh mục";
}
