"use client";

import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Loader2, Save, Clock, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DatasetItem } from "@/src/lib/types";
import {
  updateDatasetItem,
  deleteDatasetItem,
} from "@/src/lib/api/dataset";

type DatasetDetailDrawerProps = {
  item: DatasetItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefresh: () => void;
};

export function DatasetDetailDrawer({
  item,
  open,
  onOpenChange,
  onRefresh,
}: DatasetDetailDrawerProps) {
  const [editLabel, setEditLabel] = useState("");
  const [editStatus, setEditStatus] = useState("pending");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Sync when item changes
  const handleOpenChange = (o: boolean) => {
    if (o && item) {
      setEditLabel(item.label ?? "");
      setEditStatus(item.status ?? "pending");
    }
    onOpenChange(o);
  };

  if (!item) return null;

  const handleSaveLabel = async () => {
    setSaving(true);
    try {
      await updateDatasetItem(item.id, {
        label: editLabel,
        status: editStatus,
      });
      toast.success("Label saved");
      onRefresh();
      onOpenChange(false);
    } catch {
      toast.error("Failed to save label");
    } finally {
      setSaving(false);
    }
  };

  const handleMarkPending = async () => {
    setSaving(true);
    try {
      await updateDatasetItem(item.id, { status: "pending" });
      toast.success("Marked as pending");
      onRefresh();
      onOpenChange(false);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteDatasetItem(item.id);
      toast.success("Item deleted");
      onRefresh();
      onOpenChange(false);
    } catch {
      toast.error("Failed to delete item");
    } finally {
      setDeleting(false);
    }
  };

  const confidencePercent = item.confidence
    ? Math.round(item.confidence * 100)
    : null;

  const statusColors: Record<string, string> = {
    labeled: "default",
    pending: "secondary",
    rejected: "destructive",
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Dataset Item</DialogTitle>
          <DialogDescription>
            ID: {item.id.slice(0, 8)}... | {format(new Date(item.createdAt), "PPpp")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Image */}
          <div className="overflow-hidden rounded-lg border bg-muted/30">
            <img
              src={item.imageUrl}
              alt={item.label ? `Image labeled ${item.label}` : "Dataset image"}
              className="mx-auto max-h-[250px] object-contain p-2"
            />
          </div>

          {/* Info */}
          <div className="flex items-center gap-2 flex-wrap">
            {item.label && (
              <Badge variant="outline" className="text-xs">
                {item.label}
              </Badge>
            )}
            {confidencePercent !== null && (
              <Badge variant="default" className="text-xs">
                {confidencePercent}% confidence
              </Badge>
            )}
            {item.status && (
              <Badge
                variant={
                  statusColors[item.status] as
                    | "default"
                    | "secondary"
                    | "destructive"
                }
                className="text-xs"
              >
                {item.status}
              </Badge>
            )}
          </div>

          {confidencePercent !== null && (
            <Progress value={confidencePercent} className="h-2" />
          )}

          {/* Edit label */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-label" className="text-sm">
              Edit Label
            </Label>
            <Input
              id="edit-label"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              placeholder="Enter label..."
            />
          </div>

          {/* Edit status */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm">Status</Label>
            <Select value={editStatus} onValueChange={setEditStatus}>
              <SelectTrigger aria-label="Select status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="labeled">Labeled</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            onClick={handleSaveLabel}
            disabled={saving || deleting}
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Label
          </Button>
          <Button
            variant="outline"
            onClick={handleMarkPending}
            disabled={saving || deleting}
          >
            <Clock className="mr-2 h-4 w-4" />
            Mark Pending
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={saving || deleting}
          >
            {deleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
