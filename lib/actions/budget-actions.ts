"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/services/auth-service";
import {
  setCategoryBudgetForUser,
  setMonthlyBudgetForUser,
} from "@/lib/services/budget-service";
import { CategoryNotFoundError } from "@/lib/services/category-service";
import {
  setCategoryBudgetSchema,
  setMonthlyBudgetSchema,
} from "@/lib/validations/budget";

export interface BudgetFormState {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
}

export async function setMonthlyBudgetAction(
  _prevState: BudgetFormState | undefined,
  formData: FormData,
): Promise<BudgetFormState> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const validatedFields = setMonthlyBudgetSchema.safeParse({
    amount: formData.get("amount"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  await setMonthlyBudgetForUser(user.id, validatedFields.data.amount);

  revalidatePath("/categories");
  revalidatePath("/budgets");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function setCategoryBudgetAction(
  _prevState: BudgetFormState | undefined,
  formData: FormData,
): Promise<BudgetFormState> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const validatedFields = setCategoryBudgetSchema.safeParse({
    categoryId: formData.get("categoryId"),
    amount: formData.get("amount"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  try {
    await setCategoryBudgetForUser(
      user.id,
      BigInt(validatedFields.data.categoryId),
      validatedFields.data.amount,
    );
  } catch (error) {
    if (error instanceof CategoryNotFoundError) {
      return { message: error.message };
    }
    throw error;
  }

  revalidatePath("/budgets");
  return { success: true };
}
