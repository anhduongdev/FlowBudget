"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  changeUserPassword,
  EmailAlreadyRegisteredError,
  getCurrentUser,
  InvalidCredentialsError,
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
} from "@/lib/services/auth-service";
import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from "@/lib/validations/auth";

export interface AuthFormState {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
}

export async function registerAction(
  _prevState: AuthFormState | undefined,
  formData: FormData,
): Promise<AuthFormState> {
  const validatedFields = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  try {
    await registerUser(validatedFields.data);
  } catch (error) {
    if (error instanceof EmailAlreadyRegisteredError) {
      return { message: error.message };
    }
    throw error;
  }

  redirect("/dashboard");
}

export async function loginAction(
  _prevState: AuthFormState | undefined,
  formData: FormData,
): Promise<AuthFormState> {
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  try {
    await loginUser(validatedFields.data);
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return { message: error.message };
    }
    throw error;
  }

  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  await logoutUser();
  redirect("/");
}

export async function updateProfileAction(
  _prevState: AuthFormState | undefined,
  formData: FormData,
): Promise<AuthFormState> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const validatedFields = updateProfileSchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  await updateUserProfile(user.id, validatedFields.data.name);

  revalidatePath("/settings");
  return { message: "Đã cập nhật thông tin.", success: true };
}

export async function changePasswordAction(
  _prevState: AuthFormState | undefined,
  formData: FormData,
): Promise<AuthFormState> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const validatedFields = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmNewPassword: formData.get("confirmNewPassword"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  try {
    await changeUserPassword(
      user.id,
      validatedFields.data.currentPassword,
      validatedFields.data.newPassword,
    );
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return { message: error.message };
    }
    throw error;
  }

  return { message: "Đã đổi mật khẩu.", success: true };
}
