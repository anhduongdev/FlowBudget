export function AuthFooterLinks() {
  const year = new Date().getFullYear();

  return (
    <div className="fixed bottom-8 w-full flex justify-center gap-8 font-label-sm text-label-sm text-outline z-20">
      <a className="hover:text-primary transition-colors" href="#">
        Chính sách bảo mật
      </a>
      <a className="hover:text-primary transition-colors" href="#">
        Điều khoản dịch vụ
      </a>
      <a className="hover:text-primary transition-colors" href="#">
        Hỗ trợ
      </a>
      <span className="text-outline-variant">© {year} SalaryCycle Inc.</span>
    </div>
  );
}
