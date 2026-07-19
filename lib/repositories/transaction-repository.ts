import { prisma } from "@/lib/prisma";
import type { transactions_type } from "@/app/generated/prisma/enums";

export type DateRange = { from: Date; to: Date };

const detailSelect = {
  id: true,
  type: true,
  amount: true,
  transaction_date: true,
  created_at: true,
  note: true,
  accounts_transactions_account_idToaccounts: { select: { name: true } },
  categories: { select: { name: true, icon: true, color: true } },
} as const;

export function findTransactions(userId: bigint, range: DateRange) {
  return prisma.transactions.findMany({
    where: { user_id: userId, transaction_date: { gte: range.from, lte: range.to } },
    select: detailSelect,
    orderBy: [{ transaction_date: "desc" }, { created_at: "desc" }],
  });
}

export function findRecentTransactions(userId: bigint, limit: number) {
  return prisma.transactions.findMany({
    where: { user_id: userId },
    select: detailSelect,
    orderBy: [{ transaction_date: "desc" }, { created_at: "desc" }],
    take: limit,
  });
}

type NewTransactionData = {
  type: transactions_type;
  account_id: bigint;
  to_account_id?: bigint;
  category_id?: bigint;
  amount: number;
  transaction_date: Date;
  note?: string;
};

export function createTransaction(userId: bigint, data: NewTransactionData) {
  return prisma.transactions.create({ data: { ...data, user_id: userId } });
}

export function findTransactionById(userId: bigint, id: bigint) {
  return prisma.transactions.findFirst({ where: { user_id: userId, id } });
}

export function deleteTransaction(userId: bigint, id: bigint) {
  return prisma.transactions.deleteMany({ where: { user_id: userId, id } });
}

export async function sumByTypeInRange(userId: bigint, range: DateRange) {
  const rows = await prisma.transactions.groupBy({
    by: ["type"],
    where: { user_id: userId, transaction_date: { gte: range.from, lte: range.to } },
    _sum: { amount: true },
  });
  return rows;
}

export async function sumByCategoryInRange(userId: bigint, type: "income" | "expense", range: DateRange) {
  const rows = await prisma.transactions.groupBy({
    by: ["category_id"],
    where: { user_id: userId, type, transaction_date: { gte: range.from, lte: range.to }, category_id: { not: null } },
    _sum: { amount: true },
    orderBy: { _sum: { amount: "desc" } },
  });

  const categoryIds = rows.map((r) => r.category_id).filter((id): id is bigint => id !== null);
  const categories = await prisma.categories.findMany({
    where: { id: { in: categoryIds } },
    select: { id: true, name: true, icon: true, color: true },
  });
  const categoryById = new Map(categories.map((c) => [c.id.toString(), c]));

  return rows.map((row) => ({
    category: row.category_id ? (categoryById.get(row.category_id.toString()) ?? null) : null,
    total: row._sum.amount ?? 0,
  }));
}

export async function sumByDayInRange(userId: bigint, range: DateRange) {
  return prisma.transactions.groupBy({
    by: ["transaction_date", "type"],
    where: {
      user_id: userId,
      transaction_date: { gte: range.from, lte: range.to },
      category_id: { not: null }, // chỉ tính chi tiêu sinh hoạt (loại trừ transfer)
    },
    _sum: { amount: true },
  });
}
