"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const products = [
  {
    code: "CREDIT_1",
    name: "1회",
    credits: 1,
    price: 990,
    pricePerCredit: 990,
    description: "가볍게 한 번 이용",
    icon: "🎯",
  },
  {
    code: "CREDIT_5",
    name: "5+1회",
    credits: 6,
    price: 4950,
    pricePerCredit: 825,
    description: "5회 구매 시 +1회 보너스",
    badge: "+1 보너스",
    popular: true,
    icon: "⭐",
  },
  {
    code: "CREDIT_10",
    name: "10+2회",
    credits: 12,
    price: 9900,
    pricePerCredit: 825,
    description: "10회 구매 시 +2회 보너스",
    badge: "+2 보너스",
    icon: "👑",
  },
];

export default function BillingClient() {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState(products[1]);
  const [loading, setLoading] = useState(false);

  const handlePurchase = async (provider: "toss" | "kakaopay") => {
    setLoading(true);

    try {
      const res = await fetch("/api/payments/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          productCode: selectedProduct.code,
        }),
      });

      const data = await res.json();

      if (provider === "toss") {
        // Toss Payments SDK integration point
        alert(
          `토스페이 결제 연동이 필요합니다.\n주문번호: ${data.orderId}\n금액: ${data.amount}원`
        );
      } else {
        // KakaoPay integration point
        alert(
          `카카오페이 결제 연동이 필요합니다.\n주문번호: ${data.orderId}\n금액: ${data.amount}원`
        );
      }
    } catch {
      alert("결제 준비 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 pb-8">
      {/* Product Selection */}
      <div className="space-y-3 mb-8">
        {products.map((product) => {
          const isSelected = selectedProduct.code === product.code;
          return (
            <button
              key={product.code}
              onClick={() => setSelectedProduct(product)}
              className={`relative w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                isSelected
                  ? "border-indigo-500 bg-indigo-50/50"
                  : "border-gray-100 bg-white hover:border-gray-200"
              }`}
            >
              {product.badge && (
                <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                  {product.badge}
                </span>
              )}

              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${
                    isSelected ? "bg-indigo-100" : "bg-gray-100"
                  }`}
                >
                  {product.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900">{product.name}</h3>
                    {product.popular && (
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 text-[10px] font-bold rounded-md">
                        인기
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{product.description}</p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {product.price.toLocaleString()}
                    <span className="text-sm font-normal text-gray-500">원</span>
                  </p>
                  <p className="text-xs text-gray-400">
                    회당 {product.pricePerCredit.toLocaleString()}원
                  </p>
                </div>
              </div>

              {/* Selected indicator */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 left-2 w-1.5 h-8 rounded-full transition-all ${
                  isSelected ? "bg-indigo-500" : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Payment Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => handlePurchase("kakaopay")}
          disabled={loading}
          className="w-full py-4 rounded-2xl font-semibold text-base transition-all active:scale-98 disabled:opacity-50"
          style={{ backgroundColor: "#FEE500", color: "#000000" }}
        >
          <div className="flex items-center justify-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#000">
              <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z" />
            </svg>
            카카오페이 · {selectedProduct.price.toLocaleString()}원
          </div>
        </button>

        <button
          onClick={() => handlePurchase("toss")}
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-blue-500 text-white font-semibold text-base hover:bg-blue-600 transition-all active:scale-98 disabled:opacity-50"
        >
          토스페이 · {selectedProduct.price.toLocaleString()}원
        </button>
      </div>
    </div>
  );
}
