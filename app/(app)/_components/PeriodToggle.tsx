import Link from "next/link";

const OPTIONS: { value: string; label: string }[] = [
  { value: "today", label: "Hôm nay" },
  { value: "month", label: "Tháng" },
  { value: "year", label: "Năm" },
];

// Server Component thuần — điều hướng qua ?period=..., không cần state client.
export function PeriodToggle({ basePath, current }: { basePath: string; current: string }) {
  return (
    <div className="flex rounded-full border border-outline-variant bg-surface-container-low p-1">
      {OPTIONS.map((opt) => (
        <Link
          key={opt.value}
          className={
            opt.value === current
              ? "rounded-full bg-primary-container px-sm py-1 font-label-sm font-bold text-on-primary-container"
              : "rounded-full px-sm py-1 font-label-sm text-on-surface-variant transition-all hover:bg-surface-container-high"
          }
          href={`${basePath}?period=${opt.value}`}
        >
          {opt.label}
        </Link>
      ))}
    </div>
  );
}
