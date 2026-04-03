export type ClassifyResponse = {
  label: string;
  confidence: number; // 0..1
  top?: { label: string; confidence: number }[];
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type BacteriaChatResponse = {
  answer: string;
  bacteria_label: string;
  refused: boolean;
  scope: string;
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
