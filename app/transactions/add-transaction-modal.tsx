"use client";

import { useState, type FormEvent } from "react";

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
}

interface AccountOption {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface CategoryOption {
  name: string;
  icon: string;
  color: string;
}

const TRANSACTION_TYPES = [
  { value: "expense", label: "Chi phí", icon: "arrow_downward", color: "#ef4444" },
  { value: "income", label: "Thu nhập", icon: "arrow_upward", color: "#22c55e" },
  { value: "transfer", label: "Chuyển khoản", icon: "swap_horiz", color: "#3b82f6" },
] as const;

type TransactionType = (typeof TRANSACTION_TYPES)[number]["value"];

const ACCOUNTS: AccountOption[] = [
  { id: "card", name: "Thẻ", icon: "credit_card", color: "#5C6BC0" },
  { id: "cash", name: "Tiền mặt", icon: "account_balance_wallet", color: "#26A69A" },
];

const EXPENSE_CATEGORIES: CategoryOption[] = [
  { name: "Bách hóa", icon: "shopping_basket", color: "#3b82f6" },
  { name: "Nhà hàng", icon: "restaurant", color: "#64748b" },
  { name: "Giải trí", icon: "confirmation_number", color: "#d946ef" },
  { name: "Vận chuyển", icon: "directions_bus", color: "#f97316" },
  { name: "Sức khoẻ", icon: "favorite", color: "#22c55e" },
  { name: "Mua sắm", icon: "shopping_bag", color: "#64748b" },
  { name: "Phòng trọ", icon: "home", color: "#f43f5e" },
  { name: "Điện, nước", icon: "bolt", color: "#e11d48" },
];

const INCOME_CATEGORIES: CategoryOption[] = [
  { name: "Lương chính", icon: "payments", color: "#16a34a" },
  { name: "Đầu tư", icon: "trending_up", color: "#2563eb" },
  { name: "Quà tặng", icon: "card_giftcard", color: "#e11d48" },
];

type PickerName = "account" | "toAccount" | "category" | null;

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function IconBadge({
  icon,
  color,
  size = "w-14 h-14",
  iconSize = "text-2xl",
}: {
  icon: string;
  color: string;
  size?: string;
  iconSize?: string;
}) {
  return (
    <div
      className={`${size} rounded-full flex items-center justify-center shrink-0`}
      style={{ backgroundColor: color }}
    >
      <span className={`material-symbols-outlined ${iconSize} text-white`}>
        {icon}
      </span>
    </div>
  );
}

function SelectorChip({
  label,
  icon,
  color,
  value,
  active,
  onClick,
}: {
  label: string;
  icon: string;
  color: string;
  value: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-colors ${
        active
          ? "border-primary bg-primary/5"
          : "border-outline-variant/50 hover:bg-surface-container-low"
      }`}
      onClick={onClick}
      type="button"
    >
      <IconBadge color={color} icon={icon} iconSize="text-lg" size="w-10 h-10" />
      <div className="min-w-0">
        <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide">
          {label}
        </p>
        <p className="font-label-md text-label-md text-on-surface truncate">
          {value}
        </p>
      </div>
      <span className="material-symbols-outlined text-on-surface-variant ml-auto text-lg">
        {active ? "expand_less" : "expand_more"}
      </span>
    </button>
  );
}

export function AddTransactionModal({
  open,
  onClose,
}: AddTransactionModalProps) {
  const [type, setType] = useState<TransactionType>("expense");
  const [accountId, setAccountId] = useState(ACCOUNTS[0].id);
  const [toAccountId, setToAccountId] = useState(ACCOUNTS[1].id);
  const [category, setCategory] = useState<CategoryOption>(
    EXPENSE_CATEGORIES[0],
  );
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayIsoDate());
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openPicker, setOpenPicker] = useState<PickerName>(null);

  if (!open) return null;

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const account = ACCOUNTS.find((a) => a.id === accountId) ?? ACCOUNTS[0];
  const toAccount = ACCOUNTS.find((a) => a.id === toAccountId) ?? ACCOUNTS[1];
  const activeType = TRANSACTION_TYPES.find((t) => t.value === type)!;
  const heroIcon = type === "transfer" ? activeType.icon : category.icon;
  const heroColor = type === "transfer" ? activeType.color : category.color;

  function resetForm() {
    setType("expense");
    setAccountId(ACCOUNTS[0].id);
    setToAccountId(ACCOUNTS[1].id);
    setCategory(EXPENSE_CATEGORIES[0]);
    setAmount("");
    setDate(todayIsoDate());
    setNote("");
    setErrors({});
    setOpenPicker(null);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function selectType(next: TransactionType) {
    setType(next);
    setOpenPicker(null);
    if (next === "income") setCategory(INCOME_CATEGORIES[0]);
    if (next === "expense") setCategory(EXPENSE_CATEGORIES[0]);
  }

  function togglePicker(name: PickerName) {
    setOpenPicker((current) => (current === name ? null : name));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nextErrors: Record<string, string> = {};
    const amountValue = Number(amount);
    if (!amount || Number.isNaN(amountValue) || amountValue <= 0) {
      nextErrors.amount = "Số tiền phải lớn hơn 0";
    }
    if (type === "transfer" && accountId === toAccountId) {
      nextErrors.to_account_id = "Tài khoản nhận phải khác tài khoản gửi";
    }
    if (!date) {
      nextErrors.transaction_date = "Vui lòng chọn ngày";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    // Chỉ xử lý phần giao diện — chưa lưu vào cơ sở dữ liệu.
    handleClose();
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <button
        aria-label="Đóng"
        className="absolute inset-0 bg-black/40"
        onClick={handleClose}
        type="button"
      ></button>
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
          <h3 className="text-lg font-bold text-on-surface">
            Thêm giao dịch
          </h3>
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest/40 transition-colors"
            onClick={handleClose}
            type="button"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form className="p-6 space-y-5" onSubmit={handleSubmit}>
          {/* Amount hero */}
          <div
            className="flex flex-col items-center gap-3 py-6 rounded-2xl transition-colors"
            style={{ backgroundColor: `${heroColor}14` }}
          >
            <IconBadge
              color={heroColor}
              icon={heroIcon}
              iconSize="text-3xl"
              size="w-16 h-16"
            />
            <div className="flex items-baseline gap-2">
              <input
                className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none text-3xl font-bold text-center bg-transparent outline-none w-40 text-on-surface placeholder:text-outline-variant"
                inputMode="decimal"
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                type="number"
                value={amount}
              />
              <span className="text-lg font-bold text-on-surface-variant">
                đ
              </span>
            </div>
            {errors.amount && (
              <p className="font-label-sm text-label-sm text-error">
                {errors.amount}
              </p>
            )}
          </div>

          {/* Type segmented pills */}
          <div className="grid grid-cols-3 gap-2">
            {TRANSACTION_TYPES.map((option) => {
              const active = type === option.value;
              return (
                <button
                  className="flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all"
                  key={option.value}
                  onClick={() => selectType(option.value)}
                  style={
                    active
                      ? {
                          borderColor: option.color,
                          color: option.color,
                          backgroundColor: `${option.color}14`,
                        }
                      : { borderColor: "transparent" }
                  }
                  type="button"
                >
                  <span
                    className={`material-symbols-outlined ${
                      active ? "" : "text-on-surface-variant"
                    }`}
                  >
                    {option.icon}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      active ? "" : "text-on-surface-variant"
                    }`}
                  >
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Account / Category selector chips */}
          <div className="grid grid-cols-2 gap-3">
            <SelectorChip
              active={openPicker === "account"}
              color={account.color}
              icon={account.icon}
              label={type === "transfer" ? "Từ tài khoản" : "Tài khoản"}
              onClick={() => togglePicker("account")}
              value={account.name}
            />
            {type === "transfer" ? (
              <SelectorChip
                active={openPicker === "toAccount"}
                color={toAccount.color}
                icon={toAccount.icon}
                label="Đến tài khoản"
                onClick={() => togglePicker("toAccount")}
                value={toAccount.name}
              />
            ) : (
              <SelectorChip
                active={openPicker === "category"}
                color={category.color}
                icon={category.icon}
                label="Danh mục"
                onClick={() => togglePicker("category")}
                value={category.name}
              />
            )}
          </div>
          {errors.to_account_id && (
            <p className="font-label-sm text-label-sm text-error -mt-3">
              {errors.to_account_id}
            </p>
          )}

          {/* Inline pickers */}
          {openPicker === "account" && (
            <div className="grid grid-cols-4 gap-3 p-3 bg-surface-container-low rounded-xl">
              {ACCOUNTS.map((option) => (
                <button
                  className="flex flex-col items-center gap-1.5"
                  key={option.id}
                  onClick={() => {
                    setAccountId(option.id);
                    setOpenPicker(null);
                  }}
                  type="button"
                >
                  <IconBadge color={option.color} icon={option.icon} />
                  <span className="text-xs text-on-surface-variant text-center">
                    {option.name}
                  </span>
                </button>
              ))}
            </div>
          )}
          {openPicker === "toAccount" && (
            <div className="grid grid-cols-4 gap-3 p-3 bg-surface-container-low rounded-xl">
              {ACCOUNTS.map((option) => (
                <button
                  className="flex flex-col items-center gap-1.5"
                  key={option.id}
                  onClick={() => {
                    setToAccountId(option.id);
                    setOpenPicker(null);
                  }}
                  type="button"
                >
                  <IconBadge color={option.color} icon={option.icon} />
                  <span className="text-xs text-on-surface-variant text-center">
                    {option.name}
                  </span>
                </button>
              ))}
            </div>
          )}
          {openPicker === "category" && (
            <div className="grid grid-cols-4 gap-3 p-3 bg-surface-container-low rounded-xl max-h-56 overflow-y-auto">
              {categories.map((option) => (
                <button
                  className="flex flex-col items-center gap-1.5"
                  key={option.name}
                  onClick={() => {
                    setCategory(option);
                    setOpenPicker(null);
                  }}
                  type="button"
                >
                  <IconBadge color={option.color} icon={option.icon} />
                  <span className="text-xs text-on-surface-variant text-center">
                    {option.name}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Date */}
          <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-outline-variant/50">
            <span className="material-symbols-outlined text-on-surface-variant">
              calendar_month
            </span>
            <input
              className="flex-1 bg-transparent outline-none font-body-md text-body-md text-on-surface"
              onChange={(e) => setDate(e.target.value)}
              type="date"
              value={date}
            />
          </div>
          {errors.transaction_date && (
            <p className="font-label-sm text-label-sm text-error -mt-3">
              {errors.transaction_date}
            </p>
          )}

          {/* Note */}
          <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-outline-variant/50">
            <span className="material-symbols-outlined text-on-surface-variant">
              edit_note
            </span>
            <input
              className="flex-1 bg-transparent outline-none font-body-md text-body-md text-on-surface placeholder:text-outline"
              maxLength={255}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi chú (không bắt buộc)"
              type="text"
              value={note}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              className="flex-1 py-3 rounded-xl border border-outline-variant text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-low transition-colors"
              onClick={handleClose}
              type="button"
            >
              Hủy
            </button>
            <button
              className="flex-1 py-3 rounded-xl bg-primary text-white font-label-md text-label-md hover:opacity-90 transition-all"
              type="submit"
            >
              Lưu giao dịch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
