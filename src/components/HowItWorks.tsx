"use client";

import { Upload, Cpu, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Sube",
    description: "Arrastra y suelta o haz clic para subir tu imagen.",
  },
  {
    icon: Cpu,
    title: "Clasifica",
    description: "Nuestro modelo de IA analiza la imagen y genera una prediccion.",
  },
  {
    icon: BarChart3,
    title: "Resultados",
    description: "Visualiza la etiqueta predicha y los niveles de confianza.",
  },
];

export function HowItWorks() {
  return (
    <div className="rounded-xl border bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Como funciona
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
