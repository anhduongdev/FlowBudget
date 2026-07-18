import { AuthFooterLinks } from "@/app/(auth)/_components/AuthFooterLinks";
import { AuthShowcase } from "@/app/(auth)/_components/AuthShowcase";

// Layout dùng chung cho /login và /register — 2 trang chỉ khác nhau phần form
// bên trái, khung ngoài (mesh nền, card 2 cột, panel minh hoạ bên phải,
// footer links) giống hệt nhau nên đặt ở đây thay vì lặp lại ở mỗi page.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 lg:p-0">
      <div className="animated-mesh" />
      <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-surface-container-low rounded-xl overflow-hidden shadow-2xl border border-outline-variant min-h-[700px]">
        <div className="flex flex-col justify-center p-8 lg:p-16 bg-surface/50">{children}</div>
        <AuthShowcase />
      </div>
      <AuthFooterLinks />
    </div>
  );
}
