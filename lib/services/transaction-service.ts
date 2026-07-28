import { categories_type, transactions_type } from "@/app/generated/prisma/enums";
import {
  DEFAULT_CATEGORY_COLOR,
  DEFAULT_CATEGORY_ICON,
} from "@/lib/category-options";
import {
  formatDateIso,
  getMondayFirstWeekdayIndex,
  type DateRange,
} from "@/lib/date-range";
import { decimalToNumber } from "@/lib/decimal";
import { findAccountByIdForUser } from "@/lib/repositories/account-repository";
import { findCategoryByIdForUser } from "@/lib/repositories/category-repository";
import {
  countTransactionsForUser,
  createTransactionWithBalanceUpdates,
  deleteTransactionWithBalanceUpdates,
  findRecentTransactionsForUser,
  findTransactionByIdForUser,
  findTransactionsForUserInRange,
  sumTransactionAmountByDateForUser,
  sumTransactionAmountForUser,
  updateTransactionWithBalanceUpdates,
  type AccountBalanceAdjustment,
} from "@/lib/repositories/transaction-repository";

export async function getMonthlyExpenseTotal(
  userId: bigint,
  monthRange: DateRange,
): Promise<number> {
  const result = await sumTransactionAmountForUser(
    userId,
    transactions_type.expense,
    monthRange.start,
    monthRange.end,
  );
  return decimalToNumber(result._sum.amount);
}

export async function getMonthlyIncomeTotal(
  userId: bigint,
  monthRange: DateRange,
): Promise<number> {
  const result = await sumTransactionAmountForUser(
    userId,
    transactions_type.income,
    monthRange.start,
    monthRange.end,
  );
  return decimalToNumber(result._sum.amount);
}

export interface WeeklyExpenseBreakdown {
  weekdayTotals: number[];
  barHeightPercents: number[];
  weekTotal: number;
  todayIndex: number;
}

export async function getCurrentWeekExpenseBreakdown(
  userId: bigint,
  weekRange: DateRange,
): Promise<WeeklyExpenseBreakdown> {
  const rows = await sumTransactionAmountByDateForUser(
    userId,
    transactions_type.expense,
    weekRange.start,
    weekRange.end,
  );

  const weekdayTotals = new Array(7).fill(0) as number[];
  for (const row of rows) {
    const index = getMondayFirstWeekdayIndex(row.transaction_date);
    weekdayTotals[index] += decimalToNumber(row._sum.amount);
  }

  const maxDayTotal = Math.max(...weekdayTotals);
  const barHeightPercents = weekdayTotals.map((total) =>
    maxDayTotal > 0 ? Math.round((total / maxDayTotal) * 100) : 0,
  );
  const weekTotal = weekdayTotals.reduce((sum, total) => sum + total, 0);

  return {
    weekdayTotals,
    barHeightPercents,
    weekTotal,
    todayIndex: getMondayFirstWeekdayIndex(new Date()),
  };
}

export async function getPreviousWeekExpenseTotal(
  userId: bigint,
  weekRange: DateRange,
): Promise<number> {
  const result = await sumTransactionAmountForUser(
    userId,
    transactions_type.expense,
    weekRange.start,
    weekRange.end,
  );
  return decimalToNumber(result._sum.amount);
}

export type WeekOverWeekInsight =
  | { kind: "no-data" }
  | { kind: "new-spending" }
  | { kind: "change"; percent: number; direction: "up" | "down" };

export function buildWeekOverWeekInsight(
  currentWeekTotal: number,
  previousWeekTotal: number,
): WeekOverWeekInsight {
  if (currentWeekTotal === 0 && previousWeekTotal === 0) {
    return { kind: "no-data" };
  }
  if (previousWeekTotal === 0) {
    return { kind: "new-spending" };
  }

  const percent = Math.round(
    Math.abs(((currentWeekTotal - previousWeekTotal) / previousWeekTotal) * 100),
  );
  return {
    kind: "change",
    percent,
    direction: currentWeekTotal >= previousWeekTotal ? "up" : "down",
  };
}

export class InvalidAccountError extends Error {}
export class InvalidCategoryError extends Error {}
export class TransactionNotFoundError extends Error {}

export interface CreateTransactionForUserInput {
  type: transactions_type;
  accountId: bigint;
  toAccountId: bigint | null;
  categoryId: bigint | null;
  amount: number;
  transactionDate: Date;
  note: string | null;
}

export type UpdateTransactionForUserInput = CreateTransactionForUserInput;

function buildBalanceAdjustments(
  type: transactions_type,
  accountId: bigint,
  toAccountId: bigint | null,
  amount: string,
): AccountBalanceAdjustment[] {
  if (type === transactions_type.expense) {
    return [{ accountId, operation: "decrement", amount }];
  }
  if (type === transactions_type.income) {
    return [{ accountId, operation: "increment", amount }];
  }
  return [
    { accountId, operation: "decrement", amount },
    { accountId: toAccountId as bigint, operation: "increment", amount },
  ];
}

function reverseBalanceAdjustments(
  adjustments: AccountBalanceAdjustment[],
): AccountBalanceAdjustment[] {
  return adjustments.map((adjustment) => ({
    ...adjustment,
    operation: adjustment.operation === "increment" ? "decrement" : "increment",
  }));
}

interface ResolvedTransactionRefs {
  toAccountId: bigint | null;
  categoryId: bigint | null;
}

async function resolveTransactionAccountsAndCategory(
  userId: bigint,
  input: CreateTransactionForUserInput,
): Promise<ResolvedTransactionRefs> {
  const account = await findAccountByIdForUser(input.accountId, userId);
  if (!account) {
    throw new InvalidAccountError("Tài khoản không hợp lệ.");
  }

  let toAccountId: bigint | null = null;
  if (input.type === transactions_type.transfer) {
    if (!input.toAccountId || input.toAccountId === input.accountId) {
      throw new InvalidAccountError(
        "Tài khoản nhận phải khác tài khoản gửi.",
      );
    }
    const toAccount = await findAccountByIdForUser(input.toAccountId, userId);
    if (!toAccount) {
      throw new InvalidAccountError("Tài khoản nhận không hợp lệ.");
    }
    toAccountId = input.toAccountId;
  }

  let categoryId: bigint | null = null;
  if (input.type !== transactions_type.transfer && input.categoryId) {
    const categoryType =
      input.type === transactions_type.expense
        ? categories_type.expense
        : categories_type.income;
    const category = await findCategoryByIdForUser(
      input.categoryId,
      userId,
      categoryType,
    );
    if (!category) {
      throw new InvalidCategoryError("Danh mục không hợp lệ.");
    }
    categoryId = category.id;
  }

  return { toAccountId, categoryId };
}

export async function createTransactionForUser(
  userId: bigint,
  input: CreateTransactionForUserInput,
) {
  const { toAccountId, categoryId } =
    await resolveTransactionAccountsAndCategory(userId, input);

  const amountAsDecimalString = input.amount.toFixed(2);
  const adjustments = buildBalanceAdjustments(
    input.type,
    input.accountId,
    toAccountId,
    amountAsDecimalString,
  );

  return createTransactionWithBalanceUpdates(
    {
      userId,
      type: input.type,
      accountId: input.accountId,
      toAccountId,
      categoryId,
      amount: amountAsDecimalString,
      transactionDate: input.transactionDate,
      note: input.note,
    },
    adjustments,
  );
}

export async function updateTransactionForUser(
  userId: bigint,
  id: bigint,
  input: UpdateTransactionForUserInput,
) {
  const existing = await findTransactionByIdForUser(id, userId);
  if (!existing) {
    throw new TransactionNotFoundError("Giao dịch không tồn tại.");
  }

  const { toAccountId, categoryId } =
    await resolveTransactionAccountsAndCategory(userId, input);

  const reversalAdjustments = reverseBalanceAdjustments(
    buildBalanceAdjustments(
      existing.type,
      existing.account_id,
      existing.to_account_id,
      existing.amount.toFixed(2),
    ),
  );

  const amountAsDecimalString = input.amount.toFixed(2);
  const newAdjustments = buildBalanceAdjustments(
    input.type,
    input.accountId,
    toAccountId,
    amountAsDecimalString,
  );

  return updateTransactionWithBalanceUpdates(
    id,
    userId,
    {
      type: input.type,
      accountId: input.accountId,
      toAccountId,
      categoryId,
      amount: amountAsDecimalString,
      transactionDate: input.transactionDate,
      note: input.note,
    },
    reversalAdjustments,
    newAdjustments,
  );
}

export async function deleteTransactionForUser(userId: bigint, id: bigint) {
  const existing = await findTransactionByIdForUser(id, userId);
  if (!existing) {
    throw new TransactionNotFoundError("Giao dịch không tồn tại.");
  }

  const reversalAdjustments = reverseBalanceAdjustments(
    buildBalanceAdjustments(
      existing.type,
      existing.account_id,
      existing.to_account_id,
      existing.amount.toFixed(2),
    ),
  );

  return deleteTransactionWithBalanceUpdates(id, userId, reversalAdjustments);
}

export interface TransactionListItem {
  id: string;
  type: transactions_type;
  amount: number;
  transactionDateIso: string;
  note: string | null;
  categoryId: string | null;
  categoryName: string | null;
  icon: string;
  color: string;
  accountId: string;
  accountName: string;
  toAccountId: string | null;
  toAccountName: string | null;
}

export interface TransactionDayGroup {
  dateIso: string;
  netAmount: number;
  items: TransactionListItem[];
}

const TRANSFER_ICON = "swap_horiz";
const TRANSFER_COLOR = "#3b82f6";

type TransactionRow = Awaited<
  ReturnType<typeof findTransactionsForUserInRange>
>[number];

function mapRowsToDayGroups(rows: TransactionRow[]): TransactionDayGroup[] {
  const groups: TransactionDayGroup[] = [];
  const groupsByDate = new Map<string, TransactionDayGroup>();

  for (const row of rows) {
    const isTransfer = row.type === transactions_type.transfer;
    const item: TransactionListItem = {
      id: row.id.toString(),
      type: row.type,
      amount: decimalToNumber(row.amount),
      transactionDateIso: formatDateIso(row.transaction_date),
      note: row.note,
      categoryName: row.categories?.name ?? null,
      icon: isTransfer
        ? TRANSFER_ICON
        : (row.categories?.icon ?? DEFAULT_CATEGORY_ICON),
      color: isTransfer
        ? TRANSFER_COLOR
        : (row.categories?.color ?? DEFAULT_CATEGORY_COLOR),
      categoryId: row.category_id?.toString() ?? null,
      accountId: row.account_id.toString(),
      accountName: row.accounts_transactions_account_idToaccounts.name,
      toAccountId: row.to_account_id?.toString() ?? null,
      toAccountName:
        row.accounts_transactions_to_account_idToaccounts?.name ?? null,
    };

    let group = groupsByDate.get(item.transactionDateIso);
    if (!group) {
      group = { dateIso: item.transactionDateIso, netAmount: 0, items: [] };
      groupsByDate.set(item.transactionDateIso, group);
      groups.push(group);
    }
    group.items.push(item);

    if (row.type === transactions_type.income) {
      group.netAmount += item.amount;
    } else if (row.type === transactions_type.expense) {
      group.netAmount -= item.amount;
    }
  }

  return groups;
}

export async function getTransactionsForUser(
  userId: bigint,
  range: DateRange,
): Promise<TransactionDayGroup[]> {
  const rows = await findTransactionsForUserInRange(
    userId,
    range.start,
    range.end,
  );
  return mapRowsToDayGroups(rows);
}

export async function getRecentTransactionsForUser(
  userId: bigint,
  limit: number,
): Promise<TransactionDayGroup[]> {
  const rows = await findRecentTransactionsForUser(userId, limit);
  return mapRowsToDayGroups(rows);
}

export async function getTransactionCountForUser(
  userId: bigint,
): Promise<number> {
  return countTransactionsForUser(userId);
}
