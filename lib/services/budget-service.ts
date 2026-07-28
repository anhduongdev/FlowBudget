import { getCurrentMonthRange, type DateRange } from "@/lib/date-range";
import { decimalToNumber } from "@/lib/decimal";
import {
  createMonthlyBudget,
  findCategoryBudgetsForMonth,
  findMonthlyBudget,
  findOverallMonthlyBudget,
  updateBudgetAmountForUser,
} from "@/lib/repositories/budget-repository";
import { findCategoryOwnedByUser } from "@/lib/repositories/category-repository";
import {
  CategoryNotFoundError,
  getCategoriesWithMonthlySpending,
  type CategorySpendingItem,
} from "@/lib/services/category-service";

export async function getBudgetAmountForMonth(
  userId: bigint,
  monthRange: DateRange,
): Promise<number | null> {
  const budget = await findOverallMonthlyBudget(userId, monthRange.start);
  return budget ? decimalToNumber(budget.amount) : null;
}

export interface MonthlyBudgetSummary {
  hasBudget: boolean;
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  spentPercent: number;
  isOverBudget: boolean;
}

export function buildMonthlyBudgetSummary(
  budgetAmount: number | null,
  spentAmount: number,
): MonthlyBudgetSummary {
  if (budgetAmount === null) {
    return {
      hasBudget: false,
      budgetAmount: 0,
      spentAmount,
      remainingAmount: 0,
      spentPercent: 0,
      isOverBudget: false,
    };
  }

  return {
    hasBudget: true,
    budgetAmount,
    spentAmount,
    remainingAmount: budgetAmount - spentAmount,
    spentPercent:
      budgetAmount > 0
        ? Math.min(100, Math.round((spentAmount / budgetAmount) * 100))
        : 0,
    isOverBudget: spentAmount > budgetAmount,
  };
}

async function upsertMonthlyBudget(
  userId: bigint,
  categoryId: bigint | null,
  amount: number,
): Promise<void> {
  const monthRange = getCurrentMonthRange();
  const amountAsDecimalString = amount.toFixed(2);

  const existing = await findMonthlyBudget(userId, categoryId, monthRange.start);

  if (existing) {
    await updateBudgetAmountForUser(existing.id, userId, amountAsDecimalString);
  } else {
    await createMonthlyBudget({
      userId,
      categoryId,
      amount: amountAsDecimalString,
      monthStartDate: monthRange.start,
    });
  }
}

export async function setMonthlyBudgetForUser(
  userId: bigint,
  amount: number,
): Promise<void> {
  await upsertMonthlyBudget(userId, null, amount);
}

export async function setCategoryBudgetForUser(
  userId: bigint,
  categoryId: bigint,
  amount: number,
): Promise<void> {
  const category = await findCategoryOwnedByUser(categoryId, userId);
  if (!category) {
    throw new CategoryNotFoundError("Danh mục không tồn tại.");
  }

  await upsertMonthlyBudget(userId, categoryId, amount);
}

export interface CategoryBudgetSummary extends MonthlyBudgetSummary {
  category: CategorySpendingItem;
}

export async function getCategoryBudgetSummariesForUser(
  userId: bigint,
  monthRange: DateRange,
): Promise<CategoryBudgetSummary[]> {
  const [categories, categoryBudgets] = await Promise.all([
    getCategoriesWithMonthlySpending(userId, "expense", monthRange),
    findCategoryBudgetsForMonth(userId, monthRange.start),
  ]);

  const budgetAmountByCategoryId = new Map(
    categoryBudgets
      .filter((budget) => budget.category_id !== null)
      .map((budget) => [
        (budget.category_id as bigint).toString(),
        decimalToNumber(budget.amount),
      ]),
  );

  return categories.map((category) => ({
    category,
    ...buildMonthlyBudgetSummary(
      budgetAmountByCategoryId.get(category.id) ?? null,
      category.totalAmount,
    ),
  }));
}
