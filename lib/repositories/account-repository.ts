import { prisma } from "@/lib/prisma";
import type { accounts_type } from "@/app/generated/prisma/enums";

type NewAccountData = {
  name: string;
  type: accounts_type;
  initial_balance: number;
  icon?: string;
  color?: string;
};

type AccountUpdateData = {
  name: string;
  type: accounts_type;
  icon?: string;
  color?: string;
};

export function findAccountsByUser(userId: bigint, opts: { activeOnly?: boolean } = {}) {
  return prisma.accounts.findMany({
    where: { user_id: userId, ...(opts.activeOnly ? { is_active: true } : {}) },
    orderBy: { sort_order: "asc" },
  });
}

export function findAccountById(userId: bigint, id: bigint) {
  return prisma.accounts.findFirst({ where: { user_id: userId, id } });
}

export async function createAccount(userId: bigint, data: NewAccountData) {
  const count = await prisma.accounts.count({ where: { user_id: userId } });
  return prisma.accounts.create({
    data: { ...data, user_id: userId, sort_order: count },
  });
}

export function updateAccount(userId: bigint, id: bigint, data: AccountUpdateData) {
  return prisma.accounts.updateMany({ where: { user_id: userId, id }, data });
}

export function softDeleteAccount(userId: bigint, id: bigint) {
  return prisma.accounts.updateMany({ where: { user_id: userId, id }, data: { is_active: false } });
}

export function hardDeleteAccount(userId: bigint, id: bigint) {
  return prisma.accounts.deleteMany({ where: { user_id: userId, id } });
}

export function countTransactionsForAccount(userId: bigint, id: bigint) {
  return prisma.transactions.count({
    where: { user_id: userId, OR: [{ account_id: id }, { to_account_id: id }] },
  });
}

export async function getTotalAssets(userId: bigint): Promise<string> {
  const result = await prisma.accounts.aggregate({
    _sum: { current_balance: true },
    where: { user_id: userId, is_active: true },
  });
  return (result._sum.current_balance ?? 0).toString();
}

export function findRecentTransfers(userId: bigint, limit: number) {
  return prisma.transactions.findMany({
    where: { user_id: userId, type: "transfer" },
    select: {
      id: true,
      amount: true,
      transaction_date: true,
      note: true,
      accounts_transactions_account_idToaccounts: { select: { name: true } },
      accounts_transactions_to_account_idToaccounts: { select: { name: true } },
    },
    orderBy: { transaction_date: "desc" },
    take: limit,
  });
}
