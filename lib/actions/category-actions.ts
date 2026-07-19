"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentUserId } from "@/lib/auth/current-user";
import * as categoryService from "@/lib/services/category-service";
import { ServiceError } from "@/lib/services/errors";
import { createCategorySchema, updateCategorySchema } from "@/lib/validations/category";
import type { ActionState } from "@/lib/actions/types";

export async function createCategoryAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const userId = await requireCurrentUserId();
  const parsed = createCategorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  await categoryService.createCategory(userId, parsed.data);
  revalidatePath("/categories");
  revalidatePath("/dashboard");
  return null;
}

export async function updateCategoryAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const userId = await requireCurrentUserId();
  const parsed = updateCategorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  try {
    await categoryService.updateCategory(userId, parsed.data);
  } catch (error) {
    if (error instanceof ServiceError) return { formError: error.message };
    throw error;
  }

  revalidatePath("/categories");
  revalidatePath("/dashboard");
  return null;
}

export async function deleteCategoryAction(id: string): Promise<void> {
  const userId = await requireCurrentUserId();
  await categoryService.deleteCategory(userId, id);
  revalidatePath("/categories");
  revalidatePath("/dashboard");
}
