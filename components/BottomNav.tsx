"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    href: "/saju",
    label: "사주",
    sub: "용하다고 소문난 사주",
    icon: (active: boolean) => (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke={active ? "#6366f1" : "#9ca3af"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    ),
  },
  {
    href: "/compatibility",
    label: "궁합",
    sub: "우리 궁합은 몇점?",
    icon: (active: boolean) => (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill={active ? "#ec4899" : "none"}
        stroke={active ? "#ec4899" : "#9ca3af"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
  },
  {
    href: "/fortune",
    label: "운세",
    sub: "2026 신년운세",
    icon: (active: boolean) => (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill={active ? "#f59e0b" : "none"}
        stroke={active ? "#f59e0b" : "#9ca3af"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100">
      <div className="max-w-lg mx-auto flex">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center py-2 px-1 transition-all duration-200 ${
                isActive ? "scale-105" : ""
              }`}
            >
              <div className="relative">
                {tab.icon(isActive)}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-500" />
                )}
              </div>
              <span
                className={`text-xs font-semibold mt-1 ${
                  isActive ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {tab.label}
              </span>
              <span
                className={`text-[10px] leading-tight ${
                  isActive ? "text-indigo-500" : "text-gray-300"
                }`}
              >
                {tab.sub}
              </span>
            </Link>
          );
        })}
      </div>
      {/* Safe area for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
