import Link from "next/link";

export default function KakaopayCancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-yellow-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z"
          />
        </svg>
      </div>
      <p className="text-gray-900 font-semibold text-lg">결제가 취소되었습니다</p>
      <p className="text-gray-500 text-sm mt-1">
        결제를 다시 시도하시려면 아래 버튼을 눌러주세요.
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
