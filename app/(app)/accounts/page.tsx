import type { Metadata } from "next";
import { requireCurrentUserId } from "@/lib/auth/current-user";
import { listAccounts, listRecentTransfers } from "@/lib/services/account-service";
import { AccountModalProvider } from "@/app/(app)/accounts/_components/AccountModalContext";
import { AccountCard } from "@/app/(app)/accounts/_components/AccountCard";
import { AddAccountCard } from "@/app/(app)/accounts/_components/AddAccountCard";
import { RecentTransfersTable } from "@/app/(app)/accounts/_components/RecentTransfersTable";

export const metadata: Metadata = { title: "Tài khoản | MyFlowBudget" };

export default async function AccountsPage() {
  const userId = await requireCurrentUserId();
  const [accounts, transfers] = await Promise.all([listAccounts(userId), listRecentTransfers(userId)]);

  return (
    <AccountModalProvider>
      <div className="grid grid-cols-1 gap-md md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
        <AddAccountCard />
      </div>

      <RecentTransfersTable transfers={transfers} />
    </AccountModalProvider>
  );
}
