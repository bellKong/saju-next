import KakaopayCallbackClient from "@/components/KakaopayCallbackClient";

export default async function KakaopayCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ pg_token?: string; orderId?: string }>;
}) {
  const { pg_token, orderId } = await searchParams;

  if (!pg_token || !orderId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        <p className="text-red-500 font-semibold">잘못된 결제 요청입니다.</p>
      </div>
    );
  }

  return <KakaopayCallbackClient pgToken={pg_token} orderId={orderId} />;
}
