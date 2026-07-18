const features = [
  {
    icon: "calendar_month",
    title: "Theo dõi chu kỳ",
    description: "Tự động tính toán ngân sách theo ngày nhận lương và chu kỳ tài chính của bạn.",
  },
  {
    icon: "security",
    title: "Hạn mức chi tiêu",
    description: "Biết chính xác số tiền 'an toàn' để tiêu mỗi ngày mà không lạm vào tiết kiệm.",
  },
  {
    icon: "account_balance_wallet",
    title: "Quản lý ví & thẻ",
    description: "Đồng bộ hóa tất cả tài khoản ngân hàng và thẻ tín dụng tại một nơi duy nhất.",
  },
  {
    icon: "rule",
    title: "Đối chiếu thực tế",
    description: "So sánh kế hoạch ban đầu và thực tế chi tiêu để luôn giữ vững kỷ luật tài chính.",
  },
];

export function Features() {
  return (
    <section className="py-24 px-6 bg-surface-container-low relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-headline-lg text-headline-lg mb-4">Tính năng ưu việt</h2>
          <p className="text-on-surface-variant max-w-xl mx-auto">
            Được thiết kế để đơn giản hóa quá trình quản lý tiền bạc của bạn.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="bento-card p-8 rounded-2xl">
              <span className="material-symbols-outlined text-primary text-4xl mb-4">{feature.icon}</span>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-body-sm text-on-surface-variant">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
