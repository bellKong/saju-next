"use client";

import Link from "next/link";

interface HeaderProps {
  creditBalance?: number;
  userName?: string | null;
  isLoggedIn: boolean;
}

export default function Header({
  creditBalance = 0,
  userName,
  isLoggedIn,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
      <div className="max-w-lg mx-auto flex items-center justify-between px-5 h-14">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">AI</span>
          </div>
          <span className="text-lg font-bold text-gray-900">사주</span>
        </Link>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link
                href="/billing"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="2.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v12M6 12h12" />
                </svg>
                <span className="text-sm font-bold text-indigo-600">
                  {creditBalance}
                </span>
              </Link>
              <Link
                href="/history"
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M12 8v4l3 3" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
