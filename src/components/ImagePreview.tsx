"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type ImagePreviewProps = {
  src: string;
  fileName: string;
  onClear: () => void;
  disabled?: boolean;
};

export function ImagePreview({
  src,
  fileName,
  onClear,
  disabled,
}: ImagePreviewProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border bg-card">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <p className="truncate text-xs font-medium text-muted-foreground">
          {fileName}
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onClear}
          disabled={disabled}
          aria-label="Remove image"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="flex items-center justify-center bg-muted/30 p-4">
        <img
          src={src}
          alt={`Preview of ${fileName}`}
          className="max-h-[300px] rounded-lg object-contain"
        />
      </div>
    </div>
  );
}
