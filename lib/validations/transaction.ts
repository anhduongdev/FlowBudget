import { z } from "zod";

export const transactionTypeEnum = z.enum(["income", "expense", "transfer"]);

const optionalString = (schema: z.ZodString) => z.preprocess((v) => (v === "" ? undefined : v), schema.optional());

const baseTransactionSchema = z.object({
  type: transactionTypeEnum,
  account_id: z.string().min(1, "Chọn tài khoản"),
  to_account_id: optionalString(z.string().min(1)),
  category_id: optionalString(z.string().min(1)),
  amount: z.coerce.number().positive("Số tiền phải lớn hơn 0"),
  transaction_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày không hợp lệ"),
  note: optionalString(z.string().max(255)),
});

// Thay thế app-layer cho CHECK constraint chk_tx_transfer ở DB: chuyển khoản
// bắt buộc có to_account_id khác account_id và không có category_id; ngược
// lại (thu/chi) thì không được có to_account_id và bắt buộc có category_id.
export const createTransactionSchema = baseTransactionSchema.superRefine((v, ctx) => {
  if (v.type === "transfer") {
    if (!v.to_account_id) {
      ctx.addIssue({ code: "custom", path: ["to_account_id"], message: "Chọn tài khoản nhận" });
    } else if (v.to_account_id === v.account_id) {
      ctx.addIssue({ code: "custom", path: ["to_account_id"], message: "Tài khoản nhận phải khác tài khoản gửi" });
    }
    if (v.category_id) {
      ctx.addIssue({ code: "custom", path: ["category_id"], message: "Chuyển khoản không có danh mục" });
    }
  } else {
    if (v.to_account_id) {
      ctx.addIssue({ code: "custom", path: ["to_account_id"], message: "Chỉ chuyển khoản mới có tài khoản nhận" });
    }
    if (!v.category_id) {
      ctx.addIssue({ code: "custom", path: ["category_id"], message: "Chọn danh mục" });
    }
  }
});

export type CreateTransactionInput = z.infer<typeof baseTransactionSchema>;
