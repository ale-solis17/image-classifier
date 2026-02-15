"use client";

import { useState } from "react";
import { Eye, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DatasetItem } from "@/src/lib/types";
import { DatasetDetailDrawer } from "./DatasetDetailDrawer";

type DatasetGridProps = {
  items: DatasetItem[];
  isLoading: boolean;
  onRefresh: () => void;
};

const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  labeled: "default",
  pending: "secondary",
  rejected: "destructive",
};

export function DatasetGrid({ items, isLoading, onRefresh }: DatasetGridProps) {
  const [selectedItem, setSelectedItem] = useState<DatasetItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpen = (item: DatasetItem) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-32 w-full" />
            <CardContent className="flex flex-col gap-2 p-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Database className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="mt-4 text-sm font-medium text-foreground">
          No dataset items found
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Try adjusting your filters or adding images to the dataset.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <Card
            key={item.id}
            className="group overflow-hidden cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => handleOpen(item)}
          >
            <div className="relative flex h-32 items-center justify-center bg-muted/30">
              <img
                src={item.imageUrl}
                alt={item.label ? `Labeled ${item.label}` : "Dataset image"}
                className="max-h-full object-contain p-2"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 opacity-0 transition-all group-hover:bg-foreground/5 group-hover:opacity-100">
                <Button variant="secondary" size="sm" className="text-xs">
                  <Eye className="mr-1 h-3 w-3" />
                  Open
                </Button>
              </div>
            </div>
            <CardContent className="flex flex-col gap-1.5 p-3">
              <div className="flex items-center justify-between">
                <span className="truncate text-sm font-medium text-foreground">
                  {item.label ?? "Unlabeled"}
                </span>
                {item.confidence != null && (
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">
                    {Math.round(item.confidence * 100)}%
                  </span>
                )}
              </div>
              {item.status && (
                <Badge
                  variant={statusVariant[item.status] ?? "outline"}
                  className="w-fit text-[10px]"
                >
                  {item.status}
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <DatasetDetailDrawer
        item={selectedItem}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onRefresh={onRefresh}
      />
    </>
  );
}
