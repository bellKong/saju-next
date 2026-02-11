"use client";

import { useReadingForm } from "@/hooks/useReadingForm";
import { LoadingSpinner, ReadingResultCard } from "@/components/ui";
import { LOADING_COMPAT_ANALYSIS } from "@/constants/messages";

export default function CompatibilityForm({ creditBalance }: { creditBalance: number }) {
  const { loading, result, submitReading, resetResult } = useReadingForm();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (creditBalance <= 0) return;

    const formData = new FormData(e.currentTarget);
    await submitReading({
      type: "COMPAT",
      input: {
        person1: {
          birthDate: formData.get("myBirthDate") as string,
          gender: formData.get("myGender") as string,
        },
        person2: {
          birthDate: formData.get("partnerBirthDate") as string,
          gender: formData.get("partnerGender") as string,
        },
      },
    });
  };

  if (result) {
    return (
      <ReadingResultCard
        title="궁합 분석 결과"
        summary={result.summary}
        content={result.result?.content}
        gradient="from-pink-50 to-rose-50"
        readingId={result.id}
        onReset={resetResult}
      />
    );
  }

  return (
    <div className="px-6 py-6">
      {loading ? (
        <LoadingSpinner color="pink" emoji="💕" message={LOADING_COMPAT_ANALYSIS} />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Person 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm">
                👤
              </div>
              <h3 className="font-bold text-gray-900">내 정보</h3>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">생년월일</label>
              <input
                type="date"
                name="myBirthDate"
                required
                className="w-full px-4 py-3.5 bg-gray-50 border-0 rounded-2xl text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">성별</label>
              <div className="grid grid-cols-2 gap-3">
                <label>
                  <input type="radio" name="myGender" value="male" required className="peer sr-only" />
                  <div className="px-4 py-3.5 rounded-2xl bg-gray-50 text-center font-medium text-gray-500 cursor-pointer peer-checked:bg-indigo-500 peer-checked:text-white transition-all">남성</div>
                </label>
                <label>
                  <input type="radio" name="myGender" value="female" className="peer sr-only" />
                  <div className="px-4 py-3.5 rounded-2xl bg-gray-50 text-center font-medium text-gray-500 cursor-pointer peer-checked:bg-indigo-500 peer-checked:text-white transition-all">여성</div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-pink-400 text-xl">♥</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Person 2 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-sm">
                👤
              </div>
              <h3 className="font-bold text-gray-900">상대방 정보</h3>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">생년월일</label>
              <input
                type="date"
                name="partnerBirthDate"
                required
                className="w-full px-4 py-3.5 bg-gray-50 border-0 rounded-2xl text-gray-900 font-medium focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">성별</label>
              <div className="grid grid-cols-2 gap-3">
                <label>
                  <input type="radio" name="partnerGender" value="male" required className="peer sr-only" />
                  <div className="px-4 py-3.5 rounded-2xl bg-gray-50 text-center font-medium text-gray-500 cursor-pointer peer-checked:bg-pink-500 peer-checked:text-white transition-all">남성</div>
                </label>
                <label>
                  <input type="radio" name="partnerGender" value="female" className="peer sr-only" />
                  <div className="px-4 py-3.5 rounded-2xl bg-gray-50 text-center font-medium text-gray-500 cursor-pointer peer-checked:bg-pink-500 peer-checked:text-white transition-all">여성</div>
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={creditBalance <= 0}
            className="w-full py-4 rounded-2xl bg-gray-900 text-white font-semibold text-base hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 transition-all active:scale-98"
          >
            {creditBalance > 0 ? "궁합 보기 · 1 크레딧" : "크레딧이 부족해요"}
          </button>
        </form>
      )}
    </div>
  );
}
