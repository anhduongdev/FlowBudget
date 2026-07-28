import { z } from "zod";
import { ACCOUNT_ICONS } from "@/lib/account-options";
import { CATEGORY_COLORS } from "@/lib/category-options";

export const createAccountSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập tên tài khoản")
    .max(100, "Tên tài khoản tối đa 100 ký tự"),
  type: z.enum(["cash", "bank", "ewallet", "credit_card", "savings", "other"], {
    message: "Loại tài khoản không hợp lệ",
  }),
  initialBalance: z.coerce
    .number({ message: "Vui lòng nhập số dư hợp lệ" })
    .min(0, "Số dư ban đầu không được âm")
    .max(9_999_999_999_999, "Số dư quá lớn"),
  icon: z.enum(ACCOUNT_ICONS, { message: "Vui lòng chọn biểu tượng" }),
  color: z.enum(CATEGORY_COLORS, { message: "Vui lòng chọn màu sắc" }),
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;

export const updateAccountSchema = createAccountSchema.omit({
  initialBalance: true,
});

export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;

export const accountIdSchema = z.object({
  id: z.string().min(1, "Thiếu mã tài khoản"),
});
