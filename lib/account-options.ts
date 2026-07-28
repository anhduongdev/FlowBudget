export const ACCOUNT_ICONS = [
  "account_balance_wallet",
  "account_balance",
  "credit_card",
  "savings",
  "payments",
  "qr_code",
  "point_of_sale",
  "currency_exchange",
] as const;

export const DEFAULT_ACCOUNT_ICON = "account_balance_wallet";
export const DEFAULT_ACCOUNT_COLOR = "#94a3b8";

export const ACCOUNT_TYPE_OPTIONS = [
  { value: "cash", label: "Tiền mặt" },
  { value: "bank", label: "Ngân hàng" },
  { value: "ewallet", label: "Ví điện tử" },
  { value: "credit_card", label: "Thẻ tín dụng" },
  { value: "savings", label: "Tiết kiệm" },
  { value: "other", label: "Khác" },
] as const;
