import { apiRequest, API_BASE_URL } from "./api";
import { getToken } from "./auth";

export type DocumentScope = "global" | "franchise";

export type AppDocument = {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  file_url: string;
  scope: DocumentScope;
  franchise_id: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateDocumentPayload = {
  title: string;
  description?: string | null;
  category?: string | null;
  file_url: string;
  scope?: DocumentScope;
  franchise_id?: number | null;
  is_active?: boolean;
};

export type UploadDocumentResponse = {
  file_url: string;
  original_filename: string;
};

export async function listAdminDocuments(): Promise<AppDocument[]> {
  const token = getToken();

  return apiRequest<AppDocument[]>("/api/v1/documents", {
    method: "GET",
    token,
  });
}

export async function createDocument(
  payload: CreateDocumentPayload
): Promise<AppDocument> {
  const token = getToken();

  return apiRequest<AppDocument>("/api/v1/documents", {
    method: "POST",
    token,
    body: JSON.stringify({
      ...payload,
      scope: payload.scope ?? "global",
      is_active: payload.is_active ?? true,
    }),
  });
}

export async function listMyDocuments(): Promise<AppDocument[]> {
  const token = getToken();

  return apiRequest<AppDocument[]>("/api/v1/documents/my-documents", {
    method: "GET",
    token,
  });
}

export async function uploadDocumentFile(
  file: File,
  title?: string
): Promise<UploadDocumentResponse> {
  const token = getToken();

  const formData = new FormData();
  formData.append("file", file);

  if (title?.trim()) {
    formData.append("title", title.trim());
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/documents/upload`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = "Não foi possível enviar o arquivo.";

    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {}

    throw new Error(errorMessage);
  }

  return response.json() as Promise<UploadDocumentResponse>;
}