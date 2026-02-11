"use client";

import { useState } from "react";
import { createReading, createShareLink } from "@/services/readings.api";
import { ERROR_NETWORK, ERROR_GENERIC, SUCCESS_SHARE_CREATED } from "@/constants/messages";
import type { ReadingResult } from "@/types";

export function useReadingForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReadingResult | null>(null);

  const submitReading = async (body: {
    type: string;
    input?: Record<string, unknown>;
    personId?: string;
  }) => {
    setLoading(true);
    try {
      const data = await createReading(body);
      if (data.success) {
        setResult(data.reading);
      } else {
        alert(data.error || ERROR_GENERIC);
      }
    } catch {
      alert(ERROR_NETWORK);
    } finally {
      setLoading(false);
    }
  };

  const shareReading = async (readingId: string) => {
    await createShareLink(readingId);
    alert(SUCCESS_SHARE_CREATED);
  };

  const resetResult = () => {
    setResult(null);
  };

  return { loading, result, submitReading, shareReading, resetResult };
}
