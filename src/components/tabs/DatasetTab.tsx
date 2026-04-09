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
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchDataset({
        query: query || undefined,
        status: status === "all" ? undefined : status,
        page: currentPage,
      });
      setItems(res.items);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } catch {
      toast.error("No se pudo cargar el dataset");
    } finally {
      setIsLoading(false);
    }
  }, [query, status, currentPage]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, status]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Explorador del Dataset
        </h2>
        <p className="text-sm text-muted-foreground">
          Visualiza las imagenes reales registradas por el backend.
        </p>
      </div>

      <DatasetFilters
        query={query}
        onQueryChange={setQuery}
        status={status}
        onStatusChange={setStatus}
      />

      <p className="text-xs text-muted-foreground">
        {total} elementos encontrados
      </p>

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
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Pagina {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Siguiente
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
