import Link from "next/link";
import { auth } from "@/lib/auth";
import Header from "@/components/Header";
import ScrollReveal from "@/components/ScrollReveal";

export default async function Home() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        creditBalance={session?.user?.creditBalance ?? 0}
        userName={session?.user?.name}
      />

      <main className="pb-safe">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-6 pt-12 pb-16">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-100/60 to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-100/40 to-transparent rounded-full translate-y-1/3 -translate-x-1/4" />

          <ScrollReveal>
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 mb-6">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-semibold text-indigo-600">
                  AI 사주 서비스 운영중
                </span>
              </div>

              <h1 className="text-[2.5rem] leading-tight font-extrabold text-gray-900 mb-4 tracking-tight">
                AI가 풀어주는
                <br />
                <span className="text-gradient">당신의 운명</span>
              </h1>

              <p className="text-lg text-gray-500 leading-relaxed mb-8">
                생년월일만 입력하면
                <br />
                사주, 궁합, 운세를 바로 확인하세요
              </p>

              {!isLoggedIn && (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-7 py-4 bg-gray-900 text-white rounded-2xl font-semibold text-base hover:bg-gray-800 transition-all duration-200 active:scale-95"
                >
                  무료로 시작하기
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          </ScrollReveal>
        </section>

        {/* Service Cards */}
        <section className="px-6 pb-12">
          <ScrollReveal>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-5">
              서비스
            </h2>
          </ScrollReveal>

          <div className="space-y-4">
            <ScrollReveal>
              <Link href="/saju" className="block">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 to-indigo-700 p-7 card-hover">
                  <div className="absolute top-4 right-4 w-20 h-20 opacity-20">
                    <svg viewBox="0 0 24 24" fill="white">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" fill="rgba(0,0,0,0.2)" />
                      <path d="M2 12h20" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
                    </svg>
                  </div>
                  <div className="relative z-10">
                    <span className="inline-block px-2.5 py-1 bg-white/20 rounded-lg text-xs font-semibold text-white/90 mb-4">
                      사주팔자
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      나의 사주 보기
                    </h3>
                    <p className="text-indigo-100 text-sm">
                      생년월일시로 보는 상세한 사주 분석
                    </p>
                  </div>
                </div>
              </Link>
            </ScrollReveal>

            <div className="grid grid-cols-2 gap-4">
              <ScrollReveal>
                <Link href="/compatibility" className="block">
                  <div className="rounded-3xl bg-gradient-to-br from-pink-50 to-pink-100 p-6 card-hover h-full">
                    <div className="w-12 h-12 rounded-2xl bg-pink-200/60 flex items-center justify-center mb-4">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="#ec4899" stroke="none">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">궁합</h3>
                    <p className="text-xs text-gray-500">우리 궁합은 몇점?</p>
                  </div>
                </Link>
              </ScrollReveal>

              <ScrollReveal>
                <Link href="/fortune" className="block">
                  <div className="rounded-3xl bg-gradient-to-br from-amber-50 to-amber-100 p-6 card-hover h-full">
                    <div className="w-12 h-12 rounded-2xl bg-amber-200/60 flex items-center justify-center mb-4">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">운세</h3>
                    <p className="text-xs text-gray-500">2026 신년운세</p>
                  </div>
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 pb-12">
          <ScrollReveal>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-5">
              이런 것들을 알 수 있어요
            </h2>
          </ScrollReveal>

          <div className="space-y-3">
            {[
              { icon: "💰", title: "재물운", desc: "금전과 재테크 운세" },
              { icon: "💕", title: "애정운", desc: "연애와 결혼의 미래" },
              { icon: "💼", title: "직업운", desc: "커리어와 사업 방향" },
              { icon: "🏥", title: "건강운", desc: "건강 관리 포인트" },
              { icon: "🌟", title: "총운", desc: "올해의 종합 운세" },
            ].map((item) => (
              <ScrollReveal key={item.title}>
                <div className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
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
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 pb-16">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-3xl bg-gray-900 p-8 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20" />
              <div className="relative z-10">
                <div className="text-4xl mb-4 animate-float">🔮</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  지금 바로 확인해보세요
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  AI가 분석하는 정확한 사주 결과
                </p>
                <Link
                  href={isLoggedIn ? "/saju" : "/login"}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-colors active:scale-95"
                >
                  {isLoggedIn ? "사주 보러가기" : "시작하기"}
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>
    </>
  );
}
