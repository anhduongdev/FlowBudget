"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { transactions_type } from "@/app/generated/prisma/enums";
import { formatDateIso, parseInclusiveDateRange } from "@/lib/date-range";
import {
  getTotalBalancesAsOfDates,
  type AccountOption,
} from "@/lib/services/account-service";
import { getCurrentUser } from "@/lib/services/auth-service";
import {
  createBulkTransactionsForUser,
  EmptyBulkResultError,
  getTransactionsForUser,
  InvalidAccountError,
  InvalidCategoryError,
  type BulkTransactionSummary,
  type TransactionDayGroup,
} from "@/lib/services/transaction-service";
import { bulkCreateTransactionsSchema } from "@/lib/validations/bulk-transaction";

export interface BulkTransactionActionState {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string[]>;
  summary?: BulkTransactionSummary;
}

export async function createBulkTransactionsAction(
  _prevState: BulkTransactionActionState,
  payload: unknown,
): Promise<BulkTransactionActionState> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const validated = bulkCreateTransactionsSchema.safeParse(payload);
  if (!validated.success) {
    return { status: "error", fieldErrors: validated.error.flatten().fieldErrors };
  }

  const { from, to, rules } = validated.data;
  const range = parseInclusiveDateRange(from, to);
  if (!range) {
    return { status: "error", message: "Khoảng ngày không hợp lệ." };
  }

  try {
    const summary = await createBulkTransactionsForUser(user.id, {
      range,
      rules: rules.map((rule) => ({
        type:
          rule.type === "expense"
            ? transactions_type.expense
            : transactions_type.income,
        accountId: BigInt(rule.accountId),
        categoryId: rule.categoryId ? BigInt(rule.categoryId) : null,
        amount: rule.amount,
        weekdays: rule.weekdays,
        note: rule.note || null,
      })),
    });

    revalidatePath("/transactions");
    revalidatePath("/accounts");
    revalidatePath("/dashboard");
    revalidatePath("/preview/transactions");

    return { status: "success", summary };
  } catch (error) {
    if (
      error instanceof InvalidAccountError ||
      error instanceof InvalidCategoryError ||
      error instanceof EmptyBulkResultError
    ) {
      return { status: "error", message: error.message };
    }
    throw error;
  }
}

export interface PeriodOverview {
  dayGroups: TransactionDayGroup[];
  openingBalance: number;
}

export async function getPeriodOverviewAction(
  from: string,
  to: string,
  accounts: AccountOption[],
): Promise<PeriodOverview> {
  const user = await getCurrentUser();
  if (!user) {
    return { dayGroups: [], openingBalance: 0 };
  }

  const range = parseInclusiveDateRange(from, to);
  if (!range) {
    return { dayGroups: [], openingBalance: 0 };
  }

  const dayBeforeFrom = new Date(range.start);
  dayBeforeFrom.setUTCDate(dayBeforeFrom.getUTCDate() - 1);
  const dayBeforeFromIso = formatDateIso(dayBeforeFrom);

  const [dayGroups, balancesAsOf] = await Promise.all([
    getTransactionsForUser(user.id, range),
    getTotalBalancesAsOfDates(user.id, accounts, [dayBeforeFromIso]),
  ]);

  return {
    dayGroups,
    openingBalance: balancesAsOf[dayBeforeFromIso] ?? 0,
  };
}
