import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from "@/lib/constants/default-categories";
import { createUserWithSeedCategories, findUserByEmail } from "@/lib/repositories/user-repository";
import { ServiceError } from "@/lib/services/errors";
import type { LoginInput, RegisterInput } from "@/lib/validations/auth";

export async function registerUser(input: RegisterInput): Promise<{ userId: bigint }> {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    throw new ServiceError("Email này đã được đăng ký", "email");
  }

  const passwordHash = await hashPassword(input.password);
  const seedCategories = [
    ...DEFAULT_EXPENSE_CATEGORIES.map((c) => ({ ...c, type: "expense" as const })),
    ...DEFAULT_INCOME_CATEGORIES.map((c) => ({ ...c, type: "income" as const })),
  ];

  const user = await createUserWithSeedCategories(
    { name: input.name, email: input.email, password_hash: passwordHash },
    seedCategories,
  );

  return { userId: user.id };
}

export async function loginUser(input: LoginInput): Promise<{ userId: bigint }> {
  const user = await findUserByEmail(input.email);
  const passwordOk = user ? await verifyPassword(input.password, user.password_hash) : false;

  // Cố tình dùng chung 1 thông báo cho "sai email" và "sai mật khẩu" để không
  // lộ email nào đã tồn tại trong hệ thống.
  if (!user || !passwordOk) {
    throw new ServiceError("Email hoặc mật khẩu không đúng");
  }

  return { userId: user.id };
}
