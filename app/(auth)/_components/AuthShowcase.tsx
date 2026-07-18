export function AuthShowcase() {
  return (
    <div className="hidden lg:flex relative bg-surface-container-high overflow-hidden items-center justify-center p-12">
      <div className="relative z-10 w-full max-w-md">
        <div className="floating-element">
          <div className="glass-panel p-8 rounded-2xl shadow-2xl space-y-6 transform -rotate-3 hover:rotate-0 transition-transform duration-700">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-error" />
                <div className="w-3 h-3 rounded-full bg-tertiary" />
                <div className="w-3 h-3 rounded-full bg-primary" />
              </div>
              <span className="font-label-sm text-label-sm text-outline-variant">Tháng 10, 2023</span>
            </div>

            <div className="space-y-2">
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                Tổng số dư
              </p>
              <h3 className="font-headline-lg text-headline-lg font-black text-on-surface">$128,450.00</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
                <span className="material-symbols-outlined text-primary mb-2">trending_up</span>
                <p className="text-xs text-on-surface-variant">Thu nhập</p>
                <p className="font-label-md font-bold text-on-surface">+$12,400</p>
              </div>
              <div className="p-4 bg-tertiary-container/10 rounded-xl border border-tertiary-container/20">
                <span className="material-symbols-outlined text-tertiary mb-2">trending_down</span>
                <p className="text-xs text-on-surface-variant">Chi phí</p>
                <p className="font-label-md font-bold text-on-surface">-$3,210</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-primary" />
              </div>
              <div className="flex justify-between text-xs text-outline">
                <span>75% Ngân sách đã dùng</span>
                <span>$45,000 còn lại</span>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-10 -right-6 glass-panel p-6 rounded-xl shadow-xl w-48 transform rotate-6 border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  bolt
                </span>
              </div>
              <span className="font-label-sm font-bold">Smart AI</span>
            </div>
            <p className="text-[10px] leading-relaxed text-on-surface-variant">
              Dự báo chi tiêu tuần tới của bạn sẽ giảm 12% dựa trên lịch sử.
            </p>
          </div>
        </div>

        <div className="mt-24 text-center">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Phân tích chuyên sâu</h3>
          <p className="font-body-md text-on-surface-variant leading-relaxed">
            Theo dõi mọi biến động tài chính, dự báo dòng tiền và tối ưu hóa ngân sách với công nghệ AI hàng đầu.
          </p>
        </div>
      </div>
    </div>
  );
}
