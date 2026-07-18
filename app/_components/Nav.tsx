export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-outline-variant h-[64px]">
      <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
        <div className="flex items-center gap-12">
          <div className="text-headline-md font-black text-on-surface flex items-center gap-2">
            <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-on-primary">
              S
            </span>
            SalaryCycle
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">
              Tính năng
            </a>
            <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">
              Lợi ích
            </a>
            <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">
              Bảng giá
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors px-4 py-2">
            Đăng nhập
          </button>
          <button className="bg-primary text-on-primary font-label-md text-label-md px-6 py-2 rounded-full hover:opacity-90 transition-all shadow-lg shadow-primary/20">
            Bắt đầu ngay
          </button>
        </div>
      </div>
    </nav>
  );
}
