import { prisma } from "@/lib/prisma";
import type { categories_type } from "@/app/generated/prisma/enums";

export function findCategoriesByUser(userId: bigint, type?: categories_type, opts: { activeOnly?: boolean } = {}) {
  return prisma.categories.findMany({
    where: {
      user_id: userId,
      ...(type ? { type } : {}),
      ...(opts.activeOnly ? { is_active: true } : {}),
    },
    orderBy: { sort_order: "asc" },
  });
}

export function findCategoryById(userId: bigint, id: bigint) {
  return prisma.categories.findFirst({ where: { user_id: userId, id } });
}

type CategoryData = { name: string; type: categories_type; icon?: string; color?: string };

export async function createCategory(userId: bigint, data: CategoryData) {
  const count = await prisma.categories.count({ where: { user_id: userId, type: data.type } });
  return prisma.categories.create({ data: { ...data, user_id: userId, sort_order: count } });
}

export function updateCategory(userId: bigint, id: bigint, data: CategoryData) {
  return prisma.categories.updateMany({ where: { user_id: userId, id }, data });
}

export function softDeleteCategory(userId: bigint, id: bigint) {
  return prisma.categories.updateMany({ where: { user_id: userId, id }, data: { is_active: false } });
}

export function hardDeleteCategory(userId: bigint, id: bigint) {
  return prisma.categories.deleteMany({ where: { user_id: userId, id } });
}

export function countTransactionsForCategory(userId: bigint, id: bigint) {
  return prisma.transactions.count({ where: { user_id: userId, category_id: id } });
}
