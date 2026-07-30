import type { accounts_type } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export function findActiveAccountsByUser(userId: bigint) {
  return prisma.accounts.findMany({
    where: { user_id: userId, is_active: true },
    select: {
      id: true,
      name: true,
      type: true,
      icon: true,
      color: true,
      initial_balance: true,
      current_balance: true,
    },
    orderBy: { sort_order: "asc" },
  });
}

export function findAccountByIdForUser(id: bigint, userId: bigint) {
  return prisma.accounts.findFirst({
    where: { id, user_id: userId, is_active: true },
    select: { id: true },
  });
}

interface CreateAccountInput {
  userId: bigint;
  name: string;
  type: accounts_type;
  initialBalance: string;
  currentBalance: string;
  icon: string;
  color: string;
}

export function createAccount(input: CreateAccountInput) {
  return prisma.accounts.create({
    data: {
      user_id: input.userId,
      name: input.name,
      type: input.type,
      initial_balance: input.initialBalance,
      current_balance: input.currentBalance,
      icon: input.icon,
      color: input.color,
    },
    select: {
      id: true,
      name: true,
      type: true,
      icon: true,
      color: true,
      current_balance: true,
    },
  });
}

interface UpdateAccountInput {
  name: string;
  type: accounts_type;
  icon: string;
  color: string;
}

export function updateAccountForUser(
  id: bigint,
  userId: bigint,
  input: UpdateAccountInput,
) {
  return prisma.accounts.updateMany({
    where: { id, user_id: userId },
    data: {
      name: input.name,
      type: input.type,
      icon: input.icon,
      color: input.color,
    },
  });
}

export function softDeleteAccountForUser(id: bigint, userId: bigint) {
  return prisma.accounts.updateMany({
    where: { id, user_id: userId },
    data: { is_active: false },
  });
}
