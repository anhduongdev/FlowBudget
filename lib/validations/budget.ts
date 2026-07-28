import { z } from "zod";

export const setMonthlyBudgetSchema = z.object({
  amount: z.coerce
    .number({ message: "Vui lòng nhập số tiền hợp lệ" })
    .int("Số tiền phải là số nguyên")
    .positive("Số tiền phải lớn hơn 0")
    .max(9_999_999_999_999, "Số tiền quá lớn"),
});

export type SetMonthlyBudgetInput = z.infer<typeof setMonthlyBudgetSchema>;
