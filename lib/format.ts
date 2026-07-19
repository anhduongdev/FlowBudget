const currencyFormatter = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 });

export function formatVnd(amount: number | string): string {
  const value = typeof amount === "string" ? Number(amount) : amount;
  return `${currencyFormatter.format(value)}đ`;
}
