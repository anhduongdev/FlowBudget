import { prisma } from "@/lib/prisma";
import { budgets_period } from "@/app/generated/prisma/enums";

export function findOverallMonthlyBudget(userId: bigint, monthStartDate: Date) {
  return prisma.budgets.findFirst({
    where: {
      user_id: userId,
      category_id: null,
      period: budgets_period.monthly,
      start_date: monthStartDate,
      is_active: true,
    },
    select: { id: true, amount: true },
  });
}

interface CreateOverallMonthlyBudgetInput {
  userId: bigint;
  amount: string;
  monthStartDate: Date;
}

export function createOverallMonthlyBudget(
  input: CreateOverallMonthlyBudgetInput,
) {
  return prisma.budgets.create({
    data: {
      user_id: input.userId,
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
