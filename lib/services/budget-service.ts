import { getCurrentMonthRange, type DateRange } from "@/lib/date-range";
import { decimalToNumber } from "@/lib/decimal";
import {
  createOverallMonthlyBudget,
  findOverallMonthlyBudget,
  updateBudgetAmountForUser,
} from "@/lib/repositories/budget-repository";

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

export async function setMonthlyBudgetForUser(
  userId: bigint,
  amount: number,
): Promise<void> {
  const monthRange = getCurrentMonthRange();
  const amountAsDecimalString = amount.toFixed(2);

  const existing = await findOverallMonthlyBudget(userId, monthRange.start);

  if (existing) {
    await updateBudgetAmountForUser(existing.id, userId, amountAsDecimalString);
  } else {
    await createOverallMonthlyBudget({
      userId,
      amount: amountAsDecimalString,
      monthStartDate: monthRange.start,
    });
  }
}
