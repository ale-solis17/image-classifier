import type { DatasetItem, DatasetDetailItem } from "@/src/lib/types";

export type DatasetQueryParams = {
  query?: string;
  label?: string;
  status?: string;
  from?: string;
  to?: string;
  page?: number;
};

export type DatasetListResponse = {
  items: DatasetItem[];
  totalPages: number;
  currentPage: number;
};

export async function fetchDataset(
  params: DatasetQueryParams
): Promise<DatasetListResponse> {
  const searchParams = new URLSearchParams();
  if (params.query) searchParams.set("query", params.query);
  if (params.label) searchParams.set("label", params.label);
  if (params.status) searchParams.set("status", params.status);
  if (params.from) searchParams.set("from", params.from);
  if (params.to) searchParams.set("to", params.to);
  if (params.page) searchParams.set("page", String(params.page));

  const res = await fetch(`/api/dataset?${searchParams.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch dataset");
  return res.json();
}

export async function fetchDatasetItem(
  id: string
): Promise<DatasetDetailItem> {
  const res = await fetch(`/api/dataset/${id}`);
  if (!res.ok) throw new Error("Failed to fetch dataset item");
  return res.json();
}

export async function updateDatasetItem(
  id: string,
  data: { label?: string; status?: string }
): Promise<DatasetDetailItem> {
  const res = await fetch(`/api/dataset/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update dataset item");
  return res.json();
}

export async function deleteDatasetItem(id: string): Promise<void> {
  const res = await fetch(`/api/dataset/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete dataset item");
}
