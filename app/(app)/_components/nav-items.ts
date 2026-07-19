// Danh sách nav dùng chung cho Sidebar, MobileBottomNav, và TopAppBar (suy ra
// tiêu đề trang từ pathname) — tránh khai báo lặp lại ở 3 nơi.
export const NAV_ITEMS = [
  { href: "/dashboard", icon: "dashboard", label: "Tổng quan" },
  { href: "/accounts", icon: "account_balance_wallet", label: "Tài khoản" },
  { href: "/transactions", icon: "receipt_long", label: "Giao dịch" },
  { href: "/categories", icon: "category", label: "Danh mục" },
] as const;
