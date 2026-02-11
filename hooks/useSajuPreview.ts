"use client";

import { useState } from "react";
import { fetchSajuPreview } from "@/services/saju.api";
import { ERROR_NETWORK, ERROR_MANSERYEOK_FAILED } from "@/constants/messages";
import type { SajuResult, Person } from "@/types";

export function useSajuPreview() {
  const [previewLoading, setPreviewLoading] = useState(false);
  const [sajuPreview, setSajuPreview] = useState<SajuResult | null>(null);

  const loadPreview = async (
    person: Person,
    onSuccess: (result: SajuResult) => void,
    onError: () => void
  ) => {
    setPreviewLoading(true);
    setSajuPreview(null);

    try {
      const data = await fetchSajuPreview({
        personId: person.id,
        birthDate: person.birthDate,
        birthTime: person.birthTime || "모름",
        calendarType: person.calendarType,
        gender: person.gender,
      });

      if (data.success) {
        setSajuPreview(data.sajuResult);
        onSuccess(data.sajuResult);
      } else {
        alert(data.error || ERROR_MANSERYEOK_FAILED);
        onError();
      }
    } catch {
      alert(ERROR_NETWORK);
      onError();
    } finally {
      setPreviewLoading(false);
    }
  };

  const clearPreview = () => setSajuPreview(null);

  return { previewLoading, sajuPreview, loadPreview, clearPreview };
}
