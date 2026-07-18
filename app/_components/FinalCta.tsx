export function FinalCta() {
  return (
    <section className="py-24 px-6 text-center relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="font-sans text-headline-lg md:text-display-lg mb-8">
          Sẵn sàng làm chủ tài chính của bạn?
        </h2>
        <p className="text-xl text-on-surface-variant mb-12">
          Gia nhập cùng 50,000+ người dùng thông thái đã thay đổi cách họ sử dụng đồng tiền.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-primary text-on-primary px-12 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-2xl shadow-primary/40">
            Bắt đầu miễn phí ngay
          </button>
          <button className="border border-outline-variant px-12 py-5 rounded-2xl font-bold text-lg hover:bg-surface-variant transition-colors">
            Liên hệ hỗ trợ
          </button>
        </div>
      </div>
    </section>
  );
}
