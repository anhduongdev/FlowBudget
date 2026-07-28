import { prisma } from "@/lib/prisma";
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

    for (const adjustment of adjustments) {
      await tx.accounts.update({
        where: { id: adjustment.accountId },
        data: {
          current_balance:
            adjustment.operation === "increment"
              ? { increment: adjustment.amount }
              : { decrement: adjustment.amount },
        },
      });
    }

    return transaction;
  });
}
