import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FromDear - 12월을 위한 따뜻한 메시지",
  description: "익명으로 받는 롤링페이퍼와 어드벤트 캘린더",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}



