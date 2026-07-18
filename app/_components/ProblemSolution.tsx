export function ProblemSolution() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Kết thúc nỗi lo <br />
            <span className="text-error">hết tiền trước kỳ lương</span>
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4 p-4 rounded-xl bg-error-container/10 border border-error/20">
              <span className="material-symbols-outlined text-error">trending_down</span>
              <div>
                <p className="font-bold text-on-surface">Vấn đề phổ biến</p>
                <p className="text-body-sm text-on-surface-variant">
                  Chi tiêu quá đà đầu tháng, thắt lưng buộc bụng cuối tháng và không thể tiết kiệm.
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-xl bg-tertiary-container/10 border border-tertiary/20">
              <span className="material-symbols-outlined text-tertiary">verified_user</span>
              <div>
                <p className="font-bold text-on-surface">Giải pháp SalaryCycle</p>
                <p className="text-body-sm text-on-surface-variant">
                  Tự động phân bổ ngân sách theo số ngày còn lại đến kỳ lương tiếp theo.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-square bg-surface-container rounded-3xl overflow-hidden border border-outline-variant flex items-center justify-center p-8">
            <div className="w-full space-y-4">
              <div className="h-12 bg-surface-variant rounded-lg w-3/4 animate-pulse" />
              <div className="h-24 bg-primary/10 border border-primary/20 rounded-lg w-full flex items-center px-6 justify-between">
                <div>
                  <p className="text-xs text-primary uppercase font-bold">An toàn để tiêu hôm nay</p>
                  <p className="text-2xl font-black text-on-surface">500,000đ</p>
                </div>
                <span className="material-symbols-outlined text-4xl text-primary">savings</span>
              </div>
              <div className="h-12 bg-surface-variant rounded-lg w-1/2 animate-pulse" />
              <div className="h-12 bg-surface-variant rounded-lg w-5/6 animate-pulse" />
            </div>
          </div>
          <div className="absolute -top-4 -right-4 p-4 bg-secondary-container text-on-secondary-container rounded-xl shadow-xl">
            <p className="text-xs font-bold">+15% Tiết kiệm</p>
          </div>
        </div>
      </div>
    </section>
  );
}
