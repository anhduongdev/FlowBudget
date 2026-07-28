import { z } from "zod";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/category-options";

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập tên danh mục")
    .max(100, "Tên danh mục tối đa 100 ký tự"),
  type: z.enum(["income", "expense"], {
    message: "Loại danh mục không hợp lệ",
  }),
  icon: z.enum(CATEGORY_ICONS, { message: "Vui lòng chọn biểu tượng" }),
  color: z.enum(CATEGORY_COLORS, { message: "Vui lòng chọn màu sắc" }),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = createCategorySchema.omit({
  type: true,
});

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export const categoryIdSchema = z.object({
  id: z.string().min(1, "Thiếu mã danh mục"),
});
