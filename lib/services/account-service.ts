import type { accounts_type } from "@/app/generated/prisma/enums";
import { transactions_type } from "@/app/generated/prisma/enums";
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
import { sumTransactionAmountForUser } from "@/lib/repositories/transaction-repository";
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

// `current_balance` on every account already reflects every transaction ever
// recorded for it (past or future-dated), since balances are adjusted the
// moment a transaction is created regardless of its date. To reconstruct the
// total balance as it stood at the end of some earlier/future date D, we
// start from today's total and reverse the effect of everything dated after
// D. Transfers move money between the user's own accounts, so they net to
// zero across the total and can be ignored — only income/expense matter.
const FAR_FUTURE_DATE = new Date(Date.UTC(2100, 0, 1));

export async function getTotalBalancesAsOfDates(
  userId: bigint,
  accounts: AccountOption[],
  datesIso: string[],
): Promise<Record<string, number>> {
  const currentTotal = sumAccountBalances(accounts);
  const uniqueDates = Array.from(new Set(datesIso));

  const entries = await Promise.all(
    uniqueDates.map(async (dateIso) => {
      const afterDate = new Date(`${dateIso}T00:00:00.000Z`);
      afterDate.setUTCDate(afterDate.getUTCDate() + 1);

      const [futureIncome, futureExpense] = await Promise.all([
        sumTransactionAmountForUser(
          userId,
          transactions_type.income,
          afterDate,
          FAR_FUTURE_DATE,
        ),
        sumTransactionAmountForUser(
          userId,
          transactions_type.expense,
          afterDate,
          FAR_FUTURE_DATE,
        ),
      ]);

      const balanceAsOfDate =
        currentTotal +
        decimalToNumber(futureExpense._sum.amount) -
        decimalToNumber(futureIncome._sum.amount);

      return [dateIso, balanceAsOfDate] as const;
    }),
  );

  return Object.fromEntries(entries);
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
