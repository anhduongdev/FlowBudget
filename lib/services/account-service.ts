import * as accountRepository from "@/lib/repositories/account-repository";
import { ServiceError } from "@/lib/services/errors";
import type { CreateAccountInput, UpdateAccountInput } from "@/lib/validations/account";

export type AccountDto = {
  id: string;
  name: string;
  type: string;
  initial_balance: string;
  current_balance: string;
  icon: string | null;
  color: string | null;
  is_active: boolean;
};

function toDto(account: Awaited<ReturnType<typeof accountRepository.findAccountsByUser>>[number]): AccountDto {
  return {
    id: account.id.toString(),
    name: account.name,
    type: account.type,
    initial_balance: account.initial_balance.toString(),
    current_balance: account.current_balance.toString(),
    icon: account.icon,
    color: account.color,
    is_active: account.is_active,
  };
}

export async function listAccounts(userId: bigint): Promise<AccountDto[]> {
  const accounts = await accountRepository.findAccountsByUser(userId, { activeOnly: true });
  return accounts.map(toDto);
}

export async function getTotalAssets(userId: bigint): Promise<string> {
  return accountRepository.getTotalAssets(userId);
}

export async function createAccount(userId: bigint, input: CreateAccountInput): Promise<void> {
  await accountRepository.createAccount(userId, input);
}

export async function updateAccount(userId: bigint, input: UpdateAccountInput): Promise<void> {
  const id = BigInt(input.id);
  const existing = await accountRepository.findAccountById(userId, id);
  if (!existing) {
    throw new ServiceError("Không tìm thấy tài khoản");
  }
  await accountRepository.updateAccount(userId, id, input);
}

// Xoá tài khoản: nếu đã có giao dịch tham chiếu (FK RESTRICT sẽ chặn xoá cứng)
// thì chuyển sang vô hiệu hoá (is_active=false) thay vì báo lỗi cho người dùng.
export async function deleteAccount(userId: bigint, idStr: string): Promise<{ softDeleted: boolean }> {
  const id = BigInt(idStr);
  const existing = await accountRepository.findAccountById(userId, id);
  if (!existing) {
    throw new ServiceError("Không tìm thấy tài khoản");
  }

  const refCount = await accountRepository.countTransactionsForAccount(userId, id);
  if (refCount > 0) {
    await accountRepository.softDeleteAccount(userId, id);
    return { softDeleted: true };
  }

  await accountRepository.hardDeleteAccount(userId, id);
  return { softDeleted: false };
}

export type RecentTransferDto = {
  id: string;
  amount: string;
  transaction_date: Date;
  note: string | null;
  from_account_name: string;
  to_account_name: string;
};

export async function listRecentTransfers(userId: bigint, limit = 5): Promise<RecentTransferDto[]> {
  const transfers = await accountRepository.findRecentTransfers(userId, limit);
  return transfers.map((t) => ({
    id: t.id.toString(),
    amount: t.amount.toString(),
    transaction_date: t.transaction_date,
    note: t.note,
    from_account_name: t.accounts_transactions_account_idToaccounts.name,
    to_account_name: t.accounts_transactions_to_account_idToaccounts?.name ?? "",
  }));
}
