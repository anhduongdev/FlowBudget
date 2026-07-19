import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/auth/current-user";

export default async function RootPage() {
  const userId = await getCurrentUserId();
  redirect(userId !== null ? "/dashboard" : "/login");
}
