import { apiRequest } from "./client";
import type { ReadingResult } from "@/types";

interface CreateReadingResponse {
  success: boolean;
  reading: ReadingResult & { input: Record<string, string>; createdAt: string };
  error?: string;
}

export async function createReading(body: {
  type: string;
  input?: Record<string, unknown>;
  personId?: string;
}): Promise<CreateReadingResponse> {
  return apiRequest<CreateReadingResponse>("/api/readings", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function createShareLink(readingId: string): Promise<void> {
  await apiRequest(`/api/readings/${readingId}/share`, {
    method: "POST",
  });
}
