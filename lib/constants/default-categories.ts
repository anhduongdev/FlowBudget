// Danh mục mặc định seed khi đăng ký — giống hệt dữ liệu seed trong db/schema.sql
// để trải nghiệm nhất quán giữa user demo và user thật.

export type DefaultCategory = { name: string; icon: string; color: string };

export const DEFAULT_EXPENSE_CATEGORIES: DefaultCategory[] = [
  { name: "Bách hóa", icon: "basket", color: "#f97316" },
  { name: "Ăn uống", icon: "food", color: "#ef4444" },
  { name: "Điện nước", icon: "bolt", color: "#eab308" },
  { name: "Xăng xe", icon: "fuel", color: "#84cc16" },
  { name: "Phòng trọ", icon: "home", color: "#06b6d4" },
  { name: "Mua sắm", icon: "bag", color: "#ec4899" },
  { name: "Giải trí", icon: "game", color: "#a855f7" },
];

export const DEFAULT_INCOME_CATEGORIES: DefaultCategory[] = [
  { name: "Lương", icon: "salary", color: "#16a34a" },
  { name: "Thưởng", icon: "gift", color: "#0ea5e9" },
  { name: "Làm thêm", icon: "work", color: "#14b8a6" },
  { name: "Bán đồ", icon: "sell", color: "#f59e0b" },
  { name: "Được cho", icon: "heart", color: "#f43f5e" },
];
