import type { Metadata } from "next";
import { TransactionsContent } from "./transactions-content";

export const metadata: Metadata = {
  title: "FlowBudget - Giao dịch chi tiết",
};

export default function TransactionsPage() {
  return <TransactionsContent />;
}
