import {
  DEFAULT_ACCOUNT_COLOR,
  DEFAULT_ACCOUNT_ICON,
} from "@/lib/account-options";
import { decimalToNumber } from "@/lib/decimal";
import {
  createAccount,
  findActiveAccountsByUser,
} from "@/lib/repositories/account-repository";
import type { CreateAccountInput } from "@/lib/validations/account";

export interface AccountOption {
  id: string;
  name: string;
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
