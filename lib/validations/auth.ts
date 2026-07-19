import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Vui lòng nhập họ tên"),
    email: z.email("Email không hợp lệ"),
    password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
    confirm_password: z.string(),
    terms: z.literal("on", { error: "Bạn cần đồng ý với điều khoản dịch vụ" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    error: "Mật khẩu xác nhận không khớp",
    path: ["confirm_password"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export type LoginInput = z.infer<typeof loginSchema>;
