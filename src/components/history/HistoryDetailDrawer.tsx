"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { HistoryItem } from "@/src/lib/types";
import { format } from "date-fns";
import { ImageOff } from "lucide-react";

type HistoryDetailDrawerProps = {
  item: HistoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function HistoryDetailDrawer({
  item,
  open,
  onOpenChange,
}: HistoryDetailDrawerProps) {
  if (!item) return null;

  const confidencePercent = Math.round(item.confidence * 100);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalle de la Clasificacion</DialogTitle>
          <DialogDescription>
            {format(new Date(item.createdAt), "PPpp")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Image */}
          <div className="overflow-hidden rounded-lg border bg-muted/30">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={`Clasificada como ${item.label}`}
                className="mx-auto max-h-[300px] object-contain p-2"
              />
            ) : (
              <div className="flex min-h-[220px] flex-col items-center justify-center gap-2 text-muted-foreground">
                <ImageOff className="h-8 w-8" />
                <p className="text-sm">Vista previa no disponible para este elemento guardado</p>
              </div>
            )}
          </div>

          {/* Main prediction */}
          <div className="flex flex-col gap-2 rounded-lg bg-accent/50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Etiqueta Predicha
              </span>
              <Badge variant="default">{confidencePercent}%</Badge>
            </div>
            <p className="text-xl font-bold text-foreground">{item.label}</p>
            <Progress value={confidencePercent} className="h-2" />
          </div>

          {/* Top predictions */}
          {item.top && item.top.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Predicciones Principales
              </span>
              {item.top.map((t, i) => {
                const pct = Math.round(t.confidence * 100);
                return (
                  <div key={i} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">
                        {t.label}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {pct}%
                      </span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                  </div>
                );
              })}
            </div>
          )}

          {/* Metadata */}
          <div className="flex flex-col gap-1 rounded-lg border p-3 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>ID</span>
              
              <span className="font-mono">{item.id.slice(0, 8)}...</span>
            </div>
            <div className="flex justify-between">
              <span>Fecha</span>
              <span>{format(new Date(item.createdAt), "PPpp")}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
