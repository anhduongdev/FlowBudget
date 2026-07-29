import Link from "next/link";
import { getCurrentUser } from "@/lib/services/auth-service";
import { ScrollReveal } from "./scroll-reveal";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <>
      <ScrollReveal />
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
        <div className="flex justify-between items-center w-full px-margin py-4 max-w-7xl mx-auto">
          <div className="text-headline-md font-headline-md font-extrabold text-primary tracking-tight">
            FlowBudget
          </div>
          <div className="hidden md:flex items-center space-x-lg">
            <a
              className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-105"
              href="#features"
            >
              Tính năng
            </a>
            <a
              className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-105"
              href="#benefits"
            >
              Lợi ích
            </a>
            <a
              className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-105"
              href="#pricing"
            >
              Giá cả
            </a>
          </div>
          <div className="flex items-center space-x-md">
            {user ? (
              <Link
                className="bg-primary text-white font-label-md px-6 py-2 rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all transform active:scale-95 flex items-center gap-2"
                href="/dashboard"
              >
                <span className="material-symbols-outlined text-[20px]">
                  space_dashboard
                </span>
                Vào ứng dụng
              </Link>
            ) : (
              <>
                <Link
                  className="text-primary font-label-md px-4 py-2 hover:bg-surface-variant rounded-xl transition-all"
                  href="/login"
                >
                  Đăng nhập
                </Link>
                <Link
                  className="bg-primary text-white font-label-md px-6 py-2 rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all transform active:scale-95"
                  href="/register"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-24 overflow-hidden">
        {/* Hero Section */}
        <section className="relative px-margin py-xxl md:py-32 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl items-center">
            <div className="z-10 text-center lg:text-left">
              <span className="inline-block px-4 py-1.5 mb-md rounded-full bg-primary-container text-white font-label-sm uppercase tracking-widest animate-pulse">
                Quản lý tài chính 4.0
              </span>
              <h1 className="font-display-lg text-[40px] md:text-display-lg text-on-background leading-tight mb-md">
                Làm chủ tài chính,
                <br />
                <span className="text-primary">xây dựng tương lai</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl max-w-xl mx-auto lg:mx-0">
                Nền tảng quản lý chi tiêu thông minh giúp bạn kiểm soát dòng
                tiền, tối ưu hóa tiết kiệm và đạt được tự do tài chính nhanh
                hơn bao giờ hết.
              </p>
              <div className="flex flex-col sm:flex-row gap-md justify-center lg:justify-start">
                <Link
                  className="primary-gradient text-white px-8 py-4 rounded-xl font-label-md text-center hover:shadow-xl hover:shadow-primary/30 transition-all transform hover:-translate-y-1"
                  href={user ? "/dashboard" : "/register"}
                >
                  Bắt đầu ngay
                </Link>
                <a
                  className="flex items-center justify-center gap-2 border border-outline-variant px-8 py-4 rounded-xl font-label-md text-on-surface-variant hover:bg-white transition-all"
                  href="#demo"
                >
                  <span className="material-symbols-outlined">
                    play_circle
                  </span>
                  Xem hướng dẫn
                </a>
              </div>
            </div>
            <div className="relative mt-xl lg:mt-0">
              {/* Glassmorphism Dashboard Decor */}
              <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 animate-blob"></div>
              <div className="absolute -bottom-12 -right-12 w-72 h-72 bg-tertiary/10 rounded-full blur-3xl -z-10 animate-blob animation-delay-2000"></div>
              <div className="relative bg-white/40 p-2 rounded-[24px] shadow-2xl border border-white/50 backdrop-blur-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-auto rounded-[16px] shadow-sm"
                  alt="Giao diện bảng điều khiển FlowBudget hiển thị biểu đồ chi tiêu và lịch sử giao dịch"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgGUIEJO-okBo16wirVmCE44T18asSvVt6J8tYTIus0Kw3ZzpbUSUGBLHLtD2O2F56ybR9OFgMXm2_FC9xPhtr9m8-qdPvGpQ_gV4x-7M5YmpnbjQOsH5ElTHT29BaSqwea1nXvMIbe3iCFatjbR0Pe9ExDKVaZSceTfuwxKXgAQ6CkV48jwIsMlHltnBy01sonxNCKnwwhLxlYWj_pV8e2l0oTkChEyiokzDB8tiZfViw_WqhNTj3MgYQCxlDU9YAJO7iURCucw"
                />
              </div>
              {/* Floating Mini Cards */}
              <div className="absolute -bottom-6 -left-10 hidden md:block animate-bounce-slow">
                <div className="glass-card p-4 rounded-xl shadow-xl flex items-center gap-md">
                  <div className="w-10 h-10 rounded-full bg-tertiary/20 flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined">
                      trending_up
                    </span>
                  </div>
                  <div>
                    <p className="text-label-sm text-on-surface-variant">
                      Tiết kiệm tháng này
                    </p>
                    <p className="font-bold text-on-surface">+15.2%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="bg-surface py-xxl md:py-32" id="features">
          <div className="max-w-7xl mx-auto px-margin">
            <div className="text-center mb-xxl">
              <h2 className="font-headline-lg text-headline-lg mb-md">
                Giải pháp toàn diện cho bạn
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
                Mọi công cụ bạn cần để quản lý tiền bạc hiệu quả được tích hợp
                trong một nền tảng duy nhất.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover-lift">
                <div className="w-14 h-14 rounded-2xl bg-primary-container/10 flex items-center justify-center text-primary mb-lg">
                  <span className="material-symbols-outlined text-3xl">
                    receipt_long
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md mb-md">
                  Quản lý giao dịch
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Ghi chép nhanh chóng mọi khoản thu chi, hệ thống tự động
                  phân loại thông minh giúp bạn không bao giờ bỏ sót giao dịch
                  nào.
                </p>
              </div>
              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover-lift">
                <div className="w-14 h-14 rounded-2xl bg-tertiary-container/10 flex items-center justify-center text-tertiary-container mb-lg">
                  <span className="material-symbols-outlined text-3xl">
                    pie_chart
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md mb-md">
                  Báo cáo trực quan
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Biểu đồ phân tích chi tiết về thu nhập và chi tiêu theo
                  tuần, tháng. Hiểu rõ dòng tiền của mình đang đi đâu chỉ với
                  một cái nhìn.
                </p>
              </div>
              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover-lift">
                <div className="w-14 h-14 rounded-2xl bg-secondary-container/10 flex items-center justify-center text-secondary mb-lg">
                  <span className="material-symbols-outlined text-3xl">
                    account_balance_wallet
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md mb-md">
                  Tài khoản đa dạng
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Quản lý tất cả tiền mặt, thẻ ngân hàng, sổ tiết kiệm và các
                  khoản đầu tư tại một nơi duy nhất. Luôn cập nhật số dư tổng
                  thể.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section
          className="py-xxl md:py-32 max-w-7xl mx-auto px-margin"
          id="benefits"
        >
          <div className="flex flex-col lg:flex-row items-center gap-xxl">
            <div className="flex-1 order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-md">
                <div className="bg-primary/5 p-8 rounded-xl">
                  <div className="text-4xl font-extrabold text-primary mb-sm">
                    15%+
                  </div>
                  <p className="font-body-md text-on-surface-variant">
                    Tiết kiệm trung bình mỗi tháng của người dùng FlowBudget.
                  </p>
                </div>
                <div className="bg-tertiary/5 p-8 rounded-xl">
                  <div className="text-4xl font-extrabold text-tertiary mb-sm">
                    100%
                  </div>
                  <p className="font-body-md text-on-surface-variant">
                    Giảm bớt áp lực tài chính thông qua kế hoạch rõ ràng.
                  </p>
                </div>
                <div className="bg-secondary-container/20 p-8 rounded-xl col-span-2">
                  <div className="flex items-center gap-md">
                    <span className="material-symbols-outlined text-primary text-4xl">
                      verified
                    </span>
                    <p className="font-headline-md text-headline-md">
                      Bảo mật đa lớp tiêu chuẩn ngân hàng
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 order-1 lg:order-2">
              <span className="text-primary font-label-md uppercase tracking-widest mb-md block">
                Tại sao chọn chúng tôi?
              </span>
              <h2 className="font-headline-lg text-headline-lg mb-xl leading-tight">
                Thay đổi thói quen,
                <br />
                thay đổi cuộc đời
              </h2>
              <ul className="space-y-lg">
                <li className="flex items-start gap-md">
                  <span className="material-symbols-outlined text-tertiary bg-tertiary/10 p-1 rounded-full">
                    check
                  </span>
                  <p className="font-body-lg text-on-surface">
                    Tiết kiệm hơn 15% mỗi tháng nhờ cắt giảm chi phí lãng phí
                    không cần thiết.
                  </p>
                </li>
                <li className="flex items-start gap-md">
                  <span className="material-symbols-outlined text-tertiary bg-tertiary/10 p-1 rounded-full">
                    check
                  </span>
                  <p className="font-body-lg text-on-surface">
                    Giảm stress về tiền bạc bằng cách luôn biết trước số dư
                    cho các dự định tương lai.
                  </p>
                </li>
                <li className="flex items-start gap-md">
                  <span className="material-symbols-outlined text-tertiary bg-tertiary/10 p-1 rounded-full">
                    check
                  </span>
                  <p className="font-body-lg text-on-surface">
                    Tự động hóa hoàn toàn việc nhắc nhở hóa đơn, không bao giờ
                    trễ hạn thanh toán.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-surface-container py-xxl md:py-32">
          <div className="max-w-7xl mx-auto px-margin">
            <h2 className="font-headline-lg text-headline-lg text-center mb-xxl">
              Khách hàng nói gì về FlowBudget
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {/* Testimonial 1 */}
              <div className="bg-white p-lg rounded-xl shadow-sm border border-outline-variant/30">
                <div className="flex items-center gap-md mb-md">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="w-full h-full object-cover"
                      alt=""
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0UH-5oolqJa7PNN1ISftH1Hwrg_uS6sQA6x-144-gWASl3hW5Orf9PWsvvFaJzUjvxPzIEkqnnH61-G5rLbztlP4ov4lQgUvKzr9ProSDwpEJCRdb_oEnKHiBOfSrqj7xSCdNDkZlT1r_JSyLoLALMpJd00cgJxOWJRYqMY0UIUk0z3_fuUOpo6v-fbDW6y6LJgZtpm586vBnMHnDxAkq5kjqGNo5dVOfiq5LlBWdn6hETnS5Q91rezX6FYBI8hShLJPQARmT1A"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">
                      Nguyễn Thu Hà
                    </p>
                    <p className="text-label-sm text-on-surface-variant">
                      Giám đốc Marketing
                    </p>
                  </div>
                </div>
                <p className="italic text-on-surface-variant">
                  &quot;FlowBudget đã hoàn toàn thay đổi cách tôi quản lý tiền
                  bạc. Lần đầu tiên tôi thực sự biết tiền của mình đã đi đâu
                  mỗi tháng!&quot;
                </p>
                <div className="mt-md text-primary flex">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                </div>
              </div>
              {/* Testimonial 2 */}
              <div className="bg-white p-lg rounded-xl shadow-sm border border-outline-variant/30">
                <div className="flex items-center gap-md mb-md">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="w-full h-full object-cover"
                      alt=""
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAW7vg8ChTRU4zSHfAhNyV4J0Dj2E7dhTVbThVxyuSRiHNRPo4f4pYp-RMBZFX1IFlDE40bgV2WUjDJWY8lbmGFI_P6DQ7B3VSby4rdrKEH4PnmFyZAwlVSJGgqpQ9lmVEECUsySMCxit4uDLH3L9sEXBnJEJACuLEP3SUBfWf6vddcbEtecyAEQb1ovkxbo6HbBttipZcr50LmMOyBc4b48gjSztmZits6DT1d-Q_6uYgtEQ5AtpI4ebDIw53sZEy7DMxrsSPl4Q"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">
                      Trần Minh Quân
                    </p>
                    <p className="text-label-sm text-on-surface-variant">
                      Freelancer IT
                    </p>
                  </div>
                </div>
                <p className="italic text-on-surface-variant">
                  &quot;Là người làm tự do, thu nhập không ổn định khiến tôi
                  rất lo lắng. Nhờ FlowBudget, tôi đã thiết lập được quỹ dự
                  phòng 6 tháng.&quot;
                </p>
                <div className="mt-md text-primary flex">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                </div>
              </div>
              {/* Testimonial 3 */}
              <div className="bg-white p-lg rounded-xl shadow-sm border border-outline-variant/30">
                <div className="flex items-center gap-md mb-md">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="w-full h-full object-cover"
                      alt=""
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAU33iOlC6mZ8CcPk5MctbczoOQoMWokH7XpmgC3u4ZG228ryA4Ma0w4NpMZ7Zk3BqzL9r-VYZb0ahDak-KT-mdtIdp5ItpxYWkyLEgoNQAkBc3HSASDP_WWPvP2916qb2sydN1JZ6HhzHx8hWACkcV5c50pLvFmDkLFkpzJMpugiwxFEgZ2HUx3YB1UyqmbC6al-yZYjHwzHqEjDmrLS6WblsfIElkZ15nkoOtrd6PsYui2OdxG_8jLr3rVz1rN9mOOGJmlqJ_BA"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">Lê Hoàng Nam</p>
                    <p className="text-label-sm text-on-surface-variant">
                      Chủ cửa hàng
                    </p>
                  </div>
                </div>
                <p className="italic text-on-surface-variant">
                  &quot;Giao diện dễ dùng đến bất ngờ. Tôi không phải là
                  người rành công nghệ nhưng vẫn có thể làm quen trong vòng 5
                  phút.&quot;
                </p>
                <div className="mt-md text-primary flex">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-xxl md:py-32" id="signup">
          <div className="max-w-4xl mx-auto px-margin text-center">
            <div className="primary-gradient p-12 md:p-20 rounded-[32px] text-white overflow-hidden relative shadow-2xl">
              {/* Background blobs for CTA */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
              <h2 className="font-display-lg text-headline-lg md:text-display-lg mb-md relative z-10">
                Sẵn sàng quản lý tài chính?
              </h2>
              <p className="font-body-lg text-body-lg text-white/80 mb-xl max-w-xl mx-auto relative z-10">
                Tham gia cùng hơn 50.000+ người dùng đang tối ưu hóa tương
                lai tài chính của họ ngay hôm nay. Miễn phí trọn đời cho các
                tính năng cơ bản.
              </p>
              <div className="flex flex-col sm:flex-row gap-md justify-center relative z-10">
                <Link
                  className="bg-white text-primary px-10 py-4 rounded-xl font-headline-md hover:scale-105 transition-transform"
                  href={user ? "/dashboard" : "/register"}
                >
                  {user ? "Vào ứng dụng" : "Đăng ký miễn phí"}
                </Link>
                <button className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-10 py-4 rounded-xl font-headline-md hover:bg-white/30 transition-all">
                  Liên hệ hỗ trợ
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface dark:bg-inverse-surface w-full py-xxl border-t border-outline-variant">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter px-margin max-w-7xl mx-auto items-start">
          <div className="space-y-md">
            <div className="text-headline-md font-headline-md font-extrabold text-primary">
              FlowBudget
            </div>
            <p className="font-body-md text-on-surface-variant max-w-xs">
              Giải pháp quản lý tài chính cá nhân hàng đầu cho người Việt
              trẻ.
            </p>
            <div className="flex gap-md">
              <a
                className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                href="#"
              >
                <span className="material-symbols-outlined">qr_code_2</span>
              </a>
              <a
                className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                href="#"
              >
                <span className="material-symbols-outlined">
                  alternate_email
                </span>
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-xl">
            <div>
              <h4 className="font-label-md mb-md uppercase tracking-wider text-on-surface">
                Sản phẩm
              </h4>
              <ul className="space-y-sm text-on-surface-variant">
                <li>
                  <a
                    className="hover:text-primary transition-colors"
                    href="#"
                  >
                    Tính năng
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-primary transition-colors"
                    href="#"
                  >
                    Bảng giá
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-primary transition-colors"
                    href="#"
                  >
                    Mobile App
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-label-md mb-md uppercase tracking-wider text-on-surface">
                Hỗ trợ
              </h4>
              <ul className="space-y-sm text-on-surface-variant">
                <li>
                  <a
                    className="hover:text-primary transition-colors"
                    href="#"
                  >
                    Liên hệ
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-primary transition-colors"
                    href="#"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-primary transition-colors"
                    href="#"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="space-y-md">
            <h4 className="font-label-md uppercase tracking-wider text-on-surface">
              Đăng ký nhận tin
            </h4>
            <div className="flex gap-sm">
              <input
                className="flex-1 bg-surface-container border-none rounded-xl px-4 focus:ring-2 focus:ring-primary"
                placeholder="Email của bạn"
                type="email"
              />
              <button className="bg-primary text-white p-3 rounded-xl hover:bg-primary-container transition-colors">
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
            <p className="text-[12px] text-on-surface-variant">
              Chúng tôi cam kết bảo mật thông tin của bạn.
            </p>
          </div>
        </div>
        <div className="mt-xxl pt-xl border-t border-outline-variant/30 text-center text-label-sm text-on-surface-variant">
          © 2024 FlowBudget. All rights reserved.
        </div>
      </footer>
    </>
  );
}
