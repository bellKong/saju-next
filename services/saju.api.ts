import { apiRequest } from "./client";
import type { SajuResult } from "@/types";

interface SajuPreviewResponse {
  success: boolean;
  sajuResult: SajuResult;
  error?: string;
}

export async function fetchSajuPreview(data: {
  personId: string;
  birthDate: string;
  birthTime: string;
  calendarType: string;
  gender: string;
}): Promise<SajuPreviewResponse> {
  return apiRequest<SajuPreviewResponse>("/api/saju/preview", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
