import { prisma } from "@/lib/prisma";
import type { categories_type } from "@/app/generated/prisma/enums";

interface CreateCategoryInput {
  userId: bigint;
  name: string;
  type: categories_type;
  icon: string;
  color: string;
}

export function findCategoryByUserNameAndType(
  userId: bigint,
  name: string,
  type: categories_type,
) {
  return prisma.categories.findFirst({
    where: { user_id: userId, name, type },
    select: { id: true },
  });
}

export function findActiveCategoriesByUserAndType(
  userId: bigint,
  type: categories_type,
) {
  return prisma.categories.findMany({
    where: { user_id: userId, type, is_active: true },
    select: { id: true, name: true, icon: true, color: true },
    orderBy: { sort_order: "asc" },
  });
}

export function findCategoryByIdForUser(
  id: bigint,
  userId: bigint,
  type: categories_type,
) {
  return prisma.categories.findFirst({
    where: { id, user_id: userId, type },
    select: { id: true },
  });
}

export function findCategoryOwnedByUser(id: bigint, userId: bigint) {
  return prisma.categories.findFirst({
    where: { id, user_id: userId, is_active: true },
    select: { id: true },
  });
}

export function createCategory(input: CreateCategoryInput) {
  return prisma.categories.create({
    data: {
      user_id: input.userId,
      name: input.name,
      type: input.type,
      icon: input.icon,
      color: input.color,
    },
    select: {
      id: true,
      name: true,
      type: true,
      icon: true,
      color: true,
    },
  });
}

interface UpdateCategoryInput {
  name: string;
  icon: string;
  color: string;
}

export function updateCategoryForUser(
  id: bigint,
  userId: bigint,
  input: UpdateCategoryInput,
) {
  return prisma.categories.updateMany({
    where: { id, user_id: userId },
    data: {
      name: input.name,
      icon: input.icon,
      color: input.color,
    },
  });
}

export function softDeleteCategoryForUser(id: bigint, userId: bigint) {
  return prisma.categories.updateMany({
    where: { id, user_id: userId },
    data: { is_active: false },
  });
}
