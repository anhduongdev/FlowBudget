import Link from "next/link";

export function CategoryTypeTabs({ current }: { current: "expense" | "income" }) {
  return (
    <div className="flex gap-lg border-b border-outline-variant">
      <Link
        className={
          current === "expense"
            ? "border-b-[3px] border-primary px-md py-sm font-bold text-body-md text-primary"
            : "px-md py-sm font-medium text-body-md text-on-surface-variant hover:text-on-surface"
        }
        href="/categories?type=expense"
      >
        Chi tiêu
      </Link>
      <Link
        className={
          current === "income"
            ? "border-b-[3px] border-primary px-md py-sm font-bold text-body-md text-primary"
            : "px-md py-sm font-medium text-body-md text-on-surface-variant hover:text-on-surface"
        }
        href="/categories?type=income"
      >
        Thu nhập
      </Link>
    </div>
  );
}
