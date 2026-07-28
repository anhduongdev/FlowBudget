import type { accounts_type } from "@/app/generated/prisma/enums";
import {
  DEFAULT_ACCOUNT_COLOR,
  DEFAULT_ACCOUNT_ICON,
} from "@/lib/account-options";
import { decimalToNumber } from "@/lib/decimal";
import {
  createAccount,
  findAccountByIdForUser,
  findActiveAccountsByUser,
  softDeleteAccountForUser,
  updateAccountForUser as updateAccountRepository,
} from "@/lib/repositories/account-repository";
import type {
  CreateAccountInput,
  UpdateAccountInput,
} from "@/lib/validations/account";

export class AccountNotFoundError extends Error {}

export interface AccountOption {
  id: string;
  name: string;
  type: accounts_type;
  icon: string;
  color: string;
  currentBalance: number;
}

export async function listActiveAccountsForUser(
  userId: bigint,
): Promise<AccountOption[]> {
  const accounts = await findActiveAccountsByUser(userId);

  return accounts.map((account) => ({
    id: account.id.toString(),
    name: account.name,
    type: account.type,
    icon: account.icon ?? DEFAULT_ACCOUNT_ICON,
    color: account.color ?? DEFAULT_ACCOUNT_COLOR,
    currentBalance: decimalToNumber(account.current_balance),
  }));
}

export function sumAccountBalances(accounts: AccountOption[]): number {
  return accounts.reduce((sum, account) => sum + account.currentBalance, 0);
}

export async function createAccountForUser(
  userId: bigint,
  input: CreateAccountInput,
) {
  const initialBalance = input.initialBalance.toFixed(2);

  return createAccount({
    userId,
    name: input.name,
    type: input.type,
    initialBalance,
    currentBalance: initialBalance,
    icon: input.icon,
    color: input.color,
  });
}

export async function updateAccountForUser(
  userId: bigint,
  id: bigint,
  input: UpdateAccountInput,
): Promise<void> {
  const existing = await findAccountByIdForUser(id, userId);
  if (!existing) {
    throw new AccountNotFoundError("Tài khoản không tồn tại.");
  }

  await updateAccountRepository(id, userId, input);
}

export async function deleteAccountForUser(
  userId: bigint,
  id: bigint,
): Promise<void> {
  const existing = await findAccountByIdForUser(id, userId);
  if (!existing) {
    throw new AccountNotFoundError("Tài khoản không tồn tại.");
  }

  await softDeleteAccountForUser(id, userId);
}
