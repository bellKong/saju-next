import { apiRequest } from "./client";

interface UpdateProfileResponse {
  success: boolean;
  error?: string;
}

export async function updateProfile(data: {
  name: string;
  birthDate: string | null;
  gender: string | null;
}): Promise<UpdateProfileResponse> {
  return apiRequest<UpdateProfileResponse>("/api/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
