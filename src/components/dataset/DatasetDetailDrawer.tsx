"use client";

import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { DatasetItem } from "@/src/lib/types";

type DatasetDetailDrawerProps = {
  item: DatasetItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefresh: () => void;
};

const statusLabels: Record<string, string> = {
  labeled: "Etiquetado",
  pending: "Pendiente",
  rejected: "Rechazado",
};

const statusColors: Record<string, "default" | "secondary" | "destructive"> = {
  labeled: "default",
  pending: "secondary",
  rejected: "destructive",
};

export function DatasetDetailDrawer({
  item,
  open,
  onOpenChange,
}: DatasetDetailDrawerProps) {
  if (!item) return null;

  const confidencePercent =
    item.confidence != null ? Math.round(item.confidence * 100) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalle del Dataset</DialogTitle>
          <DialogDescription>
            ID: {item.id} | {format(new Date(item.createdAt), "PPpp")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-lg border bg-muted/30">
            <img
              src={item.imageUrl}
              alt={item.humanLabel ?? item.predictedLabel ?? "Imagen del dataset"}
              className="mx-auto max-h-[280px] object-contain p-2"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {item.status && (
              <Badge
                variant={statusColors[item.status] ?? "secondary"}
                className="text-xs"
              >
                {statusLabels[item.status] ?? item.status}
              </Badge>
            )}
            {confidencePercent !== null && (
              <Badge variant="outline" className="text-xs">
                {confidencePercent}% de confianza
              </Badge>
            )}
          </div>

          {confidencePercent !== null && (
            <Progress value={confidencePercent} className="h-2" />
          )}

          <div className="grid gap-3 rounded-lg border p-4 text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Nombre original</span>
              <span className="font-medium text-foreground">{item.originalName}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Etiqueta predicha</span>
              <span className="font-medium text-foreground">
                {item.predictedLabel ?? "No disponible"}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Etiqueta humana</span>
              <span className="font-medium text-foreground">
                {item.humanLabel ?? "No disponible"}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Ruta del archivo</span>
              <span className="break-all font-mono text-xs text-foreground">
                {item.filePath}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
