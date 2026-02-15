"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Loader2, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageDropzone } from "@/src/components/ImageDropzone";
import { ImagePreview } from "@/src/components/ImagePreview";
import { ResultCard } from "@/src/components/ResultCard";
import { HowItWorks } from "@/src/components/HowItWorks";
import { classifyImage } from "@/src/lib/api/classify";
import type { ClassifyResponse, HistoryItem } from "@/src/lib/types";

type ClassifyTabProps = {
  onClassified: (item: HistoryItem) => void;
};

export function ClassifyTab({ onClassified }: ClassifyTabProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<ClassifyResponse | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);

  const handleFileSelect = useCallback((f: File) => {
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setResult(null);
  }, []);

  const handleClear = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
  }, [previewUrl]);

  const handleClassify = useCallback(async () => {
    if (!file) return;
    setIsClassifying(true);

    try {
      const res = await classifyImage(file);
      setResult(res);
      toast.success("Classification completed!");

      const historyItem: HistoryItem = {
        id: crypto.randomUUID(),
        imageUrl: previewUrl ?? "",
        label: res.label,
        confidence: res.confidence,
        createdAt: new Date().toISOString(),
        top: res.top,
      };
      onClassified(historyItem);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Classification failed"
      );
    } finally {
      setIsClassifying(false);
    }
  }, [file, previewUrl, onClassified]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      {/* Left column */}
      <div className="flex flex-col gap-5">
        {!previewUrl ? (
          <ImageDropzone
            onFileSelect={handleFileSelect}
            disabled={isClassifying}
          />
        ) : (
          <ImagePreview
            src={previewUrl}
            fileName={file?.name ?? "image"}
            onClear={handleClear}
            disabled={isClassifying}
          />
        )}

        <div className="flex gap-3">
          <Button
            onClick={handleClassify}
            disabled={!file || isClassifying}
            className="flex-1"
          >
            {isClassifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Classifying...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Classify
              </>
            )}
          </Button>
          {(file || result) && (
            <Button
              variant="outline"
              onClick={handleClear}
              disabled={isClassifying}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>

        <ResultCard result={result} isLoading={isClassifying} />
      </div>

      {/* Right column */}
      <div className="hidden lg:block">
        <HowItWorks />
      </div>
    </div>
  );
}
