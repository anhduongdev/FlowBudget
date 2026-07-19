import { z } from "zod";

export const categoryTypeEnum = z.enum(["income", "expense"]);

const optionalString = (schema: z.ZodString) => z.preprocess((v) => (v === "" ? undefined : v), schema.optional());

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập tên danh mục").max(100),
  type: categoryTypeEnum,
  icon: optionalString(z.string().max(50)),
  color: optionalString(z.string().regex(/^#[0-9a-fA-F]{6}$/, "Màu phải dạng #RRGGBB")),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = createCategorySchema.extend({
  id: z.string().min(1),
});

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
