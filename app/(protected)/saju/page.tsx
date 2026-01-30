import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ScrollReveal from "@/components/ScrollReveal";
import SajuForm from "@/components/SajuForm";

export default async function SajuPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div>
      {/* Hero */}
      <ScrollReveal>
        <div className="px-6 pt-6 pb-2">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700 p-7">
            <div className="absolute top-2 right-4 text-6xl opacity-20">🔮</div>
            <div className="relative z-10">
              <span className="inline-block px-2.5 py-1 bg-white/20 rounded-lg text-xs font-semibold text-white/90 mb-3">
                사주팔자
              </span>
              <h1 className="text-2xl font-bold text-white mb-1">나의 사주 보기</h1>
              <p className="text-indigo-100 text-sm">
                생년월일시를 입력하면 AI가 분석해드려요
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Credit Badge */}
      <ScrollReveal delay={100}>
        <div className="px-6 py-3">
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-indigo-50">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">{session.user.creditBalance}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">보유 크레딧</p>
              <p className="text-xs text-gray-500">{session.user.creditBalance}회 이용 가능</p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Form */}
      <ScrollReveal delay={200}>
        <SajuForm creditBalance={session.user.creditBalance} />
      </ScrollReveal>
    </div>
  );
}
