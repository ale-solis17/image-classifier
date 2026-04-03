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

const STORAGE_KEY = "visionlab.dataset";
const PER_PAGE = 8;

const MOCK_LABELS = [
  "Amanita muscaria",
  "Boletus edulis",
  "Cantharellus cibarius",
  "Morchella esculenta",
  "Agaricus bisporus",
  "Lactarius deliciosus",
  "Pleurotus ostreatus",
  "Tuber melanosporum",
] as const;

const STATUSES: NonNullable<DatasetItem["status"]>[] = [
  "labeled",
  "pending",
  "rejected",
];

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1504198266287-1659872e6590?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1518882463776-2af5fde6cf64?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1474557157379-8aa74a6ef541?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1509773896068-7fd415d91e2e?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&h=400&fit=crop",
] as const;

function delay(ms = 150) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createSeedDataset(): DatasetDetailItem[] {
  return Array.from({ length: 24 }, (_, index) => {
    const label = MOCK_LABELS[index % MOCK_LABELS.length];
    const status = STATUSES[index % STATUSES.length];
    const createdAt = new Date(Date.now() - index * 86400000).toISOString();
    const confidence = Number((0.55 + (index % 5) * 0.08).toFixed(2));

    return {
      id: `ds-${String(index + 1).padStart(4, "0")}`,
      imageUrl: PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length],
      label: status === "pending" ? undefined : label,
      confidence: status === "pending" ? undefined : confidence,
      status,
      createdAt,
      top:
        status === "pending"
          ? undefined
          : [
              { label, confidence },
              {
                label: MOCK_LABELS[(index + 1) % MOCK_LABELS.length],
                confidence: Number((confidence * 0.35).toFixed(2)),
              },
              {
                label: MOCK_LABELS[(index + 2) % MOCK_LABELS.length],
                confidence: Number((confidence * 0.18).toFixed(2)),
              },
            ],
    };
  });
}

function ensureBrowser() {
  if (typeof window === "undefined") {
    throw new Error("El almacenamiento del dataset solo esta disponible en el navegador");
  }
}

function readDataset(): DatasetDetailItem[] {
  ensureBrowser();

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as DatasetDetailItem[];
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }

  const seed = createSeedDataset();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
}

function writeDataset(items: DatasetDetailItem[]) {
  ensureBrowser();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export async function fetchDataset(
  params: DatasetQueryParams
): Promise<DatasetListResponse> {
  await delay();

  let filtered = readDataset();
  const query = params.query?.trim().toLowerCase();
  const label = params.label?.trim().toLowerCase();
  const status = params.status?.trim().toLowerCase();
  const page = Math.max(1, params.page ?? 1);

  if (query) {
    filtered = filtered.filter(
      (item) =>
        item.id.toLowerCase().includes(query) ||
        item.label?.toLowerCase().includes(query)
    );
  }

  if (label) {
    filtered = filtered.filter((item) => item.label?.toLowerCase().includes(label));
  }

  if (status) {
    filtered = filtered.filter((item) => item.status === status);
  }

  if (params.from) {
    const fromDate = new Date(params.from);
    filtered = filtered.filter((item) => new Date(item.createdAt) >= fromDate);
  }

  if (params.to) {
    const toDate = new Date(params.to);
    toDate.setDate(toDate.getDate() + 1);
    filtered = filtered.filter((item) => new Date(item.createdAt) <= toDate);
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PER_PAGE;

  return {
    items: filtered.slice(start, start + PER_PAGE),
    totalPages,
    currentPage,
  };
}

export async function fetchDatasetItem(id: string): Promise<DatasetDetailItem> {
  await delay(100);

  const item = readDataset().find((entry) => entry.id === id);
  if (!item) {
    throw new Error("No se encontro el elemento del dataset");
  }

  return item;
}

export async function updateDatasetItem(
  id: string,
  data: { label?: string; status?: string }
): Promise<DatasetDetailItem> {
  await delay(100);

  const items = readDataset();
  const index = items.findIndex((entry) => entry.id === id);
  if (index < 0) {
    throw new Error("No se encontro el elemento del dataset");
  }

  const nextItem: DatasetDetailItem = {
    ...items[index],
    label: data.label?.trim() ? data.label.trim() : undefined,
    status: (data.status as DatasetItem["status"]) ?? items[index].status,
  };

  items[index] = nextItem;
  writeDataset(items);
  return nextItem;
}

export async function deleteDatasetItem(id: string): Promise<void> {
  await delay(100);

  const nextItems = readDataset().filter((entry) => entry.id !== id);
  writeDataset(nextItems);
}
