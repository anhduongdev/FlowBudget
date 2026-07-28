"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/services/auth-service";
import {
  createTransactionForUser,
  InvalidAccountError,
  InvalidCategoryError,
} from "@/lib/services/transaction-service";
import { createTransactionSchema } from "@/lib/validations/transaction";

export interface TransactionFormState {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
}

export async function createTransactionAction(
  _prevState: TransactionFormState | undefined,
  formData: FormData,
): Promise<TransactionFormState> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const validatedFields = createTransactionSchema.safeParse({
    type: formData.get("type"),
    amount: formData.get("amount"),
    transactionDate: formData.get("transactionDate"),
    note: formData.get("note") || undefined,
    accountId: formData.get("accountId"),
    toAccountId: formData.get("toAccountId") || undefined,
    categoryId: formData.get("categoryId") || undefined,
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const data = validatedFields.data;

  try {
    await createTransactionForUser(user.id, {
      type: data.type,
      accountId: BigInt(data.accountId),
      toAccountId: data.type === "transfer" ? BigInt(data.toAccountId) : null,
      categoryId:
        data.type !== "transfer" && data.categoryId
          ? BigInt(data.categoryId)
          : null,
      amount: data.amount,
      transactionDate: data.transactionDate,
      note: data.note || null,
    });
  } catch (error) {
    if (
      error instanceof InvalidAccountError ||
      error instanceof InvalidCategoryError
    ) {
      return { message: error.message };
    }
    throw error;
  }

  revalidatePath("/transactions");
  revalidatePath("/accounts");
  revalidatePath("/dashboard");
  return { success: true };
}
