import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Đăng nhập | FlowBudget",
};

export default function LoginPage() {
  return <LoginForm />;
}
