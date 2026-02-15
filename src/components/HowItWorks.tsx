"use client";

import { Upload, Cpu, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload",
    description: "Drag and drop or click to upload your image.",
  },
  {
    icon: Cpu,
    title: "Classify",
    description: "Our AI model analyzes the image and generates a prediction.",
  },
  {
    icon: BarChart3,
    title: "Results",
    description: "View the predicted label and confidence scores.",
  },
];

export function HowItWorks() {
  return (
    <div className="rounded-xl border bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        How it works
      </h3>
      <div className="flex flex-col gap-4">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <step.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {step.title}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
