import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ScrollReveal from "@/components/layout/ScrollReveal";
import BillingClient from "@/components/BillingClient";

export default async function BillingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div>
      <ScrollReveal>
        <div className="px-6 pt-6 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">크레딧 충전</h1>
          <p className="text-sm text-gray-500 mt-1">
            원하는 만큼 충전하고 자유롭게 이용하세요
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className="px-6 pb-6">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">보유 크레딧</p>
              <p className="text-3xl font-bold text-white">
                {session.user.creditBalance}
                <span className="text-base font-normal text-gray-400 ml-1">회</span>
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v12M6 12h12" />
              </svg>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className="px-6 pb-4">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            상품 선택
          </h2>
        </div>
        <BillingClient />
      </ScrollReveal>
    </div>
  );
}
