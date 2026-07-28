"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/services/auth-service";
import { setMonthlyBudgetForUser } from "@/lib/services/budget-service";
import { setMonthlyBudgetSchema } from "@/lib/validations/budget";

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
  return { success: true };
}
