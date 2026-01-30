import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SajuPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">사주팔자</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600">보유 크레딧</p>
            <p className="text-2xl font-bold">{session.user.creditBalance}회</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                생년월일
              </label>
              <input
                type="date"
                name="birthDate"
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                출생시간
              </label>
              <input
                type="time"
                name="birthTime"
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                성별
              </label>
              <select
                name="gender"
                className="w-full px-4 py-2 border rounded-lg"
                required
              >
                <option value="">선택하세요</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              disabled={session.user.creditBalance <= 0}
            >
              {session.user.creditBalance > 0 ? "사주 보기 (1 크레딧)" : "크레딧 부족"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
