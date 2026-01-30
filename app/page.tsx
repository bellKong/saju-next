import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold">AI 사주팔자</h1>
          <p className="text-xl text-gray-600">
            인공지능이 해석하는 당신의 운명
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Link
            href="/saju"
            className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-2">사주팔자</h2>
            <p className="text-gray-600">
              생년월일시를 기반으로 사주를 분석합니다
            </p>
          </Link>

          <Link
            href="/compatibility"
            className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-2">궁합</h2>
            <p className="text-gray-600">
              두 사람의 궁합을 확인해보세요
            </p>
          </Link>

          <Link
            href="/fortune"
            className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-2">오늘의 운세</h2>
            <p className="text-gray-600">
              오늘 하루의 운세를 확인하세요
            </p>
          </Link>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          {session ? (
            <>
              <Link
                href="/history"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                내 기록
              </Link>
              <Link
                href="/billing"
                className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
              >
                크레딧 충전
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              로그인
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
