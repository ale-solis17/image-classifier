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
          Historial de Clasificaciones
        </h2>
        <p className="text-sm text-muted-foreground">
          Revisa tus clasificaciones anteriores. Los datos se guardan localmente en tu navegador (maximo 20).
        </p>
      </div>
      <HistoryCards items={items} onClearHistory={onClearHistory} />
    </div>
  );
}
