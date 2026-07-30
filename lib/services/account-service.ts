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
  initialBalance: number;
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
    initialBalance: decimalToNumber(account.initial_balance),
    currentBalance: decimalToNumber(account.current_balance),
  }));
}

export function sumAccountBalances(accounts: AccountOption[]): number {
  return accounts.reduce((sum, account) => sum + account.currentBalance, 0);
}

// Balance "as of" a date is computed directly from the transaction ledger
// (initial balance + income − expense recorded on/before that date), instead
// of reading each account's `current_balance` and reversing out later
// transactions. `current_balance` is a denormalized running total kept in
// sync by incrementing/decrementing it on every create/update/delete; if any
// one of those ever double-applies or partially fails, it silently drifts
// from the ledger and every reconstructed date inherits the drift. Computing
// straight from `transactions` has no such failure mode. Transfers move
// money between the user's own accounts, so they net to zero across the
// total and can be ignored — only income/expense matter.
const LEDGER_EPOCH = new Date(Date.UTC(2000, 0, 1));

export async function getTotalBalancesAsOfDates(
  userId: bigint,
  accounts: AccountOption[],
  datesIso: string[],
): Promise<Record<string, number>> {
  const totalInitialBalance = accounts.reduce(
    (sum, account) => sum + account.initialBalance,
    0,
  );
  const uniqueDates = Array.from(new Set(datesIso));

  const entries = await Promise.all(
    uniqueDates.map(async (dateIso) => {
      const inclusiveEnd = new Date(`${dateIso}T00:00:00.000Z`);
      inclusiveEnd.setUTCDate(inclusiveEnd.getUTCDate() + 1);

      const [incomeToDate, expenseToDate] = await Promise.all([
        sumTransactionAmountForUser(
          userId,
          transactions_type.income,
          LEDGER_EPOCH,
          inclusiveEnd,
        ),
        sumTransactionAmountForUser(
          userId,
          transactions_type.expense,
          LEDGER_EPOCH,
          inclusiveEnd,
        ),
      ]);

      const balanceAsOfDate =
        totalInitialBalance +
        decimalToNumber(incomeToDate._sum.amount) -
        decimalToNumber(expenseToDate._sum.amount);

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
