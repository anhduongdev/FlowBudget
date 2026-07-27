"use server";

import { redirect } from "next/navigation";
import {
  EmailAlreadyRegisteredError,
  InvalidCredentialsError,
  loginUser,
  logoutUser,
  registerUser,
} from "@/lib/services/auth-service";
import { loginSchema, registerSchema } from "@/lib/validations/auth";

export interface AuthFormState {
  errors?: Record<string, string[]>;
  message?: string;
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
