import { z } from "zod";
import { getDatesInRangeByWeekdays, parseInclusiveDateRange } from "@/lib/date-range";

export const MAX_RULES_PER_BATCH = 20;
export const MAX_BULK_RANGE_DAYS = 92;
export const MAX_GENERATED_TRANSACTIONS = 500;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export const bulkTransactionRuleSchema = z.object({
  type: z.enum(["income", "expense"]),
  accountId: z
    .string()
    .min(1, "Vui lòng chọn tài khoản")
    .regex(/^\d+$/, "Mã không hợp lệ"),
  categoryId: z.string().regex(/^\d+$/, "Mã không hợp lệ").optional(),
  amount: z.coerce
    .number({ message: "Vui lòng nhập số tiền hợp lệ" })
    .positive("Số tiền phải lớn hơn 0")
    .max(9_999_999_999_999, "Số tiền quá lớn"),
  weekdays: z
    .array(z.number().int().min(0).max(6))
    .min(1, "Chọn ít nhất 1 ngày trong tuần")
    .max(7)
    .transform((arr) => Array.from(new Set(arr)).sort((a, b) => a - b)),
  note: z.string().trim().max(255, "Ghi chú tối đa 255 ký tự").optional(),
});

export type BulkTransactionRuleFormInput = z.infer<
  typeof bulkTransactionRuleSchema
>;

export const bulkCreateTransactionsSchema = z
  .object({
    from: z.string().regex(ISO_DATE, "Ngày không hợp lệ"),
    to: z.string().regex(ISO_DATE, "Ngày không hợp lệ"),
    rules: z
      .array(bulkTransactionRuleSchema)
      .min(1, "Cần ít nhất 1 quy tắc")
      .max(MAX_RULES_PER_BATCH, `Tối đa ${MAX_RULES_PER_BATCH} quy tắc mỗi lần`),
  })
  .superRefine((data, ctx) => {
    const range = parseInclusiveDateRange(data.from, data.to);
    if (!range) {
      ctx.addIssue({
        code: "custom",
        path: ["to"],
        message: "Ngày kết thúc phải sau ngày bắt đầu",
      });
      return;
    }

    const diffDays = Math.round(
      (range.end.getTime() - range.start.getTime()) / (24 * 60 * 60 * 1000),
    );
    if (diffDays > MAX_BULK_RANGE_DAYS) {
      ctx.addIssue({
        code: "custom",
        path: ["to"],
        message: `Khoảng ngày tối đa ${MAX_BULK_RANGE_DAYS} ngày`,
      });
      return;
    }

    const totalGenerated = data.rules.reduce(
      (sum, rule) => sum + getDatesInRangeByWeekdays(range, rule.weekdays).length,
      0,
    );
    if (totalGenerated === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["rules"],
        message: "Không có giao dịch nào khớp lịch đã chọn",
      });
      return;
    }
    if (totalGenerated > MAX_GENERATED_TRANSACTIONS) {
      ctx.addIssue({
        code: "custom",
        path: ["rules"],
        message: `Sẽ tạo ${totalGenerated} giao dịch, vượt giới hạn ${MAX_GENERATED_TRANSACTIONS}. Hãy thu hẹp kỳ hoặc giảm quy tắc.`,
      });
    }
  });

export type BulkCreateTransactionsInput = z.infer<
  typeof bulkCreateTransactionsSchema
>;
