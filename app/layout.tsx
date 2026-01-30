import type { Metadata, Viewport } from "next";
import "./globals.css";
import { auth } from "@/lib/auth";
import SessionProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "AI 사주 - 사주팔자, 궁합, 운세",
  description: "AI가 풀어주는 당신의 사주팔자, 궁합, 운세",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessionData = await auth();

  const session = {
    isLoggedIn: !!sessionData?.user,
    creditBalance: sessionData?.user?.creditBalance ?? 0,
    userName: sessionData?.user?.name ?? null,
    userImage: sessionData?.user?.image ?? null,
  };

  return (
    <html lang="ko">
      <body className="antialiased">
        <SessionProvider session={session}>
          <div className="max-w-lg mx-auto min-h-screen bg-white relative">
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
