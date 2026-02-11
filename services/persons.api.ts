import { apiRequest } from "./client";

interface CreatePersonRequest {
  name: string;
  relationship: string;
  birthDate: string;
  birthTime: string | null;
  calendarType: string;
  gender: string;
}

interface CreatePersonResponse {
  success: boolean;
  person: {
    id: string;
    name: string;
    relationship: string;
    birthDate: string;
    birthTime: string | null;
    calendarType: string;
    gender: string;
  };
  error?: string;
}

export async function createPerson(
  data: CreatePersonRequest
): Promise<CreatePersonResponse> {
  return apiRequest<CreatePersonResponse>("/api/persons", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deletePerson(id: string): Promise<void> {
  await apiRequest(`/api/persons/${id}`, { method: "DELETE" });
}
