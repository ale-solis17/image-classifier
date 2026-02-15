import { NextResponse } from "next/server";
import type { DatasetItem } from "@/src/lib/types";

const MOCK_LABELS = [
  "Amanita muscaria",
  "Boletus edulis",
  "Cantharellus cibarius",
  "Morchella esculenta",
  "Agaricus bisporus",
  "Lactarius deliciosus",
  "Pleurotus ostreatus",
  "Tuber melanosporum",
];

const STATUSES: DatasetItem["status"][] = ["labeled", "pending", "rejected"];

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1504198266287-1659872e6590?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1518882463776-2af5fde6cf64?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1474557157379-8aa74a6ef541?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1509773896068-7fd415d91e2e?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=200&h=200&fit=crop",
];

// Generate 24 mock items
function generateMockDataset(): DatasetItem[] {
  return Array.from({ length: 24 }, (_, i) => {
    const hasLabel = Math.random() > 0.2;
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    return {
      id: `ds-${String(i + 1).padStart(4, "0")}`,
      imageUrl: PLACEHOLDER_IMAGES[i % PLACEHOLDER_IMAGES.length],
      label: hasLabel
        ? MOCK_LABELS[Math.floor(Math.random() * MOCK_LABELS.length)]
        : undefined,
      confidence: hasLabel
        ? Math.round((0.4 + Math.random() * 0.6) * 100) / 100
        : undefined,
      status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
      createdAt: date.toISOString(),
    };
  });
}

const DATASET = generateMockDataset();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query")?.toLowerCase() ?? "";
  const status = url.searchParams.get("status") ?? "";
  const from = url.searchParams.get("from") ?? "";
  const to = url.searchParams.get("to") ?? "";
  const page = parseInt(url.searchParams.get("page") ?? "1", 10);
  const perPage = 8;

  // Simulate delay
  await new Promise((r) => setTimeout(r, 400 + Math.random() * 400));

  let filtered = [...DATASET];

  if (query) {
    filtered = filtered.filter(
      (item) =>
        item.label?.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query)
    );
  }

  if (status) {
    filtered = filtered.filter((item) => item.status === status);
  }

  if (from) {
    const fromDate = new Date(from);
    filtered = filtered.filter(
      (item) => new Date(item.createdAt) >= fromDate
    );
  }

  if (to) {
    const toDate = new Date(to);
    toDate.setDate(toDate.getDate() + 1);
    filtered = filtered.filter((item) => new Date(item.createdAt) <= toDate);
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const start = (page - 1) * perPage;
  const items = filtered.slice(start, start + perPage);

  return NextResponse.json({
    items,
    totalPages,
    currentPage: page,
  });
}
