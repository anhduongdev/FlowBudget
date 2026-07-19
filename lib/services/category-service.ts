import * as categoryRepository from "@/lib/repositories/category-repository";
import * as transactionRepository from "@/lib/repositories/transaction-repository";
import { ServiceError } from "@/lib/services/errors";
import { resolvePeriodRange } from "@/lib/services/transaction-service";
import type { CreateCategoryInput, UpdateCategoryInput } from "@/lib/validations/category";

export type CategoryDto = {
  id: string;
  name: string;
  type: "income" | "expense";
  icon: string | null;
  color: string | null;
};

function toDto(category: Awaited<ReturnType<typeof categoryRepository.findCategoriesByUser>>[number]): CategoryDto {
  return { id: category.id.toString(), name: category.name, type: category.type, icon: category.icon, color: category.color };
}

export async function listCategories(userId: bigint, type?: "income" | "expense"): Promise<CategoryDto[]> {
  const categories = await categoryRepository.findCategoriesByUser(userId, type, { activeOnly: true });
  return categories.map(toDto);
}

export async function createCategory(userId: bigint, input: CreateCategoryInput): Promise<void> {
  await categoryRepository.createCategory(userId, input);
}

export async function updateCategory(userId: bigint, input: UpdateCategoryInput): Promise<void> {
  const id = BigInt(input.id);
  const existing = await categoryRepository.findCategoryById(userId, id);
  if (!existing) throw new ServiceError("Không tìm thấy danh mục");
  await categoryRepository.updateCategory(userId, id, input);
}

export async function deleteCategory(userId: bigint, idStr: string): Promise<{ softDeleted: boolean }> {
  const id = BigInt(idStr);
  const existing = await categoryRepository.findCategoryById(userId, id);
  if (!existing) throw new ServiceError("Không tìm thấy danh mục");

  const refCount = await categoryRepository.countTransactionsForCategory(userId, id);
  if (refCount > 0) {
    await categoryRepository.softDeleteCategory(userId, id);
    return { softDeleted: true };
  }

  await categoryRepository.hardDeleteCategory(userId, id);
  return { softDeleted: false };
}

export type CategoryWithSpending = CategoryDto & { amount: string; pct: number };

// Tổng chi tiêu/thu nhập theo danh mục trong tháng hiện tại — dùng cho trang
// Danh mục (hero summary + progress bar mỗi thẻ danh mục).
export async function listCategoriesWithSpending(
  userId: bigint,
  type: "income" | "expense",
): Promise<{ categories: CategoryWithSpending[]; total: string; topCategory: CategoryWithSpending | null }> {
  const range = resolvePeriodRange("month");
  const [categories, sums] = await Promise.all([
    listCategories(userId, type),
    transactionRepository.sumByCategoryInRange(userId, type, range),
  ]);

  const amountByCategoryId = new Map(sums.map((row) => [row.category?.id.toString(), Number(row.total)]));
  const total = sums.reduce((sum, row) => sum + Number(row.total), 0);

  const withSpending: CategoryWithSpending[] = categories.map((c) => {
    const amount = amountByCategoryId.get(c.id) ?? 0;
    return { ...c, amount: amount.toString(), pct: total > 0 ? Math.round((amount / total) * 100) : 0 };
  });

  const topCategory = withSpending.reduce<CategoryWithSpending | null>(
    (top, c) => (top === null || Number(c.amount) > Number(top.amount) ? c : top),
    null,
  );

  return { categories: withSpending, total: total.toString(), topCategory };
}
