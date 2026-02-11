import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ScrollReveal from "@/components/layout/ScrollReveal";
import CompatibilityForm from "@/components/CompatibilityForm";

export default async function CompatibilityPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div>
      <ScrollReveal>
        <div className="px-6 pt-6 pb-2">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-400 via-pink-500 to-rose-600 p-7">
            <div className="absolute top-2 right-4 text-6xl opacity-20">💕</div>
            <div className="relative z-10">
              <span className="inline-block px-2.5 py-1 bg-white/20 rounded-lg text-xs font-semibold text-white/90 mb-3">
                궁합
              </span>
              <h1 className="text-2xl font-bold text-white mb-1">우리 궁합은 몇점?</h1>
              <p className="text-pink-100 text-sm">두 사람의 궁합을 AI가 분석해드려요</p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className="px-6 py-3">
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-pink-50">
            <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">{session.user.creditBalance}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">보유 크레딧</p>
              <p className="text-xs text-gray-500">{session.user.creditBalance}회 이용 가능</p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <CompatibilityForm creditBalance={session.user.creditBalance} />
      </ScrollReveal>
    </div>
  );
}
