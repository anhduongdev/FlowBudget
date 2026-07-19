"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentUserId } from "@/lib/auth/current-user";
import * as transactionService from "@/lib/services/transaction-service";
import { ServiceError } from "@/lib/services/errors";
import { createTransactionSchema } from "@/lib/validations/transaction";
import type { ActionState } from "@/lib/actions/types";

function revalidateAffectedPages() {
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  revalidatePath("/accounts");
}

export async function createTransactionAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const userId = await requireCurrentUserId();
  const parsed = createTransactionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  try {
    await transactionService.createTransaction(userId, parsed.data);
  } catch (error) {
    if (error instanceof ServiceError) {
      return error.field ? { fieldErrors: { [error.field]: [error.message] } } : { formError: error.message };
    }
    throw error;
  }

  revalidateAffectedPages();
  return null;
}

export async function deleteTransactionAction(id: string): Promise<void> {
  const userId = await requireCurrentUserId();
  await transactionService.deleteTransaction(userId, id);
  revalidateAffectedPages();
}
