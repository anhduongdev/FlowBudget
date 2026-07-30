const VND_FORMATTER = new Intl.NumberFormat("vi-VN");

export function formatVnd(amount: number): string {
  return `${VND_FORMATTER.format(Math.round(amount))} đ`;
}

export function formatDateVnLong(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
