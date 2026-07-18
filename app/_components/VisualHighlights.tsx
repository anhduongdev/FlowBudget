import Image from "next/image";

export function VisualHighlights() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="order-2 lg:order-1 flex gap-4">
          <div className="w-2/3 h-[500px] rounded-3xl overflow-hidden border border-outline-variant shadow-2xl relative group">
            <Image
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKYR36bsBYzi3doyk2ziYgEhxiHP3IxhrmgSFeDkb_CHFKo8iI7VUeyj0HMQFDFacITsR3lNuwys94h0BV_8RcinEN0W_MCtVnONIw9vAcE42lmPTW-rBATKb0I7RXRWRbx8uegdmNGCyeExOMK6ImuTBpFViZVXfpztpKqt9pH14lX9U4Y7MhvNMnp3mbqcRVI6sG49ZqvbLoBSvlDacflBoglAUDgYSlYBfuMQ7q9Wb26Xw9n81N-w"
              alt="Dashboard theo dõi chu kỳ lương với vòng tiến trình và biểu đồ dòng tiền"
              fill
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-40" />
          </div>
          <div className="w-1/3 h-[400px] mt-12 rounded-3xl overflow-hidden border border-outline-variant shadow-2xl relative group">
            <Image
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK6K-IRoJw_njh9CgTJBvXuRFnfaXviWSkq_AkJdEKHVCNzIahRKBIJOPPxL3sEp_EFlyf5CsJtH4WvU4vZawM7nx-wRC8lBwiJ6FZJy98INkEFfsLvh9afpGzRV5VD2xNwNE9G4umAbqNxWwipvKqcrwKDX-uW7XAAgJqYYFuWon-xOflUeS4p-y6CGwPUSlPfwE755munRjhOqW_PouaNeMfbaDaLjY8XJzhXMlx8Dl7XDHTxbLT1Q"
              alt="Ứng dụng di động hiển thị ngân sách hằng ngày và giao dịch gần đây"
              fill
            />
          </div>
        </div>

        <div className="order-1 lg:order-2 space-y-8">
          <h2 className="font-headline-lg text-headline-lg">
            Mọi lúc, mọi nơi trên <span className="text-primary">mọi thiết bị</span>
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined">sync</span>
              </div>
              <div>
                <p className="font-bold">Đồng bộ đám mây</p>
                <p className="text-on-surface-variant text-body-sm">
                  Dữ liệu của bạn được cập nhật ngay lập tức trên cả Web và Di động.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined">notifications_active</span>
              </div>
              <div>
                <p className="font-bold">Thông báo thông minh</p>
                <p className="text-on-surface-variant text-body-sm">
                  Nhận cảnh báo khi bạn sắp vượt ngưỡng chi tiêu an toàn trong ngày.
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="bg-surface-variant hover:bg-outline-variant px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
              <span className="material-symbols-outlined">apps</span>
              App Store
            </button>
            <button className="bg-surface-variant hover:bg-outline-variant px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
              <span className="material-symbols-outlined">play_arrow</span>
              Google Play
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
