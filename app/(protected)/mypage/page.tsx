import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

const services = [
  {
    href: "/saju",
    icon: "🔮",
    title: "사주팔자",
    desc: "생년월일시로 보는 상세한 사주 분석",
    color: "bg-indigo-50",
  },
  {
    href: "/compatibility",
    icon: "💕",
    title: "궁합",
    desc: "우리 궁합은 몇점?",
    color: "bg-pink-50",
  },
  {
    href: "/fortune",
    icon: "⭐",
    title: "운세",
    desc: "2026 신년운세",
    color: "bg-amber-50",
  },
];

const categories = [
  { icon: "💰", title: "재물운", desc: "금전과 재테크 운세" },
  { icon: "💕", title: "애정운", desc: "연애와 결혼의 미래" },
  { icon: "💼", title: "직업운", desc: "커리어와 사업 방향" },
  { icon: "🏥", title: "건강운", desc: "건강 관리 포인트" },
  { icon: "🌟", title: "총운", desc: "올해의 종합 운세" },
];

export default async function MyPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="pb-24">
      {/* Profile Section */}
      <ScrollReveal>
        <div className="px-6 pt-6 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-2xl text-white font-bold">
                {session.user.name?.charAt(0) || "U"}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">
                {session.user.name || "사용자"}
              </h1>
              {session.user.email && (
                <p className="text-sm text-gray-500 mt-0.5">
                  {session.user.email}
                </p>
              )}
            </div>
            <Link
              href="/mypage/edit"
              className="px-3 py-1.5 rounded-lg bg-gray-100 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
            >
              수정
            </Link>
          </div>

          {/* Credit Balance */}
          <Link
            href="/billing"
            className="mt-5 flex items-center justify-between px-5 py-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="2.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v12M6 12h12" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-indigo-600 font-medium">
                  보유 크레딧
                </p>
                <p className="text-lg font-bold text-indigo-700">
                  {session.user.creditBalance ?? 0}
                </p>
              </div>
            </div>
            <span className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl">
              충전
            </span>
          </Link>
        </div>
      </ScrollReveal>

      {/* 나의 기록 */}
      <ScrollReveal>
        <div className="px-6 pb-6">
          <Link
            href="/history"
            className="flex items-center justify-between px-5 py-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M12 8v4l3 3" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
              <span className="font-semibold text-gray-900">나의 기록</span>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#d1d5db"
              strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        </div>
      </ScrollReveal>

      {/* Services */}
      <ScrollReveal>
        <div className="px-6 pb-6">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
            서비스
          </h2>
          <div className="space-y-3">
            {services.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl ${service.color} hover:opacity-80 transition-opacity`}
              >
                <span className="text-2xl">{service.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-500">{service.desc}</p>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#d1d5db"
                  strokeWidth="2"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Fortune Categories */}
      <ScrollReveal>
        <div className="px-6 pb-6">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
            이런 것들을 알 수 있어요
          </h2>
          <div className="space-y-2">
            {categories.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-4 px-5 py-3.5 rounded-2xl bg-gray-50"
              >
                <span className="text-xl">{item.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Logout */}
      <ScrollReveal>
        <div className="px-6 pb-8">
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="w-full py-4 rounded-2xl border border-gray-200 text-gray-500 font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              로그아웃
            </button>
          </form>
        </div>
      </ScrollReveal>
    </div>
  );
}
