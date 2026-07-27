import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/services/auth-service";
import { AccountsContent } from "./accounts-content";

export const metadata: Metadata = {
  title: "FlowBudget - Tài khoản",
};

export default async function AccountsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return <AccountsContent userName={user.name} />;
}
