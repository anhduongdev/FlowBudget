import * as transactionRepository from "@/lib/repositories/transaction-repository";
import * as accountRepository from "@/lib/repositories/account-repository";
import * as accountService from "@/lib/services/account-service";
import { ServiceError } from "@/lib/services/errors";
import type { CreateTransactionInput } from "@/lib/validations/transaction";
import type { DateRange } from "@/lib/repositories/transaction-repository";

export type Period = "today" | "month" | "year";

export function resolvePeriodRange(period: Period): DateRange {
  const now = new Date();

  if (period === "today") {
    const from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const to = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    return { from, to };
  }

  if (period === "year") {
    return { from: new Date(now.getFullYear(), 0, 1), to: new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999) };
  }

  // month (mặc định)
  return {
    from: new Date(now.getFullYear(), now.getMonth(), 1),
    to: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
  };
}

export type TransactionDto = {
  id: string;
  type: "income" | "expense" | "transfer";
  amount: string;
  transaction_date: Date;
  created_at: Date;
  note: string | null;
  account_name: string;
  category_name: string | null;
  category_icon: string | null;
};

function toDto(t: Awaited<ReturnType<typeof transactionRepository.findTransactions>>[number]): TransactionDto {
  return {
    id: t.id.toString(),
    type: t.type,
    amount: t.amount.toString(),
    transaction_date: t.transaction_date,
    created_at: t.created_at,
    note: t.note,
    account_name: t.accounts_transactions_account_idToaccounts.name,
    category_name: t.categories?.name ?? null,
    category_icon: t.categories?.icon ?? null,
  };
}

export type TransactionGroup = { date: Date; net: number; transactions: TransactionDto[] };

export async function listTransactionsGroupedByDate(userId: bigint, period: Period): Promise<TransactionGroup[]> {
  const range = resolvePeriodRange(period);
  const transactions = (await transactionRepository.findTransactions(userId, range)).map(toDto);

  const groups = new Map<string, TransactionGroup>();
  for (const txn of transactions) {
    const key = txn.transaction_date.toISOString().slice(0, 10);
    if (!groups.has(key)) groups.set(key, { date: txn.transaction_date, net: 0, transactions: [] });
    const group = groups.get(key)!;
    group.transactions.push(txn);
    if (txn.type === "income") group.net += Number(txn.amount);
    else if (txn.type === "expense") group.net -= Number(txn.amount);
  }

  return Array.from(groups.values()).sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function listRecentTransactions(userId: bigint, limit = 5): Promise<TransactionDto[]> {
  const transactions = await transactionRepository.findRecentTransactions(userId, limit);
  return transactions.map(toDto);
}

export async function createTransaction(userId: bigint, input: CreateTransactionInput): Promise<void> {
  const accountId = BigInt(input.account_id);
  const account = await accountRepository.findAccountById(userId, accountId);
  if (!account) throw new ServiceError("Tài khoản không hợp lệ", "account_id");

  let toAccountId: bigint | undefined;
  if (input.type === "transfer") {
    toAccountId = BigInt(input.to_account_id!);
    const toAccount = await accountRepository.findAccountById(userId, toAccountId);
    if (!toAccount) throw new ServiceError("Tài khoản nhận không hợp lệ", "to_account_id");
  }

  await transactionRepository.createTransaction(userId, {
    type: input.type,
    account_id: accountId,
    to_account_id: toAccountId,
    category_id: input.category_id ? BigInt(input.category_id) : undefined,
    amount: input.amount,
    transaction_date: new Date(input.transaction_date),
    note: input.note,
  });
}

export async function deleteTransaction(userId: bigint, idStr: string): Promise<void> {
  const id = BigInt(idStr);
  const existing = await transactionRepository.findTransactionById(userId, id);
  if (!existing) throw new ServiceError("Không tìm thấy giao dịch");
  await transactionRepository.deleteTransaction(userId, id);
}

export type CategorySlice = {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  amount: string;
  pct: number;
};

export type DailyPoint = { date: string; label: string; income: number; expense: number };

export type DashboardSummary = {
  totalAssets: string;
  periodIncome: string;
  periodExpense: string;
  netFlow: string;
  categoryBreakdown: CategorySlice[];
  topCategories: CategorySlice[];
  dailySeries: DailyPoint[];
  recentTransactions: TransactionDto[];
};

const WEEKDAY_LABELS = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

// `transaction_date` được lưu là UTC-midnight của ngày lịch người dùng nhập
// (vì Prisma parse chuỗi "YYYY-MM-DD" theo UTC — xem transactionService.createTransaction).
// Phải dựng range/bucket theo UTC ở đây, nếu không server ở múi giờ UTC+n sẽ lệch
// một ngày khi so khớp key (đã phát hiện qua debug-verify-dashboard).
function last7DaysRange(): DateRange {
  const now = new Date();
  const todayUtcMidnight = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const from = new Date(todayUtcMidnight);
  from.setUTCDate(from.getUTCDate() - 6);
  const to = new Date(todayUtcMidnight);
  to.setUTCHours(23, 59, 59, 999);
  return { from, to };
}

async function buildDailySeries(userId: bigint): Promise<DailyPoint[]> {
  const range = last7DaysRange();
  const rows = await transactionRepository.sumByDayInRange(userId, range);

  const days: { date: Date; income: number; expense: number }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(range.from);
    d.setUTCDate(d.getUTCDate() + i);
    days.push({ date: d, income: 0, expense: 0 });
  }
  const byKey = new Map(days.map((d) => [d.date.toISOString().slice(0, 10), d]));

  for (const row of rows) {
    const bucket = byKey.get(row.transaction_date.toISOString().slice(0, 10));
    if (!bucket) continue;
    const amount = Number(row._sum.amount ?? 0);
    if (row.type === "income") bucket.income += amount;
    else if (row.type === "expense") bucket.expense += amount;
  }

  return days.map((d) => ({
    date: d.date.toISOString().slice(0, 10),
    label: WEEKDAY_LABELS[d.date.getUTCDay()]!,
    income: d.income,
    expense: d.expense,
  }));
}

export async function getDashboardSummary(userId: bigint, period: Period): Promise<DashboardSummary> {
  const range = resolvePeriodRange(period);

  const [totalAssets, typeSums, expenseByCategory, dailySeries, recentTransactions] = await Promise.all([
    accountService.getTotalAssets(userId),
    transactionRepository.sumByTypeInRange(userId, range),
    transactionRepository.sumByCategoryInRange(userId, "expense", range),
    buildDailySeries(userId),
    listRecentTransactions(userId, 5),
  ]);

  const periodIncome = Number(typeSums.find((r) => r.type === "income")?._sum.amount ?? 0);
  const periodExpense = Number(typeSums.find((r) => r.type === "expense")?._sum.amount ?? 0);
  const totalExpense = expenseByCategory.reduce((sum, row) => sum + Number(row.total), 0);

  const toSlice = (row: (typeof expenseByCategory)[number]): CategorySlice => ({
    id: row.category?.id.toString() ?? "unknown",
    name: row.category?.name ?? "Khác",
    icon: row.category?.icon ?? null,
    color: row.category?.color ?? null,
    amount: row.total.toString(),
    pct: totalExpense > 0 ? Math.round((Number(row.total) / totalExpense) * 100) : 0,
  });

  const topCategories = expenseByCategory.slice(0, 5).map(toSlice);

  const topFourForDonut = expenseByCategory.slice(0, 4).map(toSlice);
  const otherTotal = expenseByCategory.slice(4).reduce((sum, row) => sum + Number(row.total), 0);
  const categoryBreakdown =
    otherTotal > 0
      ? [
          ...topFourForDonut,
          {
            id: "other",
            name: "Khác",
            icon: null,
            color: "#918fa1",
            amount: otherTotal.toString(),
            pct: totalExpense > 0 ? Math.round((otherTotal / totalExpense) * 100) : 0,
          },
        ]
      : topFourForDonut;

  return {
    totalAssets,
    periodIncome: periodIncome.toString(),
    periodExpense: periodExpense.toString(),
    netFlow: (periodIncome - periodExpense).toString(),
    categoryBreakdown,
    topCategories,
    dailySeries,
    recentTransactions,
  };
}
