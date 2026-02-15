"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatasetFilters } from "@/src/components/dataset/DatasetFilters";
import { DatasetGrid } from "@/src/components/dataset/DatasetGrid";
import { fetchDataset } from "@/src/lib/api/dataset";
import type { DatasetItem } from "@/src/lib/types";

export function DatasetTab() {
  const [items, setItems] = useState<DatasetItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchDataset({
        query: query || undefined,
        status: status === "all" ? undefined : status,
        from: dateFrom || undefined,
        to: dateTo || undefined,
        page: currentPage,
      });
      setItems(res.items);
      setTotalPages(res.totalPages);
    } catch {
      toast.error("Failed to load dataset");
    } finally {
      setIsLoading(false);
    }
  }, [query, status, dateFrom, dateTo, currentPage]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, status, dateFrom, dateTo]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Dataset Explorer
        </h2>
        <p className="text-sm text-muted-foreground">
          Browse and manage saved images in the dataset.
        </p>
      </div>

      <DatasetFilters
        query={query}
        onQueryChange={setQuery}
        status={status}
        onStatusChange={setStatus}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
      />

      <DatasetGrid items={items} isLoading={isLoading} onRefresh={loadData} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
