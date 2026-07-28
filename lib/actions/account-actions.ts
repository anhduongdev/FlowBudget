"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  AccountNotFoundError,
  createAccountForUser,
  deleteAccountForUser,
  updateAccountForUser,
} from "@/lib/services/account-service";
import { getCurrentUser } from "@/lib/services/auth-service";
import {
  accountIdSchema,
  createAccountSchema,
  updateAccountSchema,
} from "@/lib/validations/account";

export interface AccountFormState {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
}

export async function createAccountAction(
  _prevState: AccountFormState | undefined,
  formData: FormData,
): Promise<AccountFormState> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const validatedFields = createAccountSchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    initialBalance: formData.get("initialBalance"),
    icon: formData.get("icon"),
    color: formData.get("color"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  await createAccountForUser(user.id, validatedFields.data);

  revalidatePath("/accounts");
  revalidatePath("/transactions");
  return { success: true };
}

export async function updateAccountAction(
  _prevState: AccountFormState | undefined,
  formData: FormData,
): Promise<AccountFormState> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const validatedId = accountIdSchema.safeParse({ id: formData.get("id") });
  const validatedFields = updateAccountSchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    icon: formData.get("icon"),
    color: formData.get("color"),
  });

  if (!validatedId.success) {
    return { message: "Thiếu mã tài khoản." };
  }
  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  try {
    await updateAccountForUser(
      user.id,
      BigInt(validatedId.data.id),
      validatedFields.data,
    );
  } catch (error) {
    if (error instanceof AccountNotFoundError) {
      return { message: error.message };
    }
    throw error;
  }

  revalidatePath("/accounts");
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteAccountAction(
  _prevState: AccountFormState | undefined,
  formData: FormData,
): Promise<AccountFormState> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const validatedId = accountIdSchema.safeParse({ id: formData.get("id") });
  if (!validatedId.success) {
    return { message: "Thiếu mã tài khoản." };
  }

  try {
    await deleteAccountForUser(user.id, BigInt(validatedId.data.id));
  } catch (error) {
    if (error instanceof AccountNotFoundError) {
      return { message: error.message };
    }
    throw error;
  }

  revalidatePath("/accounts");
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  return { success: true };
}
