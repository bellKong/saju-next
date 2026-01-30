import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CompatibilityPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">궁합</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600">보유 크레딧</p>
            <p className="text-2xl font-bold">{session.user.creditBalance}회</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form className="space-y-6">
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">내 정보</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    생년월일
                  </label>
                  <input
                    type="date"
                    name="myBirthDate"
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    성별
                  </label>
                  <select
                    name="myGender"
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  >
                    <option value="">선택하세요</option>
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">상대방 정보</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    생년월일
                  </label>
                  <input
                    type="date"
                    name="partnerBirthDate"
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    성별
                  </label>
                  <select
                    name="partnerGender"
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  >
                    <option value="">선택하세요</option>
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              disabled={session.user.creditBalance <= 0}
            >
              {session.user.creditBalance > 0 ? "궁합 보기 (1 크레딧)" : "크레딧 부족"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
