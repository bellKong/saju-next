"use client";

import { useState } from "react";
import { createPaymentIntent, readyKakaoPay } from "@/services/payments.api";
import { ERROR_PAYMENT_READY_FAILED } from "@/constants/messages";

export function usePayment() {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async (
    provider: "toss" | "kakaopay",
    productCode: string,
    amount: number
  ) => {
    setLoading(true);

    try {
      const data = await createPaymentIntent(provider, productCode);

      if (provider === "toss") {
        alert(
          `토스페이 결제 연동이 필요합니다.\n주문번호: ${data.orderId}\n금액: ${data.amount}원`
        );
      } else {
        const readyData = await readyKakaoPay(data.orderId);
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const redirectUrl = isMobile
          ? readyData.redirectUrl
          : readyData.redirectUrlPc;
        window.location.href = redirectUrl;
        return;
      }
    } catch {
      alert(ERROR_PAYMENT_READY_FAILED);
    } finally {
      setLoading(false);
    }
  };

  return { loading, handlePurchase };
}
