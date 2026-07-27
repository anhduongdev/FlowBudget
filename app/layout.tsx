import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlowBudget - Làm chủ tài chính, xây dựng tương lai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@100;300;400;500;600;700;800;900&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="bg-background text-on-background antialiased selection:bg-primary-container selection:text-white custom-scrollbar">
        {children}
      </body>
    </html>
  );
}
