import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Header from "@/components/layout/Header";
import ScrollReveal from "@/components/layout/ScrollReveal";
import { READING_TYPE_CONFIG } from "@/constants/reading";

export default async function SharePage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;

  const share = await prisma.share.findUnique({
    where: { shareId },
    include: {
      reading: true,
      user: { select: { name: true } },
    },
  });

  if (!share || share.revokedAt) {
    notFound();
  }

  const config =
    READING_TYPE_CONFIG[share.reading.type as keyof typeof READING_TYPE_CONFIG] ||
    READING_TYPE_CONFIG.SAJU;

  return (
    <>
      <Header isLoggedIn={false} />

      <main className="pb-safe">
        <ScrollReveal>
          <div className="px-6 pt-6">
            <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${config.gradient} p-7`}>
              <div className="absolute top-2 right-4 text-6xl opacity-20">
                {config.icon}
              </div>
              <div className="relative z-10">
                <span className="inline-block px-2.5 py-1 bg-white/20 rounded-lg text-xs font-semibold text-white/90 mb-3">
                  {config.label}
                </span>
                <h1 className="text-2xl font-bold text-white mb-1">
                  {share.reading.summary || "분석 결과"}
                </h1>
                <p className="text-white/70 text-sm">
                  {share.user.name}님이 공유한 결과입니다
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="px-6 py-6">
            <div className="bg-white rounded-3xl border border-gray-100 p-6">
              <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700 leading-relaxed">
                {(share.reading.result as Record<string, string> | null)?.content ||
                  JSON.stringify(share.reading.result, null, 2)}
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="px-6 pb-8">
            <div className="bg-gray-900 rounded-3xl p-6 text-center">
              <p className="text-white font-semibold mb-2">
                나도 사주를 보고 싶다면?
              </p>
              <a
                href="/"
                className="inline-block px-6 py-3 bg-white text-gray-900 rounded-2xl font-semibold text-sm hover:bg-gray-100 transition-colors"
              >
                AI 사주 시작하기
              </a>
            </div>
          </div>
        </ScrollReveal>
      </main>
    </>
  );
}
