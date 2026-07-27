import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/services/auth-service";
import { TransactionsContent } from "./transactions-content";

export const metadata: Metadata = {
  title: "FlowBudget - Giao dịch chi tiết",
};

export default async function TransactionsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return <TransactionsContent userName={user.name} />;
}
