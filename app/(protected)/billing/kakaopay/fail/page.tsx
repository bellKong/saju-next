import Link from "next/link";

export default function KakaopayFailPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <p className="text-gray-900 font-semibold text-lg">결제에 실패했습니다</p>
      <p className="text-gray-500 text-sm mt-1">
        잠시 후 다시 시도해주세요.
      </p>
      <Link
        href="/billing"
        className="mt-6 px-6 py-3 bg-indigo-500 text-white rounded-xl font-medium"
      >
        돌아가기
      </Link>
    </div>
  );
}
