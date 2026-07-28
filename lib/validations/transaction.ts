import { z } from "zod";

const baseFields = {
  amount: z.coerce
    .number({ message: "Vui lòng nhập số tiền hợp lệ" })
    .positive("Số tiền phải lớn hơn 0")
    .max(9_999_999_999_999, "Số tiền quá lớn"),
  transactionDate: z.coerce.date({ message: "Ngày không hợp lệ" }),
  note: z.string().trim().max(255, "Ghi chú tối đa 255 ký tự").optional(),
  accountId: z.string().min(1, "Vui lòng chọn tài khoản"),
};

export const createTransactionSchema = z
  .discriminatedUnion("type", [
    z.object({
      type: z.literal("expense"),
      ...baseFields,
      categoryId: z.string().optional(),
    }),
    z.object({
      type: z.literal("income"),
      ...baseFields,
      categoryId: z.string().optional(),
    }),
    z.object({
      type: z.literal("transfer"),
      ...baseFields,
      toAccountId: z.string().min(1, "Vui lòng chọn tài khoản nhận"),
    }),
  ])
  .refine((data) => data.type !== "transfer" || data.accountId !== data.toAccountId, {
    message: "Tài khoản nhận phải khác tài khoản gửi",
    path: ["toAccountId"],
  });

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
