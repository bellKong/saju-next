"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { confirmKakaoPay } from "@/services/payments.api";
import {
  LOADING_PAYMENT_CONFIRM,
  SUCCESS_PAYMENT_COMPLETE,
  ERROR_PAYMENT_CONFIRM_FAILED,
  LOADING_REDIRECT,
} from "@/constants/messages";

export default function KakaopayCallbackClient({
  pgToken,
  orderId,
}: {
  pgToken: string;
  orderId: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const confirm = async () => {
      try {
        await confirmKakaoPay(pgToken, orderId);
        setStatus("success");
        setTimeout(() => {
          router.replace("/billing");
        }, 1500);
      } catch (err) {
        setStatus("error");
        setErrorMessage(
          err instanceof Error ? err.message : ERROR_PAYMENT_CONFIRM_FAILED
        );
      }
    };

    confirm();
  }, [pgToken, orderId, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      {status === "loading" && (
        <>
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mb-4" />
          <p className="text-gray-600 font-medium">{LOADING_PAYMENT_CONFIRM}</p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gray-900 font-semibold text-lg">{SUCCESS_PAYMENT_COMPLETE}</p>
          <p className="text-gray-500 text-sm mt-1">{LOADING_REDIRECT}</p>
        </>
      )}

      {status === "error" && (
        <>
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-gray-900 font-semibold text-lg">결제 승인 실패</p>
          <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
          <button
            onClick={() => router.replace("/billing")}
            className="mt-6 px-6 py-3 bg-indigo-500 text-white rounded-xl font-medium"
          >
            돌아가기
          </button>
        </>
      )}
    </div>
  );
}
