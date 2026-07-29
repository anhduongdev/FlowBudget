import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/category-options";

/**
 * Kho icon danh mục có sẵn màu nền (không cần chọn màu riêng). Mỗi icon
 * trong `CATEGORY_ICONS` được gán cố định một màu trong `CATEGORY_COLORS`
 * để dùng cho popup thêm/sửa danh mục kiểu lưới-icon.
 */
export interface CategoryIconOption {
  icon: (typeof CATEGORY_ICONS)[number];
  color: (typeof CATEGORY_COLORS)[number];
}

export const CATEGORY_ICON_LIBRARY: CategoryIconOption[] = [
  { icon: "shopping_basket", color: "#3b82f6" },
  { icon: "restaurant", color: "#6366f1" },
  { icon: "local_cafe", color: "#8b5cf6" },
  { icon: "fastfood", color: "#d946ef" },
  { icon: "shopping_bag", color: "#64748b" },
  { icon: "checkroom", color: "#22c55e" },
  { icon: "home", color: "#f43f5e" },
  { icon: "bolt", color: "#ef4444" },
  { icon: "water_drop", color: "#06b6d4" },
  { icon: "wifi", color: "#3b82f6" },
  { icon: "phone_iphone", color: "#64748b" },
  { icon: "directions_car", color: "#d97706" },
  { icon: "local_gas_station", color: "#d946ef" },
  { icon: "directions_bus", color: "#d97706" },
  { icon: "flight", color: "#06b6d4" },
  { icon: "hotel", color: "#8b5cf6" },
  { icon: "local_hospital", color: "#ef4444" },
  { icon: "medication", color: "#ec4899" },
  { icon: "fitness_center", color: "#22c55e" },
  { icon: "spa", color: "#14b8a6" },
  { icon: "movie", color: "#f43f5e" },
  { icon: "sports_esports", color: "#6366f1" },
  { icon: "confirmation_number", color: "#ec4899" },
  { icon: "school", color: "#3b82f6" },
  { icon: "child_care", color: "#8b5cf6" },
  { icon: "pets", color: "#65a30d" },
  { icon: "celebration", color: "#f97316" },
  { icon: "card_giftcard", color: "#ef4444" },
  { icon: "volunteer_activism", color: "#6366f1" },
  { icon: "receipt_long", color: "#64748b" },
  { icon: "build", color: "#d97706" },
  { icon: "payments", color: "#22c55e" },
  { icon: "trending_up", color: "#14b8a6" },
  { icon: "account_balance", color: "#3b82f6" },
  { icon: "savings", color: "#65a30d" },
  { icon: "work", color: "#64748b" },
  { icon: "storefront", color: "#f97316" },
  { icon: "more_horiz", color: "#64748b" },
];
