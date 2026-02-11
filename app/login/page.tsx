import { signIn } from "@/lib/auth";
import ScrollReveal from "@/components/layout/ScrollReveal";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Back Button */}
      <div className="px-4 pt-4">
        <Link
          href="/"
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-16">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200">
              <span className="text-3xl text-white font-bold">AI</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              AI 사주
            </h1>
            <p className="text-gray-500">
              소셜 로그인으로 간편하게 시작하세요
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="w-full max-w-sm space-y-3">
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors font-semibold text-gray-700 active:scale-98"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google로 계속하기
              </button>
            </form>

            <form
              action={async () => {
                "use server";
                await signIn("kakao", { redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-colors active:scale-98"
                style={{ backgroundColor: "#FEE500", color: "#191919" }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#191919" d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z" />
                </svg>
                카카오로 계속하기
              </button>
            </form>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <p className="text-xs text-gray-400 text-center mt-8 px-4 leading-relaxed">
            로그인 시{" "}
            <span className="underline">이용약관</span> 및{" "}
            <span className="underline">개인정보처리방침</span>에 동의합니다
          </p>
        </ScrollReveal>
      </div>
    </div>
  );
}
