"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/services/auth-service";
import {
  CategoryAlreadyExistsError,
  createCategoryForUser,
} from "@/lib/services/category-service";
import { createCategorySchema } from "@/lib/validations/category";

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
  return { success: true };
}
