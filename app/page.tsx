import { AppTabs } from "@/src/components/tabs/AppTabs";
import { Leaf } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";


export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">
              VisionLab
            </h1>
            <p className="text-xs text-muted-foreground">
              AI-powered image classification
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <AppTabs />
      </div>
    </main>
  );
}
