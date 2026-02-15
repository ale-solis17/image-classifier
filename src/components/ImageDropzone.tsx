"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

type ImageDropzoneProps = {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
};

export function ImageDropzone({ onFileSelect, disabled }: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = useCallback(
    (file: File): string | null => {
      if (!file.type.startsWith("image/")) return "Please select an image file.";
      if (file.size > MAX_SIZE) return "File size must be under 5 MB.";
      return null;
    },
    []
  );

  const handleFile = useCallback(
    (file: File) => {
      const error = validate(file);
      if (error) {
        // We'll use the toast from the parent
        alert(error);
        return;
      }
      onFileSelect(file);
    },
    [validate, onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [disabled, handleFile]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragging(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload image. Drag and drop or click to select."
      className={cn(
        "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors cursor-pointer",
        "min-h-[200px]",
        isDragging
          ? "border-primary bg-accent/50"
          : "border-border hover:border-primary/50 hover:bg-muted/50",
        disabled && "pointer-events-none opacity-50"
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleInputChange}
        aria-hidden="true"
        tabIndex={-1}
      />

      <div className="flex flex-col items-center gap-3 text-center">
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full transition-colors",
            isDragging
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          {isDragging ? (
            <Upload className="h-6 w-6" />
          ) : (
            <ImageIcon className="h-6 w-6" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            {isDragging ? "Drop your image here" : "Drag & drop an image here"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            or click to browse. Max 5 MB.
          </p>
        </div>
      </div>
    </div>
  );
}
