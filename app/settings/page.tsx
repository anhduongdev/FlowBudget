import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/services/auth-service";
import { AppHeader } from "../_components/app-header";
import { Sidebar } from "../_components/sidebar";
import { ChangePasswordForm } from "./change-password-form";
import { UpdateProfileForm } from "./update-profile-form";

export const metadata: Metadata = {
  title: "FlowBudget - Cài đặt",
};

const CARD_CLASS = "bg-white border border-slate-200/80 rounded-2xl p-8";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <Sidebar userName={user.name} />
      <main className="ml-72 min-h-screen bg-background">
        <AppHeader title="Cài đặt" />
        <div className="p-margin max-w-2xl mx-auto space-y-xl pb-xxl">
          <section className={CARD_CLASS}>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-6">
              Thông tin cá nhân
            </h3>
            <UpdateProfileForm email={user.email} name={user.name} />
          </section>
          <section className={CARD_CLASS}>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-6">
              Đổi mật khẩu
            </h3>
            <ChangePasswordForm />
          </section>
        </div>
      </main>
    </>
  );
}
