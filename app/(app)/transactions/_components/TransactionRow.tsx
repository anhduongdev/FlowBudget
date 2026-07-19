import { formatVnd } from "@/lib/format";
import { deleteTransactionAction } from "@/lib/actions/transaction-actions";
import { DeleteConfirmButton } from "@/app/(app)/_components/DeleteConfirmButton";
import type { TransactionDto } from "@/lib/services/transaction-service";

const AMOUNT_STYLE: Record<TransactionDto["type"], string> = {
  income: "text-secondary",
  expense: "text-error",
  transfer: "text-on-surface-variant",
};

const AMOUNT_PREFIX: Record<TransactionDto["type"], string> = {
  income: "+ ",
  expense: "- ",
  transfer: "",
};

export function TransactionRow({ transaction }: { transaction: TransactionDto }) {
  const icon = transaction.type === "transfer" ? "swap_horiz" : (transaction.category_icon ?? "receipt_long");
  const time = new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit" }).format(transaction.created_at);

  return (
    <div className="group flex items-center gap-md border-b border-outline-variant p-md last:border-b-0 hover:bg-surface-container-high">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container-highest text-primary">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="flex-grow">
        <p className="font-bold font-label-md text-on-surface">{transaction.note || transaction.category_name || "Giao dịch"}</p>
        <p className="font-label-sm text-on-surface-variant">{transaction.category_name ?? "Chuyển khoản"}</p>
      </div>
      <div className="text-right">
        <p className="font-label-md text-on-surface-variant">
          {time} • {transaction.account_name}
        </p>
        <p className={`font-label-md font-bold ${AMOUNT_STYLE[transaction.type]}`}>
          {AMOUNT_PREFIX[transaction.type]}
          {formatVnd(transaction.amount)}
        </p>
      </div>
      <DeleteConfirmButton
        action={() => deleteTransactionAction(transaction.id)}
        className="text-on-surface-variant opacity-0 transition-opacity hover:text-error group-hover:opacity-100"
        confirmMessage="Xoá giao dịch này?"
      >
        <span className="material-symbols-outlined text-[20px]">delete</span>
      </DeleteConfirmButton>
    </div>
  );
}
