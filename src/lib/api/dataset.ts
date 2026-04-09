import type { DatasetItem } from "@/src/lib/types";

export type DatasetQueryParams = {
  query?: string;
  status?: string;
  page?: number;
};

export type DatasetListResponse = {
  items: DatasetItem[];
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  offset: number;
};

type BackendDatasetItem = {
  id: number;
  file_path: string;
  image_url: string;
  original_name: string;
  predicted_label?: string | null;
  confidence?: number | null;
  status?: "labeled" | "pending" | "rejected" | null;
  human_label?: string | null;
  created_at: string;
};

type BackendDatasetResponse = {
  total: number;
  limit: number;
  offset: number;
  items: BackendDatasetItem[];
};

const DEFAULT_LIMIT = 8;

function getApiUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("Falta configurar NEXT_PUBLIC_API_URL");
  }

  return apiUrl.replace(/\/$/, "");
}

function mapDatasetItem(item: BackendDatasetItem): DatasetItem {
  return {
    id: String(item.id),
    imageUrl: item.image_url,
    originalName: item.original_name,
    filePath: item.file_path,
    predictedLabel: item.predicted_label ?? undefined,
    humanLabel: item.human_label ?? undefined,
    confidence: item.confidence ?? undefined,
    status: item.status ?? undefined,
    createdAt: item.created_at,
  };
}

export async function fetchDataset(
  params: DatasetQueryParams
): Promise<DatasetListResponse> {
  const apiUrl = getApiUrl();
  const page = Math.max(1, params.page ?? 1);
  const offset = (page - 1) * DEFAULT_LIMIT;

  const searchParams = new URLSearchParams();
  searchParams.set("limit", String(DEFAULT_LIMIT));
  searchParams.set("offset", String(offset));

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.query?.trim()) {
    searchParams.set("human_label", params.query.trim());
  }

  const res = await fetch(`${apiUrl}/dataset?${searchParams.toString()}`);
  if (!res.ok) {
    const text = await res.text().catch(() => "Error desconocido");
    throw new Error(`No se pudo cargar el dataset: ${text}`);
  }

  const data = (await res.json()) as BackendDatasetResponse;
  const totalPages = Math.max(1, Math.ceil(data.total / data.limit));
  const currentPage = Math.floor(data.offset / data.limit) + 1;

  return {
    items: data.items.map((item) => mapDatasetItem(item)),
    total: data.total,
    totalPages,
    currentPage,
    limit: data.limit,
    offset: data.offset,
  };
}
