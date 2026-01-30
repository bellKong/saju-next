import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

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
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!share || share.revokedAt) {
    notFound();
  }

  const typeLabels = {
    SAJU: "사주팔자",
    COMPAT: "궁합",
    FORTUNE: "운세",
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6 pb-6 border-b">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {typeLabels[share.reading.type as keyof typeof typeLabels] || share.reading.type}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(share.reading.createdAt).toLocaleDateString("ko-KR")}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {share.user.name}님이 공유한 결과입니다
            </p>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold mb-4">입력 정보</h2>
            <pre className="bg-gray-50 p-4 rounded-lg mb-6">
              {JSON.stringify(share.reading.input, null, 2)}
            </pre>

            <h2 className="text-2xl font-bold mb-4">결과</h2>
            <div className="bg-gray-50 p-6 rounded-lg whitespace-pre-wrap">
              {JSON.stringify(share.reading.result, null, 2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
