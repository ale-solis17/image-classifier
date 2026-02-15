export type ClassifyResponse = {
  label: string;
  confidence: number; // 0..1
  top?: { label: string; confidence: number }[];
};

export type HistoryItem = {
  id: string;
  imageUrl: string;
  label: string;
  confidence: number;
  createdAt: string;
  top?: { label: string; confidence: number }[];
};

export type DatasetItem = {
  id: string;
  imageUrl: string;
  label?: string;
  confidence?: number;
  status?: "labeled" | "pending" | "rejected";
  createdAt: string;
};

export type DatasetDetailItem = DatasetItem & {
  top?: { label: string; confidence: number }[];
};
