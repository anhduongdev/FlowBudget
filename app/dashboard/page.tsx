import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FlowBudget - Tổng quan",
};

const GLASS_CARD =
  "bg-white border border-slate-200/80 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]";

export default function DashboardPage() {
  return (
    <>
      {/* Sidebar Navigation */}
      <nav className="h-screen w-72 flex flex-col fixed left-0 top-0 bg-white border-r border-slate-200/50 shadow-sm py-8 px-6 z-50">
        <div className="mb-10">
          <span className="text-3xl font-black tracking-tighter text-primary">
            FlowBudget
          </span>
        </div>
        <div className="flex items-center gap-4 mb-10 p-3 rounded-[0.75rem] bg-slate-100/50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJJZjRKHBHS5p4Ji_8nkyCXS90royR7jFoIhqwvJu5yaXPrDY11V3e4TPHgBZABUQwgN9EPKdDGmNE5wMyDx9Q130XP09AG4xvgCCoH52kPADI9qXDEKsLvpA6hjH3p1lONGP_AX_Podo0LrGs4iavCAhAwDT01Y_2DergD0GAkUJRld398ojkcms0jRzNEI5xsPmhgD_mrd_GPTY66PirgEzWzTbY33_21BC7T6ZeX-H0ztVJslXxZErou4MCgz1JfCq2w5bVWQ"
          />
          <div>
            <p className="text-sm font-semibold text-on-surface">
              Alex Sterling
            </p>
            <p className="text-xs text-primary font-bold">9.166.000 ₫</p>
          </div>
        </div>
        <ul className="space-y-1 flex-grow">
          <li>
            <a
              className="flex items-center gap-3 py-3 px-4 rounded-lg text-primary font-bold bg-blue-50 transition-all"
              href="#"
            >
              <span className="material-symbols-outlined">dashboard</span>
              <span className="text-sm">Tổng quan</span>
            </a>
          </li>
          <li>
            <a
              className="flex items-center gap-3 py-3 px-4 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-all"
              href="#"
            >
              <span className="material-symbols-outlined">payments</span>
              <span className="text-sm">Giao dịch</span>
            </a>
          </li>
          <li>
            <a
              className="flex items-center gap-3 py-3 px-4 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-all"
              href="#"
            >
              <span className="material-symbols-outlined">
                account_balance_wallet
              </span>
              <span className="text-sm">Tài khoản</span>
            </a>
          </li>
          <li>
            <a
              className="flex items-center gap-3 py-3 px-4 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-all"
              href="#"
            >
              <span className="material-symbols-outlined">
                account_balance
              </span>
              <span className="text-sm">Ngân sách</span>
            </a>
          </li>
          <li>
            <a
              className="flex items-center gap-3 py-3 px-4 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-all"
              href="#"
            >
              <span className="material-symbols-outlined">category</span>
              <span className="text-sm">Danh mục</span>
            </a>
          </li>
          <li>
            <a
              className="flex items-center gap-3 py-3 px-4 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-all"
              href="#"
            >
              <span className="material-symbols-outlined">settings</span>
              <span className="text-sm">Cài đặt</span>
            </a>
          </li>
        </ul>
        <div className="mt-auto space-y-1 border-t border-slate-200 pt-6">
          <a
            className="flex items-center gap-3 py-3 px-4 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-all"
            href="#"
          >
            <span className="material-symbols-outlined">help_outline</span>
            <span className="text-sm">Hỗ trợ</span>
          </a>
          <a
            className="flex items-center gap-3 py-3 px-4 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all"
            href="#"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm">Đăng xuất</span>
          </a>
        </div>
      </nav>
      {/* Main Content Area */}
      <main className="ml-72 min-h-screen">
        {/* Top Navigation */}
        <header className="sticky top-0 z-40 flex justify-between items-center w-full h-16 px-8 bg-white/80 backdrop-blur-md border-b border-slate-200/30">
          <div>
            <h1 className="text-xl font-bold text-on-surface">Tổng quan</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <button className="px-4 py-1 text-xs font-semibold text-primary bg-white shadow-sm rounded-md">
                Ngày
              </button>
              <button className="px-4 py-1 text-xs font-semibold text-slate-500">
                Tuần
              </button>
              <button className="px-4 py-1 text-xs font-semibold text-slate-500">
                Tháng
              </button>
              <button className="px-4 py-1 text-xs font-semibold text-slate-500">
                Năm
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-all">
                <span className="material-symbols-outlined">
                  notifications
                </span>
              </button>
              <button className="bg-primary text-white px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-all">
                <span className="material-symbols-outlined text-[18px]">
                  add
                </span>
                Giao dịch mới
              </button>
            </div>
          </div>
        </header>
        {/* Content Canvas */}
        <div className="p-8 max-w-[1200px] mx-auto space-y-6">
          {/* Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Balance Card */}
            <div className="lg:col-span-2 rounded-2xl p-7 primary-gradient text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[180px]">
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <p className="text-xs font-medium opacity-80 uppercase tracking-wider">
                    Tổng số dư
                  </p>
                  <span className="material-symbols-outlined opacity-60">
                    account_balance_wallet
                  </span>
                </div>
                <h2 className="text-4xl font-bold mt-2">9.166.000 ₫</h2>
              </div>
              <div className="relative z-10 grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="text-[10px] opacity-60 uppercase font-bold tracking-widest mb-1">
                    Thu nhập tháng
                  </p>
                  <p className="text-lg font-semibold text-green-300">
                    +12.450.000
                  </p>
                </div>
                <div>
                  <p className="text-[10px] opacity-60 uppercase font-bold tracking-widest mb-1">
                    Chi tiêu tháng
                  </p>
                  <p className="text-lg font-semibold text-red-300">
                    -8.505.000
                  </p>
                </div>
              </div>
              {/* Decorative patterns */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            </div>
            {/* Summary Circular */}
            <div
              className={`${GLASS_CARD} rounded-2xl p-6 flex flex-col items-center justify-center text-center`}
            >
              <div className="relative w-28 h-28 mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    className="text-slate-100"
                    cx="56"
                    cy="56"
                    fill="transparent"
                    r="50"
                    stroke="currentColor"
                    strokeWidth="10"
                  ></circle>
                  <circle
                    className="text-primary"
                    cx="56"
                    cy="56"
                    fill="transparent"
                    r="50"
                    stroke="currentColor"
                    strokeDasharray="314.15"
                    strokeDashoffset="78.5"
                    strokeWidth="10"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-xs text-slate-400 font-medium">
                    Chi phí
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    8.505.000 ₫
                  </p>
                </div>
              </div>
              <div className="w-full bg-slate-50 rounded-lg p-3 text-left">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">
                  Tiết kiệm tháng này
                </p>
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-bold text-primary">
                    3.945.000 ₫
                  </span>
                  <span className="text-[10px] text-green-600 font-bold">
                    +12%
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left: Recent Transactions (Timeline style) */}
            <div className="xl:col-span-7 space-y-6">
              <div className={`${GLASS_CARD} rounded-2xl overflow-hidden`}>
                <div className="p-6 border-b border-slate-200/30 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">
                    5 giao dịch gần nhất
                  </h3>
                  <a
                    className="text-xs font-bold text-primary hover:underline"
                    href="#"
                  >
                    Xem tất cả
                  </a>
                </div>
                <div className="p-0">
                  {/* Timeline Group: Today */}
                  <div className="p-4 bg-slate-50/50 flex items-center gap-4">
                    <div className="text-center w-12">
                      <p className="text-2xl font-bold text-slate-400 leading-none">
                        25
                      </p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase">
                        Tháng 7
                      </p>
                    </div>
                    <div className="h-4 w-[1px] bg-slate-200"></div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Hôm nay
                    </div>
                  </div>
                  <div className="divide-y divide-slate-100 px-6">
                    <div className="py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full icon-orange flex items-center justify-center">
                          <span className="material-symbols-outlined">
                            shopping_bag
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            ShopeeVip
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-[14px] text-slate-400">
                              credit_card
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Thẻ
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-pink-500">
                        29.000 ₫
                      </p>
                    </div>
                    <div className="py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full icon-blue flex items-center justify-center">
                          <span className="material-symbols-outlined">
                            local_grocery_store
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            Bách hóa
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-[14px] text-slate-400">
                              credit_card
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Thẻ
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-pink-500">
                        210.000 ₫
                      </p>
                    </div>
                  </div>
                  {/* Timeline Group: Yesterday */}
                  <div className="p-4 bg-slate-50/50 flex items-center gap-4 border-t border-slate-100">
                    <div className="text-center w-12">
                      <p className="text-2xl font-bold text-slate-400 leading-none">
                        24
                      </p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase">
                        Tháng 7
                      </p>
                    </div>
                    <div className="h-4 w-[1px] bg-slate-200"></div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Hôm qua
                    </div>
                  </div>
                  <div className="divide-y divide-slate-100 px-6">
                    <div className="py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full icon-blue flex items-center justify-center">
                          <span className="material-symbols-outlined">
                            local_grocery_store
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            Bách hóa
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-[14px] text-slate-400">
                              credit_card
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Thẻ
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-pink-500">
                        80.000 ₫
                      </p>
                    </div>
                  </div>
                  {/* Timeline Group: Day Before */}
                  <div className="p-4 bg-slate-50/50 flex items-center gap-4 border-t border-slate-100">
                    <div className="text-center w-12">
                      <p className="text-2xl font-bold text-slate-400 leading-none">
                        23
                      </p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase">
                        Tháng 7
                      </p>
                    </div>
                    <div className="h-4 w-[1px] bg-slate-200"></div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Thứ Năm
                    </div>
                  </div>
                  <div className="divide-y divide-slate-100 px-6 mb-2">
                    <div className="py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full icon-blue flex items-center justify-center">
                          <span className="material-symbols-outlined">
                            local_grocery_store
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            Bách hóa
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-[14px] text-slate-400">
                              credit_card
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Thẻ
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-pink-500">
                        28.000 ₫
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Right: Categories & Accounts */}
            <div className="xl:col-span-5 space-y-6">
              {/* Categories Grid (Based on IMAGE_14) */}
              <div className={`${GLASS_CARD} rounded-2xl p-6`}>
                <h3 className="font-bold text-slate-800 mb-6">
                  Chi tiêu theo mục
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full icon-blue flex items-center justify-center">
                      <span className="material-symbols-outlined text-[24px]">
                        shopping_basket
                      </span>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-slate-500">
                        Bách hóa
                      </p>
                      <p className="text-sm font-bold text-primary">
                        4.945.000 ₫
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full icon-purple flex items-center justify-center">
                      <span className="material-symbols-outlined text-[24px]">
                        restaurant
                      </span>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-slate-500">
                        Nhà hàng
                      </p>
                      <p className="text-sm font-bold text-slate-400">
                        0 ₫
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full icon-pink flex items-center justify-center">
                      <span className="material-symbols-outlined text-[24px]">
                        confirmation_number
                      </span>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-slate-500">
                        Giải trí
                      </p>
                      <p className="text-sm font-bold text-slate-400">
                        0 ₫
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full icon-orange flex items-center justify-center">
                      <span className="material-symbols-outlined text-[24px]">
                        directions_bus
                      </span>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-slate-500">
                        Vận chuyển
                      </p>
                      <p className="text-sm font-bold text-slate-400">
                        0 ₫
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full icon-red flex items-center justify-center">
                      <span className="material-symbols-outlined text-[24px]">
                        home
                      </span>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-slate-500">
                        Phòng trọ
                      </p>
                      <p className="text-sm font-bold text-pink-500">
                        1.700.000 ₫
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full icon-red flex items-center justify-center">
                      <span className="material-symbols-outlined text-[24px]">
                        bolt
                      </span>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-slate-500">
                        Điện, nước
                      </p>
                      <p className="text-sm font-bold text-pink-500">
                        520.000 ₫
                      </p>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-6 py-2 border-t border-slate-100 flex items-center justify-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">
                  Xem thêm
                  <span className="material-symbols-outlined text-[16px]">
                    expand_more
                  </span>
                </button>
              </div>
              {/* Accounts Card (Based on IMAGE_13) */}
              <div className={`${GLASS_CARD} rounded-2xl p-6`}>
                <h3 className="font-bold text-slate-800 mb-6">
                  Tài khoản của tôi
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center text-white relative">
                        <span className="material-symbols-outlined">
                          credit_card
                        </span>
                        <div className="absolute -bottom-1 -right-1 bg-amber-400 w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                          <span
                            className="material-symbols-outlined text-[10px] text-white"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          Thẻ
                        </p>
                        <p className="text-xs text-cyan-600 font-bold">
                          9.166.000 ₫
                        </p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-300">
                      chevron_right
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-teal-500 flex items-center justify-center text-white">
                        <span className="material-symbols-outlined">
                          account_balance_wallet
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          Tiền mặt
                        </p>
                        <p className="text-xs text-slate-400 font-bold">
                          0 ₫
                        </p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-300">
                      chevron_right
                    </span>
                  </div>
                </div>
                <button className="w-full mt-6 py-2 bg-slate-50 rounded-lg text-xs font-bold text-primary hover:bg-slate-100 transition-colors">
                  Thêm tài khoản
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 rounded-full primary-gradient text-white flex items-center justify-center shadow-lg shadow-indigo-200 hover:scale-110 active:scale-95 transition-all z-50">
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>
    </>
  );
}
