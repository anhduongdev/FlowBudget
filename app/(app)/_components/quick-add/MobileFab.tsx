import { AddTransactionButton } from "@/app/(app)/_components/quick-add/AddTransactionButton";

export function MobileFab() {
  return (
    <AddTransactionButton className="fixed bottom-24 right-gutter z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg transition-all hover:scale-110 active:scale-95 md:hidden">
      <span className="material-symbols-outlined text-[32px]">add</span>
    </AddTransactionButton>
  );
}
