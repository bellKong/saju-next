import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function HistoryPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const readings = await prisma.reading.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
    include: {
      share: true,
    },
  });

  const typeLabels = {
    SAJU: "사주팔자",
    COMPAT: "궁합",
    FORTUNE: "운세",
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">내 기록</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600">보유 크레딧</p>
            <p className="text-2xl font-bold">{session.user.creditBalance}회</p>
          </div>
          <Link
            href="/billing"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            크레딧 충전
          </Link>
        </div>

        <div className="space-y-4">
          {readings.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              아직 기록이 없습니다
            </div>
          ) : (
            readings.map((reading) => (
              <div
                key={reading.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {typeLabels[reading.type as keyof typeof typeLabels] || reading.type}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(reading.createdAt).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                    {reading.summary && (
                      <p className="text-gray-700 mb-2">{reading.summary}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/reading/${reading.id}`}
                      className="px-4 py-2 text-sm border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                    >
                      보기
                    </Link>
                    {reading.share && !reading.share.revokedAt && (
                      <Link
                        href={`/share/${reading.share.shareId}`}
                        className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        공유됨
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
