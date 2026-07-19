import { requireCurrentUserId } from "@/lib/auth/current-user";
import { findUserById } from "@/lib/repositories/user-repository";
import { getTotalAssets, listAccounts } from "@/lib/services/account-service";
import { listCategories } from "@/lib/services/category-service";
import { Sidebar } from "@/app/(app)/_components/Sidebar";
import { TopAppBar } from "@/app/(app)/_components/TopAppBar";
import { MobileBottomNav } from "@/app/(app)/_components/MobileBottomNav";
import { QuickAddModalProvider } from "@/app/(app)/_components/quick-add/QuickAddModalContext";
import { MobileFab } from "@/app/(app)/_components/quick-add/MobileFab";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const userId = await requireCurrentUserId();
  const [user, totalAssets, accounts, categories] = await Promise.all([
    findUserById(userId),
    getTotalAssets(userId),
    listAccounts(userId),
    listCategories(userId),
  ]);

  return (
    <QuickAddModalProvider accounts={accounts} categories={categories}>
      <div className="min-h-screen">
        <Sidebar totalAssets={totalAssets} />
        <TopAppBar userName={user?.name ?? ""} />
        <main className="min-h-screen pb-24 md:ml-sidebar-width md:pb-xl">
          <div className="flex flex-col gap-lg p-gutter">{children}</div>
        </main>
        <MobileBottomNav />
        <MobileFab />
      </div>
    </QuickAddModalProvider>
  );
}
