import type { Metadata } from "next";
import { AccountsContent } from "./accounts-content";

export const metadata: Metadata = {
  title: "FlowBudget - Tài khoản",
};

export default function AccountsPage() {
  return <AccountsContent />;
}
