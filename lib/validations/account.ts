import { z } from "zod";

export const accountTypeEnum = z.enum(["cash", "bank", "ewallet", "credit_card", "savings", "other"]);

// FormData luôn trả string, kể cả input rỗng ("") — chuyển "" thành undefined
// trước khi validate để field optional không bị coi là "có giá trị rỗng".
const optionalString = (schema: z.ZodString) => z.preprocess((v) => (v === "" ? undefined : v), schema.optional());

const accountBaseSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập tên tài khoản").max(100),
  type: accountTypeEnum,
  icon: optionalString(z.string().max(50)),
  color: optionalString(z.string().regex(/^#[0-9a-fA-F]{6}$/, "Màu phải dạng #RRGGBB")),
});

// initial_balance chỉ có ý nghĩa lúc TẠO (số dư mở tài khoản) — không cho sửa
// lại sau đó vì current_balance không tự tính lại theo initial_balance mới
// (trigger DB chỉ chạy khi INSERT tài khoản hoặc khi có transaction, không
// chạy khi UPDATE accounts). Muốn điều chỉnh số dư sau này thì ghi 1 giao dịch.
export const createAccountSchema = accountBaseSchema.extend({
  initial_balance: z.coerce.number().finite("Số dư không hợp lệ").default(0),
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;

export const updateAccountSchema = accountBaseSchema.extend({
  id: z.string().min(1),
});

export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
