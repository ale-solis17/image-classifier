import type { ClassifyResponse } from "@/src/lib/types";

export async function classifyImage(file: File): Promise<ClassifyResponse> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("/api/classify", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`Classification failed: ${text}`);
  }

  return res.json();
}
