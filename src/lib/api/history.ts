import type { HistoryItem } from "@/src/lib/types";

export async function fetchHistory(): Promise<HistoryItem[]> {
  const res = await fetch("/api/history");
  if (!res.ok) throw new Error("Failed to fetch history");
  return res.json();
}
