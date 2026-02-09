"use client";

import { useState } from "react";

export default function DevPage() {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    email?: string;
    creditBalance?: number;
    error?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/dev/credit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, amount }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: "요청 실패" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-lg mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-1">Dev Tools</h1>
        <p className="text-gray-400 text-sm mb-8">개발 환경 전용</p>

        {/* Credit Grant */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">크레딧 충전</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1.5">
                충전량
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 5, 10, 50].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setAmount(v)}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                      amount === v
                        ? "bg-indigo-500 text-white"
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl font-semibold transition-all"
            >
              {loading ? "처리 중..." : `${amount} 크레딧 충전`}
            </button>
          </form>

          {result && (
            <div
              className={`mt-4 p-4 rounded-xl text-sm ${
                result.success
                  ? "bg-green-500/20 text-green-300"
                  : "bg-red-500/20 text-red-300"
              }`}
            >
              {result.success ? (
                <>
                  <p className="font-medium">충전 완료</p>
                  <p className="mt-1 text-xs opacity-80">
                    {result.email} → 잔액: {result.creditBalance}
                  </p>
                </>
              ) : (
                <p>{result.error}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
