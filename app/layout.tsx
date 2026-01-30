import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "사주 - AI 사주팔자, 궁합, 운세",
  description: "AI 기반 사주팔자, 궁합, 운세 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
