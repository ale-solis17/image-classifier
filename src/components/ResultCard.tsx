"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { ClassifyResponse } from "@/src/lib/types";
import { CheckCircle2, TrendingUp } from "lucide-react";

type ResultCardProps = {
  result: ClassifyResponse | null;
  isLoading: boolean;
};

export function ResultCard({ result, isLoading }: ResultCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="mt-1 h-4 w-48" />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  if (!result) return null;

  const confidencePercent = Math.round(result.confidence * 100);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Classification Result</CardTitle>
        </div>
        <CardDescription>AI prediction for your image</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {/* Main prediction */}
        <div className="flex flex-col gap-2 rounded-lg bg-accent/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Predicted Label
            </span>
            <Badge variant="default" className="text-sm">
              {confidencePercent}%
            </Badge>
          </div>
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {result.label}
          </p>
          <Progress value={confidencePercent} className="h-2" />
        </div>

        {/* Top 3 */}
        {result.top && result.top.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Top Predictions
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {result.top.map((item, i) => {
                const pct = Math.round(item.confidence * 100);
                return (
                  <div key={i} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">
                        {item.label}
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
