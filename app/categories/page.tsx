import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FlowBudget - Danh mục chi tiêu",
};

const GLASS_CARD_BORDER_STYLE = { borderColor: "rgba(226, 232, 240, 0.5)" };

export default function CategoriesPage() {
  return (
    <>
      {/* Side Navigation Shell */}
      <aside className="h-screen w-72 flex flex-col fixed left-0 top-0 bg-white/70 backdrop-blur-xl border-r border-outline-variant/30 shadow-2xl py-8 px-6 z-50">
        <div className="mb-10">
          <h1 className="font-display-lg text-display-lg font-black tracking-tighter text-primary">
            FlowBudget
          </h1>
        </div>
        <div className="flex items-center gap-4 mb-10 p-3 rounded-[0.75rem] bg-surface-container-low/50">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-full h-full object-cover"
              data-alt="A professional headshot of a refined male executive in his early 30s, wearing a crisp white shirt against a soft blue studio background. The lighting is bright and airy, reflecting a clean and trustworthy financial services brand aesthetic. Professional, high-end photography style with shallow depth of field."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAa2G76GmHrQRDB0a7AbLommz-Y4BHVZu0dX4Hgpl7N4fuBJN4YCDXqwnOg3yAEnUtHMCXPLk8BSvwo-ikpQIio2hV1w_5cvEgitDMAwYyDXndNWG8v0MlZelkHFzlxB5h8aeM3WSIbPDYwHQQvyweqlC8II9afwB5IHO6mlnGVRJPzuzGScoHWfVICpnyHT8_DE-BVYEQOoweqMa6E2Tw6xdt7S6k3jIl51opwRJFhlDTRIIeIukVu2CGkyMVSVKGpCBcHmBh-fQ"
            />
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface">
              Alex Sterling
            </p>
            <p className="font-label-sm text-label-sm text-primary">
              $124,592.00
            </p>
          </div>
        </div>
        <nav className="flex-1 space-y-2">
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-highest/40 transition-all duration-300"
            href="#"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-label-md text-label-md">Dashboard</span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-highest/40 transition-all duration-300"
            href="#"
          >
            <span className="material-symbols-outlined">payments</span>
            <span className="font-label-md text-label-md">Transactions</span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary font-bold border-r-4 border-primary bg-surface-container-low/50"
            href="#"
          >
            <span className="material-symbols-outlined">category</span>
            <span className="font-label-md text-label-md">Categories</span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-highest/40 transition-all duration-300"
            href="#"
          >
            <span className="material-symbols-outlined">
              account_balance_wallet
            </span>
            <span className="font-label-md text-label-md">Accounts</span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-highest/40 transition-all duration-300"
            href="#"
          >
            <span className="material-symbols-outlined">savings</span>
            <span className="font-label-md text-label-md">Savings</span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-highest/40 transition-all duration-300"
            href="#"
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="font-label-md text-label-md">Settings</span>
          </a>
        </nav>
        <div className="mt-auto space-y-2 pt-6 border-t border-outline-variant/20">
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-highest/40 transition-all duration-300"
            href="#"
          >
            <span className="material-symbols-outlined">help_outline</span>
            <span className="font-label-md text-label-md">Support</span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-highest/40 transition-all duration-300"
            href="#"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-md text-label-md">Logout</span>
          </a>
        </div>
      </aside>
      {/* Main Content Area */}
      <main className="ml-72 min-h-screen bg-background">
        {/* Top Nav Bar Shell */}
        <header className="flex justify-between items-center w-full h-20 px-8 sticky top-0 z-40 bg-surface/80 backdrop-blur-md shadow-sm">
          <div className="flex items-center gap-8">
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
              Categories
            </h2>
            <nav className="hidden md:flex gap-6">
              <a
                className="font-label-sm text-label-sm text-primary font-semibold border-b-2 border-primary pb-1"
                href="#"
              >
                Chi tiêu
              </a>
              <a
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors"
                href="#"
              >
                Thu nhập
              </a>
              <a
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors"
                href="#"
              >
                Yêu thích
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-highest/40 transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">
                search
              </span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-highest/40 transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">
                notifications
              </span>
            </button>
            <button className="bg-primary text-white px-6 py-2.5 rounded-full font-label-md text-label-md hover:scale-[1.02] active:scale-[0.98] transition-all soft-shadow">
              Thêm danh mục
            </button>
          </div>
        </header>
        {/* Page Content */}
        <div className="p-margin max-w-7xl mx-auto">
          {/* Category Overview Section with Donut Chart */}
          <section className="mb-xxl grid grid-cols-1 lg:grid-cols-3 gap-gutter items-center">
            <div
              className="lg:col-span-2 glass-card rounded-3xl p-10 soft-shadow"
              style={GLASS_CARD_BORDER_STYLE}
            >
              <div className="max-w-xl">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm mb-4">
                  Tổng quan tháng này
                </span>
                <h3 className="font-headline-lg text-headline-lg text-on-surface mb-2">
                  Quản lý chi tiêu thông minh
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Theo dõi các danh mục chi tiêu của bạn qua biểu đồ trực quan
                  để kiểm soát ngân sách hiệu quả hơn.
                </p>
                <div className="mt-8 flex gap-8">
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                      Tổng chi tiêu
                    </p>
                    <p className="font-headline-lg text-headline-lg text-primary">
                      $4,280.50
                    </p>
                  </div>
                  <div className="border-l border-outline-variant/30 pl-8">
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                      Hạn mức còn lại
                    </p>
                    <p className="font-headline-lg text-headline-lg text-tertiary-container">
                      $1,719.50
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Donut Chart Inspired by Reference */}
            <div
              className="glass-card rounded-3xl p-8 soft-shadow flex items-center justify-center relative h-full"
              style={GLASS_CARD_BORDER_STYLE}
            >
              <svg className="circular-chart" viewBox="0 0 36 36">
                <path
                  className="circle-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                ></path>
                <path
                  className="circle stroke-primary"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                  strokeDasharray="70, 100"
                ></path>
                <path
                  className="circle stroke-[#fb7185]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                  strokeDasharray="20, 100"
                  strokeDashoffset="-70"
                ></path>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  Chi phí
                </p>
                <p className="font-headline-md text-headline-md text-on-surface">
                  8.505.000 đ
                </p>
                <p className="font-label-sm text-label-sm text-tertiary-container">
                  0 đ
                </p>
              </div>
            </div>
          </section>
          {/* Expense Categories Section with Minimalist Grid */}
          <section className="mb-xxl">
            <div className="flex justify-between items-center mb-lg">
              <div>
                <h4 className="font-headline-md text-headline-md text-on-surface">
                  Danh mục Chi tiêu
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Phân bổ nguồn vốn vào các mục đích thiết yếu
                </p>
              </div>
              <button className="flex items-center gap-2 text-primary font-label-md text-label-md hover:underline">
                Sắp xếp{" "}
                <span className="material-symbols-outlined text-sm">
                  swap_vert
                </span>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-y-10 gap-x-gutter">
              {/* Category Item 1 */}
              <div className="flex flex-col items-center text-center group cursor-pointer">
                <p className="font-label-md text-label-md text-on-surface mb-1">
                  Bách hóa
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant/60 mb-3">
                  0 đ
                </p>
                <div className="w-16 h-16 rounded-full bg-[#3b82f6] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined text-3xl text-white">
                    shopping_basket
                  </span>
                </div>
                <p className="font-label-md text-label-md text-[#3b82f6]">
                  4.945.000 đ
                </p>
              </div>
              {/* Category Item 2 */}
              <div className="flex flex-col items-center text-center group cursor-pointer">
                <p className="font-label-md text-label-md text-on-surface mb-1">
                  Nhà hàng
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant/60 mb-3">
                  0 đ
                </p>
                <div className="w-16 h-16 rounded-full bg-[#f1f5f9] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-outline-variant/30">
                  <span className="material-symbols-outlined text-3xl text-[#64748b]">
                    restaurant
                  </span>
                </div>
                <p className="font-label-md text-label-md text-on-surface-variant">
                  0 đ
                </p>
              </div>
              {/* Category Item 3 */}
              <div className="flex flex-col items-center text-center group cursor-pointer">
                <p className="font-label-md text-label-md text-on-surface mb-1">
                  Giải trí
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant/60 mb-3">
                  0 đ
                </p>
                <div className="w-16 h-16 rounded-full bg-[#fae8ff] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl text-[#d946ef]">
                    confirmation_number
                  </span>
                </div>
                <p className="font-label-md text-label-md text-on-surface-variant">
                  0 đ
                </p>
              </div>
              {/* Category Item 4 */}
              <div className="flex flex-col items-center text-center group cursor-pointer">
                <p className="font-label-md text-label-md text-on-surface mb-1">
                  Vận chuyển
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant/60 mb-3">
                  0 đ
                </p>
                <div className="w-16 h-16 rounded-full bg-[#fff7ed] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl text-[#f97316]">
                    directions_bus
                  </span>
                </div>
                <p className="font-label-md text-label-md text-on-surface-variant">
                  0 đ
                </p>
              </div>
              {/* Category Item 5 */}
              <div className="flex flex-col items-center text-center group cursor-pointer">
                <p className="font-label-md text-label-md text-on-surface mb-1">
                  Sức khoẻ
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant/60 mb-3">
                  0 đ
                </p>
                <div className="w-16 h-16 rounded-full bg-[#f0fdf4] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl text-[#22c55e]">
                    favorite
                  </span>
                </div>
                <p className="font-label-md text-label-md text-on-surface-variant">
                  0 đ
                </p>
              </div>
              {/* Category Item 6 */}
              <div className="flex flex-col items-center text-center group cursor-pointer">
                <p className="font-label-md text-label-md text-on-surface mb-1">
                  Mua sắm
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant/60 mb-3">
                  0 đ
                </p>
                <div className="w-16 h-16 rounded-full bg-[#f8fafc] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-outline-variant/30">
                  <span className="material-symbols-outlined text-3xl text-[#64748b]">
                    shopping_bag
                  </span>
                </div>
                <p className="font-label-md text-label-md text-on-surface-variant">
                  0 đ
                </p>
              </div>
              {/* Category Item 7 */}
              <div className="flex flex-col items-center text-center group cursor-pointer">
                <p className="font-label-md text-label-md text-on-surface mb-1">
                  Phòng trọ
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant/60 mb-3">
                  0 đ
                </p>
                <div className="w-16 h-16 rounded-full bg-[#f43f5e] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg shadow-error/20">
                  <span className="material-symbols-outlined text-3xl text-white">
                    home
                  </span>
                </div>
                <p className="font-label-md text-label-md text-[#f43f5e]">
                  1.700.000 đ
                </p>
              </div>
              {/* Category Item 8 */}
              <div className="flex flex-col items-center text-center group cursor-pointer">
                <p className="font-label-md text-label-md text-on-surface mb-1">
                  Điện, nước
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant/60 mb-3">
                  0 đ
                </p>
                <div className="w-16 h-16 rounded-full bg-[#e11d48] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg shadow-error/20">
                  <span className="material-symbols-outlined text-3xl text-white">
                    bolt
                  </span>
                </div>
                <p className="font-label-md text-label-md text-[#e11d48]">
                  520.000 đ
                </p>
              </div>
              {/* Category Item 9 */}
              <div className="flex flex-col items-center text-center group cursor-pointer">
                <p className="font-label-md text-label-md text-on-surface mb-1">
                  Nước 1
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant/60 mb-3">
                  0 đ
                </p>
                <div className="w-16 h-16 rounded-full bg-[#eff6ff] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl text-[#3b82f6]">
                    water_drop
                  </span>
                </div>
                <p className="font-label-md text-label-md text-on-surface-variant">
                  0 đ
                </p>
              </div>
              {/* Add New Category */}
              <div className="flex flex-col items-center text-center group cursor-pointer">
                <p className="font-label-md text-label-md text-on-surface mb-1">
                  Thêm...
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant/60 mb-3">
                  0 đ
                </p>
                <div className="w-16 h-16 rounded-full bg-[#94a3b8] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl text-white">
                    keyboard_arrow_down
                  </span>
                </div>
                <p className="font-label-md text-label-md text-[#94a3b8]">
                  1.340.000 đ
                </p>
              </div>
            </div>
          </section>
          {/* Income Categories Section */}
          <section className="mb-xxl">
            <div className="flex justify-between items-center mb-lg">
              <div>
                <h4 className="font-headline-md text-headline-md text-on-surface">
                  Danh mục Thu nhập
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Các nguồn dòng tiền chảy vào
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-y-10 gap-x-gutter">
              {/* Income Category 1 */}
              <div className="flex flex-col items-center text-center group cursor-pointer">
                <p className="font-label-md text-label-md text-on-surface mb-1">
                  Lương chính
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant/60 mb-3">
                  1 giao dịch
                </p>
                <div className="w-16 h-16 rounded-full bg-[#dcfce7] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl text-[#16a34a]">
                    payments
                  </span>
                </div>
                <p className="font-label-md text-label-md text-[#16a34a]">
                  5.000.000 đ
                </p>
              </div>
              {/* Income Category 2 */}
              <div className="flex flex-col items-center text-center group cursor-pointer">
                <p className="font-label-md text-label-md text-on-surface mb-1">
                  Đầu tư
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant/60 mb-3">
                  5 giao dịch
                </p>
                <div className="w-16 h-16 rounded-full bg-[#dbeafe] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl text-[#2563eb]">
                    trending_up
                  </span>
                </div>
                <p className="font-label-md text-label-md text-[#2563eb]">
                  1.200.000 đ
                </p>
              </div>
              {/* Income Category 3 */}
              <div className="flex flex-col items-center text-center group cursor-pointer">
                <p className="font-label-md text-label-md text-on-surface mb-1">
                  Quà tặng
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant/60 mb-3">
                  2 giao dịch
                </p>
                <div className="w-16 h-16 rounded-full bg-[#fff1f2] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl text-[#e11d48]">
                    card_giftcard
                  </span>
                </div>
                <p className="font-label-md text-label-md text-[#e11d48]">
                  300.000 đ
                </p>
              </div>
            </div>
          </section>
          {/* Bottom Analysis Bento */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter pb-xxl">
            <div
              className="lg:col-span-2 glass-card soft-shadow rounded-3xl p-8"
              style={GLASS_CARD_BORDER_STYLE}
            >
              <h4 className="font-headline-md text-headline-md text-on-surface mb-6">
                Thống kê theo thời gian
              </h4>
              <div className="h-64 flex items-end justify-between gap-4">
                <div
                  className="w-full bg-surface-container rounded-t-lg relative"
                  style={{ height: "60%" }}
                >
                  <div className="absolute inset-0 bg-primary/20 rounded-t-lg transition-all hover:bg-primary/30 cursor-pointer"></div>
                </div>
                <div
                  className="w-full bg-surface-container rounded-t-lg relative"
                  style={{ height: "40%" }}
                >
                  <div className="absolute inset-0 bg-primary/20 rounded-t-lg transition-all hover:bg-primary/30 cursor-pointer"></div>
                </div>
                <div
                  className="w-full bg-surface-container rounded-t-lg relative"
                  style={{ height: "85%" }}
                >
                  <div className="absolute inset-0 bg-primary/20 rounded-t-lg transition-all hover:bg-primary/30 cursor-pointer"></div>
                </div>
                <div
                  className="w-full bg-surface-container rounded-t-lg relative"
                  style={{ height: "55%" }}
                >
                  <div className="absolute inset-0 bg-primary/20 rounded-t-lg transition-all hover:bg-primary/30 cursor-pointer"></div>
                </div>
                <div
                  className="w-full bg-surface-container rounded-t-lg relative"
                  style={{ height: "70%" }}
                >
                  <div className="absolute inset-0 bg-primary/20 rounded-t-lg transition-all hover:bg-primary/30 cursor-pointer"></div>
                </div>
                <div
                  className="w-full bg-surface-container rounded-t-lg relative"
                  style={{ height: "95%" }}
                >
                  <div className="absolute inset-0 bg-primary rounded-t-lg transition-all hover:bg-primary/90 cursor-pointer"></div>
                </div>
                <div
                  className="w-full bg-surface-container rounded-t-lg relative"
                  style={{ height: "50%" }}
                >
                  <div className="absolute inset-0 bg-primary/20 rounded-t-lg transition-all hover:bg-primary/30 cursor-pointer"></div>
                </div>
              </div>
              <div className="flex justify-between mt-4 text-on-surface-variant font-label-sm text-label-sm px-1">
                <span>T2</span>
                <span>T3</span>
                <span>T4</span>
                <span>T5</span>
                <span>T6</span>
                <span className="text-primary font-bold">T7</span>
                <span>CN</span>
              </div>
            </div>
            <div
              className="glass-card soft-shadow rounded-3xl p-8 flex flex-col justify-between"
              style={GLASS_CARD_BORDER_STYLE}
            >
              <div>
                <h4 className="font-headline-md text-headline-md text-on-surface mb-2">
                  Thông tin thú vị
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Bạn đã chi tiêu ít hơn 12% cho <strong>Bách hóa</strong> so
                  với tuần trước.
                </p>
              </div>
              <div className="mt-8">
                <div className="w-full h-40 rounded-2xl overflow-hidden mb-4 bg-primary-fixed">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="w-full h-full object-cover"
                    data-alt="A clean and modern minimalist abstract digital illustration showing several glass-like credit cards floating in a soft, airy blue and purple gradient space. The lighting is ethereal and high-key, maintaining a premium fintech brand aesthetic. Soft shadows and high-quality 3D render style."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1_-SSgKfsn2NnwvBniSvt0WoVXH0UswfvFruh4tOTJucC76B7Cga4q3nyB32YxZ22kAw5pDQ03pPMR-hwFfcHlCECvxrKHTn5_Aqy1vzO369eoPRgLGKm9j1tP61rMTyv4k0dYZcWYbTLknGG46EkqeSlxFaebuXSBzf6GHwB0rQgQjCapUrwMLaN_5m45sr0qXZKEV9EqrpV-Sk-_gRNS3D6-IPycnh_-pSM-arBKe2lz6QLUv5V3mB-4-7yQ3HNb9NQ2K_9Iw"
                  />
                </div>
                <button className="w-full py-3 rounded-[0.75rem] border border-primary/20 text-primary font-label-md text-label-md hover:bg-primary/5 transition-colors">
                  Xem báo cáo chi tiết
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
      {/* Contextual FAB (Mobile/Tablet specific but shown as fixed here) */}
      <button className="fixed bottom-margin right-margin w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all z-50 md:hidden">
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </>
  );
}
