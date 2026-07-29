import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/app/generated/prisma/client";
import type { transactions_type } from "@/app/generated/prisma/enums";

export function sumTransactionAmountByCategoryForUser(
  userId: bigint,
  type: transactions_type,
  start: Date,
  end: Date,
) {
  return prisma.transactions.groupBy({
    by: ["category_id"],
    where: {
      user_id: userId,
      type,
      transaction_date: { gte: start, lt: end },
    },
    _sum: { amount: true },
    _count: { _all: true },
  });
}

export function sumTransactionAmountForUser(
  userId: bigint,
  type: transactions_type,
  start: Date,
  end: Date,
) {
  return prisma.transactions.aggregate({
    where: {
      user_id: userId,
      type,
      transaction_date: { gte: start, lt: end },
    },
    _sum: { amount: true },
  });
}

export function sumTransactionAmountByDateForUser(
  userId: bigint,
  type: transactions_type,
  start: Date,
  end: Date,
) {
  return prisma.transactions.groupBy({
    by: ["transaction_date"],
    where: {
      user_id: userId,
      type,
      transaction_date: { gte: start, lt: end },
    },
    _sum: { amount: true },
  });
}

const TRANSACTION_LIST_SELECT = {
  id: true,
  type: true,
  amount: true,
  transaction_date: true,
  note: true,
  account_id: true,
  to_account_id: true,
  category_id: true,
  categories: { select: { name: true, icon: true, color: true } },
  accounts_transactions_account_idToaccounts: {
    select: { name: true, icon: true, color: true },
  },
  accounts_transactions_to_account_idToaccounts: {
    select: { name: true },
  },
} as const;

export function findTransactionsForUserInRange(
  userId: bigint,
  start: Date,
  end: Date,
) {
  return prisma.transactions.findMany({
    where: {
      user_id: userId,
      transaction_date: { gte: start, lt: end },
    },
    select: TRANSACTION_LIST_SELECT,
    orderBy: [{ transaction_date: "desc" }, { id: "desc" }],
  });
}

export function findRecentTransactionsForUser(userId: bigint, limit: number) {
  return prisma.transactions.findMany({
    where: { user_id: userId },
    select: TRANSACTION_LIST_SELECT,
    orderBy: [{ transaction_date: "desc" }, { id: "desc" }],
    take: limit,
  });
}

export function countTransactionsForUser(userId: bigint) {
  return prisma.transactions.count({ where: { user_id: userId } });
}

const TRANSACTION_DETAIL_SELECT = {
  id: true,
  type: true,
  amount: true,
  transaction_date: true,
  note: true,
  account_id: true,
  to_account_id: true,
  category_id: true,
} as const;

export function findTransactionByIdForUser(id: bigint, userId: bigint) {
  return prisma.transactions.findFirst({
    where: { id, user_id: userId },
    select: TRANSACTION_DETAIL_SELECT,
  });
}

interface CreateTransactionInput {
  userId: bigint;
  type: transactions_type;
  accountId: bigint;
  toAccountId: bigint | null;
  categoryId: bigint | null;
  amount: string;
  transactionDate: Date;
  note: string | null;
}

export interface AccountBalanceAdjustment {
  accountId: bigint;
  operation: "increment" | "decrement";
  amount: string;
}

async function applyBalanceAdjustments(
  tx: Prisma.TransactionClient,
  userId: bigint,
  adjustments: AccountBalanceAdjustment[],
) {
  for (const adjustment of adjustments) {
    await tx.accounts.updateMany({
      where: { id: adjustment.accountId, user_id: userId },
      data: {
        current_balance:
          adjustment.operation === "increment"
            ? { increment: adjustment.amount }
            : { decrement: adjustment.amount },
      },
    });
  }
}

export function createTransactionWithBalanceUpdates(
  input: CreateTransactionInput,
  adjustments: AccountBalanceAdjustment[],
) {
  return prisma.$transaction(async (tx) => {
    const transaction = await tx.transactions.create({
      data: {
        user_id: input.userId,
        type: input.type,
        account_id: input.accountId,
        to_account_id: input.toAccountId,
        category_id: input.categoryId,
        amount: input.amount,
        transaction_date: input.transactionDate,
        note: input.note,
      },
      select: { id: true },
    });

    await applyBalanceAdjustments(tx, input.userId, adjustments);

    return transaction;
  });
}

interface UpdateTransactionInput {
  type: transactions_type;
  accountId: bigint;
  toAccountId: bigint | null;
  categoryId: bigint | null;
  amount: string;
  transactionDate: Date;
  note: string | null;
}

export function updateTransactionWithBalanceUpdates(
  id: bigint,
  userId: bigint,
  input: UpdateTransactionInput,
  reversalAdjustments: AccountBalanceAdjustment[],
  newAdjustments: AccountBalanceAdjustment[],
) {
  return prisma.$transaction(async (tx) => {
    await applyBalanceAdjustments(tx, userId, reversalAdjustments);

    const result = await tx.transactions.updateMany({
      where: { id, user_id: userId },
      data: {
        type: input.type,
        account_id: input.accountId,
        to_account_id: input.toAccountId,
        category_id: input.categoryId,
        amount: input.amount,
        transaction_date: input.transactionDate,
        note: input.note,
      },
    });

    await applyBalanceAdjustments(tx, userId, newAdjustments);

    return result;
  });
}

export function deleteTransactionWithBalanceUpdates(
  id: bigint,
  userId: bigint,
  reversalAdjustments: AccountBalanceAdjustment[],
) {
  return prisma.$transaction(async (tx) => {
    const result = await tx.transactions.deleteMany({
      where: { id, user_id: userId },
    });

    await applyBalanceAdjustments(tx, userId, reversalAdjustments);

    return result;
  });
}
