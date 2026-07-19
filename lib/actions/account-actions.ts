"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentUserId } from "@/lib/auth/current-user";
import * as accountService from "@/lib/services/account-service";
import { ServiceError } from "@/lib/services/errors";
import { createAccountSchema, updateAccountSchema } from "@/lib/validations/account";
import type { ActionState } from "@/lib/actions/types";

export async function createAccountAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const userId = await requireCurrentUserId();
  const parsed = createAccountSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  await accountService.createAccount(userId, parsed.data);
  revalidatePath("/accounts");
  revalidatePath("/dashboard");
  return null;
}

export async function updateAccountAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const userId = await requireCurrentUserId();
  const parsed = updateAccountSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  try {
    await accountService.updateAccount(userId, parsed.data);
  } catch (error) {
    if (error instanceof ServiceError) return { formError: error.message };
    throw error;
  }

  revalidatePath("/accounts");
  revalidatePath("/dashboard");
  return null;
}

export async function deleteAccountAction(id: string): Promise<void> {
  const userId = await requireCurrentUserId();
  await accountService.deleteAccount(userId, id);
  revalidatePath("/accounts");
  revalidatePath("/dashboard");
}
