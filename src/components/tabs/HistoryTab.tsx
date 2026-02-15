"use client";

import { HistoryCards } from "@/src/components/history/HistoryCards";
import type { HistoryItem } from "@/src/lib/types";

type HistoryTabProps = {
  items: HistoryItem[];
  onClearHistory: () => void;
};

export function HistoryTab({ items, onClearHistory }: HistoryTabProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Classification History
        </h2>
        <p className="text-sm text-muted-foreground">
          Review your past classifications. Data is stored in memory (max 20).
        </p>
      </div>
      <HistoryCards items={items} onClearHistory={onClearHistory} />
    </div>
  );
}
