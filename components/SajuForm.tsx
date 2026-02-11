"use client";

import { useReadingForm } from "@/hooks/useReadingForm";
import { LoadingSpinner, ReadingResultCard } from "@/components/ui";
import { LOADING_SAJU_ANALYSIS } from "@/constants/messages";

export default function SajuForm({ creditBalance }: { creditBalance: number }) {
  const { loading, result, submitReading, resetResult } = useReadingForm();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (creditBalance <= 0) return;

    const formData = new FormData(e.currentTarget);
    await submitReading({
      type: "SAJU",
      input: {
        birthDate: formData.get("birthDate") as string,
        birthTime: formData.get("birthTime") as string,
        gender: formData.get("gender") as string,
      },
    });
  };

  if (result) {
    return (
      <ReadingResultCard
        title="사주 분석 결과"
        summary={result.summary}
        content={result.result?.content}
        gradient="from-indigo-50 to-purple-50"
        readingId={result.id}
        onReset={resetResult}
      />
    );
  }

  return (
    <div className="px-6 py-6">
      {loading ? (
        <LoadingSpinner color="indigo" emoji="🔮" message={LOADING_SAJU_ANALYSIS} />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">생년월일</label>
            <input
              type="date"
              name="birthDate"
              required
              className="w-full px-4 py-3.5 bg-gray-50 border-0 rounded-2xl text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">출생시간</label>
            <input
              type="time"
              name="birthTime"
              required
              className="w-full px-4 py-3.5 bg-gray-50 border-0 rounded-2xl text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">성별</label>
            <div className="grid grid-cols-2 gap-3">
              <label className="relative">
                <input type="radio" name="gender" value="male" required className="peer sr-only" />
                <div className="px-4 py-3.5 rounded-2xl bg-gray-50 text-center font-medium text-gray-500 cursor-pointer peer-checked:bg-indigo-500 peer-checked:text-white transition-all">
                  남성
                </div>
              </label>
              <label className="relative">
                <input type="radio" name="gender" value="female" className="peer sr-only" />
                <div className="px-4 py-3.5 rounded-2xl bg-gray-50 text-center font-medium text-gray-500 cursor-pointer peer-checked:bg-indigo-500 peer-checked:text-white transition-all">
                  여성
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={creditBalance <= 0}
            className="w-full py-4 rounded-2xl bg-gray-900 text-white font-semibold text-base hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 transition-all active:scale-98"
          >
            {creditBalance > 0 ? "사주 보기 · 1 크레딧" : "크레딧이 부족해요"}
          </button>
        </form>
      )}
    </div>
  );
}
