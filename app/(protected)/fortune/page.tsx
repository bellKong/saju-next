import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ScrollReveal from "@/components/ScrollReveal";
import FortuneForm from "@/components/FortuneForm";

export default async function FortunePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div>
      <ScrollReveal>
        <div className="px-6 pt-6 pb-2">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 p-7">
            <div className="absolute top-2 right-4 text-6xl opacity-20">⭐</div>
            <div className="relative z-10">
              <span className="inline-block px-2.5 py-1 bg-white/20 rounded-lg text-xs font-semibold text-white/90 mb-3">
                2026 신년운세
              </span>
              <h1 className="text-2xl font-bold text-white mb-1">오늘의 운세</h1>
              <p className="text-amber-100 text-sm">오늘 하루 어떤 일이 일어날까요?</p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className="px-6 py-3">
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-amber-50">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
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
        <FortuneForm creditBalance={session.user.creditBalance} />
      </ScrollReveal>
    </div>
  );
}
