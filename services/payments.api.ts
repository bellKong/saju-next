import { apiRequest } from "./client";

interface PaymentIntentResponse {
  orderId: string;
  amount: number;
}

interface KakaoPayReadyResponse {
  redirectUrl: string;
  redirectUrlPc: string;
}

export async function createPaymentIntent(
  provider: "toss" | "kakaopay",
  productCode: string
): Promise<PaymentIntentResponse> {
  return apiRequest<PaymentIntentResponse>("/api/payments/intent", {
    method: "POST",
    body: JSON.stringify({ provider, productCode }),
  });
}

export async function readyKakaoPay(
  orderId: string
): Promise<KakaoPayReadyResponse> {
  return apiRequest<KakaoPayReadyResponse>("/api/payments/kakaopay/ready", {
    method: "POST",
    body: JSON.stringify({ orderId }),
  });
}

export async function confirmKakaoPay(
  pgToken: string,
  orderId: string
): Promise<void> {
  await apiRequest("/api/payments/kakaopay/confirm", {
    method: "POST",
    body: JSON.stringify({ pg_token: pgToken, orderId }),
  });
}
