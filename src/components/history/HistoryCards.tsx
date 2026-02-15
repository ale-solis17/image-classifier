"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  ArrowUpDown,
  Search,
  Trash2,
  Eye,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { HistoryItem } from "@/src/lib/types";
import { HistoryDetailDrawer } from "./HistoryDetailDrawer";

type HistoryCardsProps = {
  items: HistoryItem[];
  onClearHistory: () => void;
};

export function HistoryCards({ items, onClearHistory }: HistoryCardsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(false);
  const [highConfidenceOnly, setHighConfidenceOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = [...items];

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((item) => item.label.toLowerCase().includes(q));
    }

    // Filter by high confidence
    if (highConfidenceOnly) {
      result = result.filter((item) => item.confidence >= 0.8);
    }

    // Sort by date
    result.sort((a, b) => {
      const diff =
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortAsc ? diff : -diff;
    });

    return result;
  }, [items, searchQuery, sortAsc, highConfidenceOnly]);

  const handleViewDetail = (item: HistoryItem) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Filter className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="mt-4 text-sm font-medium text-foreground">
          No classifications yet
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Go to the Classify tab to start classifying images.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filters bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by label..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            aria-label="Search classifications by label"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="high-confidence"
              checked={highConfidenceOnly}
              onCheckedChange={setHighConfidenceOnly}
            />
            <Label htmlFor="high-confidence" className="text-xs">
              {"High confidence (>= 80%)"}
            </Label>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortAsc(!sortAsc)}
          >
            <ArrowUpDown className="mr-1.5 h-3.5 w-3.5" />
            {sortAsc ? "Oldest first" : "Newest first"}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onClearHistory}
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            Clear
          </Button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {items.length} results
      </p>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No results match your filters.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const pct = Math.round(item.confidence * 100);
            return (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex h-28 items-center justify-center bg-muted/30">
                  <img
                    src={item.imageUrl}
                    alt={`Classified as ${item.label}`}
                    className="max-h-full object-contain p-2"
                  />
                </div>
                <CardContent className="flex flex-col gap-2 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground truncate">
                      {item.label}
                    </span>
                    <Badge
                      variant={pct >= 80 ? "default" : "secondary"}
                      className="shrink-0"
                    >
                      {pct}%
                    </Badge>
                  </div>
                  <Progress value={pct} className="h-1.5" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(item.createdAt), "MMM d, HH:mm")}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => handleViewDetail(item)}
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      Detail
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <HistoryDetailDrawer
        item={selectedItem}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
