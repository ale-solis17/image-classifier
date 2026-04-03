"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClassifyTab } from "./ClassifyTab";
import { HistoryTab } from "./HistoryTab";
import { DatasetTab } from "./DatasetTab";
import type { HistoryItem } from "@/src/lib/types";
import { Microscope, History, Database } from "lucide-react";

const MAX_HISTORY = 20;
const HISTORY_STORAGE_KEY = "visionlab.history";

function withoutImages(items: HistoryItem[]): HistoryItem[] {
  return items.map((item) => ({
    ...item,
    imageUrl: "",
  }));
}

function persistHistory(items: HistoryItem[]): "full" | "metadata-only" | "failed" {
  const payloads: Array<{ mode: "full" | "metadata-only"; items: HistoryItem[] }> = [
    { mode: "full", items },
    { mode: "metadata-only", items: withoutImages(items) },
  ];

  for (const payload of payloads) {
    try {
      window.localStorage.setItem(
        HISTORY_STORAGE_KEY,
        JSON.stringify(payload.items)
      );
      return payload.mode;
    } catch (error) {
      if (!(error instanceof DOMException) || error.name !== "QuotaExceededError") {
        break;
      }
    }
  }

  try {
    window.localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch {}

  return "failed";
}

export function AppTabs() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyReady, setHistoryReady] = useState(false);
  const [storageMode, setStorageMode] = useState<"full" | "metadata-only" | "failed">(
    "full"
  );

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored) as HistoryItem[]);
      }
    } catch {
      window.localStorage.removeItem(HISTORY_STORAGE_KEY);
    } finally {
      setHistoryReady(true);
    }
  }, []);

  useEffect(() => {
    if (!historyReady) return;

    const nextMode = persistHistory(history);
    setStorageMode((currentMode) => {
      if (currentMode !== nextMode) {
        if (nextMode === "metadata-only") {
          toast.warning(
            "Las imagenes del historial son demasiado grandes para guardarse localmente. Las entradas se conservaran sin miniaturas despues de recargar."
          );
        }

        if (nextMode === "failed") {
          toast.error(
            "No se pudo guardar el historial en el almacenamiento local. La sesion actual seguira funcionando."
          );
        }
      }

      return nextMode;
    });
  }, [history, historyReady]);

  const handleClassified = useCallback((item: HistoryItem) => {
    setHistory((prev) => [item, ...prev].slice(0, MAX_HISTORY));
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return (
    <Tabs defaultValue="classify" className="w-full">
      <TabsList className="w-full sm:w-auto">
        <TabsTrigger value="classify" className="flex-1 sm:flex-none">
          <Microscope className="mr-1.5 h-4 w-4" />
          Clasificar
        </TabsTrigger>
        <TabsTrigger value="history" className="flex-1 sm:flex-none">
          <History className="mr-1.5 h-4 w-4" />
          Historial
          {history.length > 0 && (
            <span className="ml-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
              {history.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="dataset" className="flex-1 sm:flex-none">
          <Database className="mr-1.5 h-4 w-4" />
          Dataset
        </TabsTrigger>
      </TabsList>

      <TabsContent value="classify" className="mt-6">
        <ClassifyTab onClassified={handleClassified} />
      </TabsContent>

      <TabsContent value="history" className="mt-6">
        <HistoryTab items={history} onClearHistory={handleClearHistory} />
      </TabsContent>

      <TabsContent value="dataset" className="mt-6">
        <DatasetTab />
      </TabsContent>
    </Tabs>
  );
}
