export function Pricing() {
  return (
    <section className="py-24 px-6 bg-surface-container-low">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-headline-lg text-headline-lg mb-4">Chọn kế hoạch phù hợp</h2>
          <p className="text-on-surface-variant">Bắt đầu miễn phí và nâng cấp khi bạn cần nhiều hơn.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-10 rounded-3xl border border-outline-variant bg-surface hover:border-primary/50 transition-all flex flex-col h-full">
            <h3 className="font-bold text-2xl mb-2">Cơ bản</h3>
            <p className="text-on-surface-variant mb-6">Cho người mới bắt đầu quản lý.</p>
            <div className="text-4xl font-black mb-8">Miễn phí</div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">check_circle</span>
                Theo dõi 1 chu kỳ lương
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">check_circle</span>
                Tối đa 3 ví tài khoản
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">check_circle</span>
                Báo cáo chi tiêu tuần
              </li>
            </ul>
            <button className="w-full border border-outline-variant py-4 rounded-xl font-bold hover:bg-surface-variant transition-colors">
              Bắt đầu ngay
            </button>
          </div>

          <div className="p-10 rounded-3xl border-2 border-primary bg-primary-container/10 relative overflow-hidden flex flex-col h-full">
            <div className="absolute top-4 right-4 bg-primary text-on-primary text-xs font-bold px-3 py-1 rounded-full uppercase">
              Phổ biến nhất
            </div>
            <h3 className="font-bold text-2xl mb-2">Premium</h3>
            <p className="text-on-surface-variant mb-6">Tối ưu hóa dòng tiền tuyệt đối.</p>
            <div className="text-4xl font-black mb-8">
              99,000đ<span className="text-sm font-normal text-on-surface-variant">/tháng</span>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">check_circle</span>
                Không giới hạn chu kỳ
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">check_circle</span>
                Không giới hạn ví & thẻ
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">check_circle</span>
                Phân tích chuyên sâu AI
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">check_circle</span>
                Xuất báo cáo thuế (Excel/PDF)
              </li>
            </ul>
            <button className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold hover:opacity-90 shadow-xl shadow-primary/30 transition-all">
              Nâng cấp ngay
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
