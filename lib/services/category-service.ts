import type { categories_type } from "@/app/generated/prisma/enums";
import {
  DEFAULT_CATEGORY_COLOR,
  DEFAULT_CATEGORY_ICON,
} from "@/lib/category-options";
import type { DateRange } from "@/lib/date-range";
import { decimalToNumber } from "@/lib/decimal";
import {
  createCategory,
  findActiveCategoriesByUserAndType,
  findCategoryByUserNameAndType,
} from "@/lib/repositories/category-repository";
import { sumTransactionAmountByCategoryForUser } from "@/lib/repositories/transaction-repository";
import type { CreateCategoryInput } from "@/lib/validations/category";

export class CategoryAlreadyExistsError extends Error {}

export async function createCategoryForUser(
  userId: bigint,
  input: CreateCategoryInput,
) {
  const existingCategory = await findCategoryByUserNameAndType(
    userId,
    input.name,
    input.type,
  );
  if (existingCategory) {
    throw new CategoryAlreadyExistsError(
      "Danh mục này đã tồn tại, vui lòng chọn tên khác.",
    );
  }

  return createCategory({
    userId,
    name: input.name,
    type: input.type,
    icon: input.icon,
    color: input.color,
  });
}

export interface CategoryOption {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export async function listCategoriesForSelect(
  userId: bigint,
  type: categories_type,
): Promise<CategoryOption[]> {
  const categories = await findActiveCategoriesByUserAndType(userId, type);

  return categories.map((category) => ({
    id: category.id.toString(),
    name: category.name,
    icon: category.icon ?? DEFAULT_CATEGORY_ICON,
    color: category.color ?? DEFAULT_CATEGORY_COLOR,
  }));
}

export interface CategorySpendingItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  totalAmount: number;
  transactionCount: number;
}

export async function getCategoriesWithMonthlySpending(
  userId: bigint,
  type: categories_type,
  monthRange: DateRange,
): Promise<CategorySpendingItem[]> {
  const [categories, spendingByCategory] = await Promise.all([
    findActiveCategoriesByUserAndType(userId, type),
    sumTransactionAmountByCategoryForUser(
      userId,
      type,
      monthRange.start,
      monthRange.end,
    ),
  ]);

  const spendingByCategoryId = new Map(
    spendingByCategory
      .filter((row) => row.category_id !== null)
      .map((row) => [row.category_id as bigint, row]),
  );

  return categories.map((category) => {
    const spending = spendingByCategoryId.get(category.id);
    return {
      id: category.id.toString(),
      name: category.name,
      icon: category.icon ?? DEFAULT_CATEGORY_ICON,
      color: category.color ?? DEFAULT_CATEGORY_COLOR,
      totalAmount: decimalToNumber(spending?._sum.amount),
      transactionCount: spending?._count._all ?? 0,
    };
  });
}

export async function getTopSpendingCategories(
  userId: bigint,
  type: categories_type,
  monthRange: DateRange,
  limit: number,
): Promise<CategorySpendingItem[]> {
  const categories = await getCategoriesWithMonthlySpending(
    userId,
    type,
    monthRange,
  );
  return [...categories]
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, limit);
}
