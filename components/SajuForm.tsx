"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SajuForm({ creditBalance }: { creditBalance: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (creditBalance <= 0) return;

    const formData = new FormData(e.currentTarget);
    setLoading(true);

    try {
      const res = await fetch("/api/readings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "SAJU",
          input: {
            birthDate: formData.get("birthDate"),
            birthTime: formData.get("birthTime"),
            gender: formData.get("gender"),
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data.reading);
      } else {
        alert(data.error || "오류가 발생했습니다");
      }
    } catch {
      alert("네트워크 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="px-6 py-6">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-1">사주 분석 결과</h2>
          <p className="text-sm text-gray-500 mb-4">{result.summary}</p>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 p-6">
          <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700 leading-relaxed">
            {result.result?.content}
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => {
              setResult(null);
              router.refresh();
            }}
            className="flex-1 py-3.5 rounded-2xl bg-gray-100 font-semibold text-gray-700 hover:bg-gray-200 transition-colors active:scale-98"
          >
            다시 보기
          </button>
          <button
            onClick={async () => {
              await fetch(`/api/readings/${result.id}/share`, { method: "POST" });
              alert("공유 링크가 생성되었습니다!");
            }}
            className="flex-1 py-3.5 rounded-2xl bg-gray-900 font-semibold text-white hover:bg-gray-800 transition-colors active:scale-98"
          >
            공유하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-6">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-2xl animate-float">
              🔮
            </div>
          </div>
          <p className="text-lg font-semibold text-gray-900 mb-1">사주를 분석하고 있어요</p>
          <p className="text-sm text-gray-400">잠시만 기다려주세요...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              생년월일
            </label>
            <input
              type="date"
              name="birthDate"
              required
              className="w-full px-4 py-3.5 bg-gray-50 border-0 rounded-2xl text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              출생시간
            </label>
            <input
              type="time"
              name="birthTime"
              required
              className="w-full px-4 py-3.5 bg-gray-50 border-0 rounded-2xl text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              성별
            </label>
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
