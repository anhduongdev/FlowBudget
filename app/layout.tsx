import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

// Geist chỉ dùng cho label-md (nút/nhãn nhỏ) — đã có sẵn qua next/font nên
// không cần tải thêm 1 bản "Geist" khác từ CDN như file thiết kế gốc.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SalaryCycle - Quản lý tài chính thông minh",
  description: "Quản lý tài chính thông minh theo chu kỳ lương",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} ${geistSans.variable} h-full antialiased`}>
      <head>
        {/* Icon font dùng cho <span class="material-symbols-outlined">; không có trong danh mục next/font/google.
            eslint-disable: rule no-page-custom-font chỉ dành cho Pages Router (pages/_document.js),
            báo nhầm trên App Router vì không nhận diện được thư mục app/. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
