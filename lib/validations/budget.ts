import { z } from "zod";

const budgetAmountField = z.coerce
  .number({ message: "Vui lòng nhập số tiền hợp lệ" })
  .int("Số tiền phải là số nguyên")
  .positive("Số tiền phải lớn hơn 0")
  .max(9_999_999_999_999, "Số tiền quá lớn");

export const setMonthlyBudgetSchema = z.object({
  amount: budgetAmountField,
});

export type SetMonthlyBudgetInput = z.infer<typeof setMonthlyBudgetSchema>;

export const setCategoryBudgetSchema = z.object({
  categoryId: z.string().min(1, "Thiếu mã danh mục"),
  amount: budgetAmountField,
});

export type SetCategoryBudgetInput = z.infer<typeof setCategoryBudgetSchema>;
