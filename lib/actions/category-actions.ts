"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/services/auth-service";
import {
  CategoryAlreadyExistsError,
  CategoryNotFoundError,
  createCategoryForUser,
  deleteCategoryForUser,
  updateCategoryForUser,
} from "@/lib/services/category-service";
import {
  categoryIdSchema,
  createCategorySchema,
  updateCategorySchema,
} from "@/lib/validations/category";

export interface CategoryFormState {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
}

export async function createCategoryAction(
  _prevState: CategoryFormState | undefined,
  formData: FormData,
): Promise<CategoryFormState> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const validatedFields = createCategorySchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    icon: formData.get("icon"),
    color: formData.get("color"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  try {
    await createCategoryForUser(user.id, validatedFields.data);
  } catch (error) {
    if (error instanceof CategoryAlreadyExistsError) {
      return { message: error.message };
    }
    throw error;
  }

  revalidatePath("/categories");
  revalidatePath("/budgets");
  return { success: true };
}

export async function updateCategoryAction(
  _prevState: CategoryFormState | undefined,
  formData: FormData,
): Promise<CategoryFormState> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const validatedId = categoryIdSchema.safeParse({ id: formData.get("id") });
  const validatedFields = updateCategorySchema.safeParse({
    name: formData.get("name"),
    icon: formData.get("icon"),
    color: formData.get("color"),
  });

  if (!validatedId.success) {
    return { message: "Thiếu mã danh mục." };
  }
  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  try {
    await updateCategoryForUser(
      user.id,
      BigInt(validatedId.data.id),
      validatedFields.data,
    );
  } catch (error) {
    if (error instanceof CategoryNotFoundError) {
      return { message: error.message };
    }
    throw error;
  }

  revalidatePath("/categories");
  revalidatePath("/budgets");
  return { success: true };
}

export async function deleteCategoryAction(
  _prevState: CategoryFormState | undefined,
  formData: FormData,
): Promise<CategoryFormState> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const validatedId = categoryIdSchema.safeParse({ id: formData.get("id") });
  if (!validatedId.success) {
    return { message: "Thiếu mã danh mục." };
  }

  try {
    await deleteCategoryForUser(user.id, BigInt(validatedId.data.id));
  } catch (error) {
    if (error instanceof CategoryNotFoundError) {
      return { message: error.message };
    }
    throw error;
  }

  revalidatePath("/categories");
  revalidatePath("/budgets");
  return { success: true };
}
