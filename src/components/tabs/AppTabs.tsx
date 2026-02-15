"use client";

import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClassifyTab } from "./ClassifyTab";
import { HistoryTab } from "./HistoryTab";
import { DatasetTab } from "./DatasetTab";
import type { HistoryItem } from "@/src/lib/types";
import { Microscope, History, Database } from "lucide-react";

const MAX_HISTORY = 20;

export function AppTabs() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

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
          Classify
        </TabsTrigger>
        <TabsTrigger value="history" className="flex-1 sm:flex-none">
          <History className="mr-1.5 h-4 w-4" />
          History
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
