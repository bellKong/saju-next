import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function BillingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const products = [
    {
      code: "CREDIT_1",
      name: "1회 이용권",
      credits: 1,
      price: 3000,
      description: "1회 사주/궁합/운세 이용",
    },
    {
      code: "CREDIT_5",
      name: "5회 이용권",
      credits: 5,
      price: 12000,
      description: "5회 사주/궁합/운세 이용",
      badge: "20% 할인",
    },
    {
      code: "CREDIT_10",
      name: "10회 이용권",
      credits: 10,
      price: 20000,
      description: "10회 사주/궁합/운세 이용",
      badge: "33% 할인",
    },
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">크레딧 충전</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="mb-4">
            <p className="text-sm text-gray-600">현재 보유 크레딧</p>
            <p className="text-3xl font-bold">{session.user.creditBalance}회</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.code}
              className="relative bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200 hover:border-blue-500 transition-colors"
            >
              {product.badge && (
                <div className="absolute -top-3 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {product.badge}
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {product.credits}회
                </div>
                <div className="text-2xl font-semibold">
                  {product.price.toLocaleString()}원
                </div>
              </div>

              <div className="space-y-2">
                <button
                  className="w-full px-4 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 font-medium transition-colors"
                  data-product={product.code}
                  data-provider="kakaopay"
                >
                  카카오페이
                </button>
                <button
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                  data-product={product.code}
                  data-provider="toss"
                >
                  토스페이
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
