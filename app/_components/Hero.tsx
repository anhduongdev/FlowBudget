import Image from "next/image";

export function Hero() {
  return (
    <header className="relative pt-32 pb-20 px-6 hero-gradient overflow-hidden">
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/20 border border-primary/30 text-primary mb-8 animate-pulse">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span className="font-label-md text-label-md">Thế hệ quản lý tài chính mới</span>
        </div>

        <h1 className="font-sans text-display-lg text-glow mb-6 max-w-4xl mx-auto leading-tight">
          Quản lý tài chính thông minh theo <span className="text-primary italic">chu kỳ lương</span>
        </h1>

        <p className="font-sans text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-10">
          Không chỉ là ghi chép thu chi. SalaryCycle giúp bạn biết chính xác mình còn bao nhiêu tiền, còn được
          phép tiêu bao nhiêu để đạt mục tiêu tiết kiệm.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button className="w-full sm:w-auto bg-primary text-on-primary font-label-md text-label-md px-8 py-4 rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2">
            Bắt đầu miễn phí
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
          <button className="w-full sm:w-auto border border-outline-variant text-on-surface font-label-md text-label-md px-8 py-4 rounded-xl hover:bg-surface-variant/30 transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">play_circle</span>
            Xem bản demo
          </button>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-primary/20 rounded-full blur-3xl" />
          <div className="relative bg-surface-container rounded-2xl border border-outline-variant shadow-2xl overflow-hidden group">
            <Image
              className="w-full h-auto opacity-90 group-hover:opacity-100 transition-opacity"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKtgLpoW1qxNqJHDnbA3NphgDOSUN8MlRmcc4Z0SQN3CsRD2VC0xq24eBk2gDxSl1U7lD1hB_9Szu5ugdUSmPflinPof8poCP1Btewec31TgyGavQD0umhN5uL9uBgHyxgq_FXlNqRovyPLsLYBDgLZmboybGU0izi54QQCZ543YJHBZr78NkdrtxTw_G2ecrEWyzhnofYHidVwrsPJb70RXETdKzHgnjmMqCExODeID7ZB5k9-IFe1w"
              alt="Giao diện dashboard quản lý tài chính SalaryCycle"
              width={1200}
              height={675}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </header>
  );
}
