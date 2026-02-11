import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import ScrollReveal from "@/components/layout/ScrollReveal";
import { READING_TYPE_CONFIG } from "@/constants/reading";

export default async function HistoryPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const readings = await prisma.reading.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { share: true },
  });

  return (
    <div>
      <ScrollReveal>
        <div className="px-6 pt-6 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">내 기록</h1>
          <p className="text-sm text-gray-500 mt-1">
            총 {readings.length}개의 기록
          </p>
        </div>
      </ScrollReveal>

      <div className="px-6 pb-6">
        {readings.length === 0 ? (
          <ScrollReveal>
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                아직 기록이 없어요
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                사주, 궁합, 운세를 확인해보세요
              </p>
              <Link
                href="/saju"
                className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-semibold text-sm"
              >
                사주 보러가기
              </Link>
            </div>
          </ScrollReveal>
        ) : (
          <div className="space-y-3">
            {readings.map((reading) => {
              const config =
                READING_TYPE_CONFIG[reading.type as keyof typeof READING_TYPE_CONFIG] ||
                READING_TYPE_CONFIG.SAJU;
              return (
                <ScrollReveal key={reading.id}>
                  <div className="bg-gray-50 rounded-2xl p-5 hover:bg-gray-100 transition-colors card-hover">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-xl shadow-sm shrink-0">
                        {config.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded-md text-xs font-semibold ${config.color}`}
                          >
                            {config.label}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(reading.createdAt).toLocaleDateString(
                              "ko-KR",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {reading.summary || "결과 보기"}
                        </p>
                      </div>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#d1d5db"
                        strokeWidth="2"
                        className="shrink-0 mt-3"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
