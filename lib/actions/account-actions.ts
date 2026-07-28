"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAccountForUser } from "@/lib/services/account-service";
import { getCurrentUser } from "@/lib/services/auth-service";
import { createAccountSchema } from "@/lib/validations/account";

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
