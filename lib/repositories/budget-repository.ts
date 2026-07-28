import { prisma } from "@/lib/prisma";
import { budgets_period } from "@/app/generated/prisma/enums";

export function findMonthlyBudget(
  userId: bigint,
  categoryId: bigint | null,
  monthStartDate: Date,
) {
  return prisma.budgets.findFirst({
    where: {
      user_id: userId,
      category_id: categoryId,
      period: budgets_period.monthly,
      start_date: monthStartDate,
      is_active: true,
    },
    select: { id: true, amount: true },
  });
}

export function findOverallMonthlyBudget(userId: bigint, monthStartDate: Date) {
  return findMonthlyBudget(userId, null, monthStartDate);
}

export function findCategoryBudgetsForMonth(
  userId: bigint,
  monthStartDate: Date,
) {
  return prisma.budgets.findMany({
    where: {
      user_id: userId,
      category_id: { not: null },
      period: budgets_period.monthly,
      start_date: monthStartDate,
      is_active: true,
    },
    select: { id: true, category_id: true, amount: true },
  });
}

interface CreateMonthlyBudgetInput {
  userId: bigint;
  categoryId: bigint | null;
  amount: string;
  monthStartDate: Date;
}

export function createMonthlyBudget(input: CreateMonthlyBudgetInput) {
  return prisma.budgets.create({
    data: {
      user_id: input.userId,
      category_id: input.categoryId,
      amount: input.amount,
      period: budgets_period.monthly,
      start_date: input.monthStartDate,
    },
    select: { id: true, amount: true },
  });
}

export function updateBudgetAmountForUser(
  budgetId: bigint,
  userId: bigint,
  amount: string,
) {
  return prisma.budgets.updateMany({
    where: { id: budgetId, user_id: userId },
    data: { amount },
  });
}
