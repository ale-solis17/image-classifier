import type { ClassifyResponse } from "@/src/lib/types";

export async function classifyImage(file: File): Promise<ClassifyResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("Falta configurar NEXT_PUBLIC_API_URL");
  }

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${apiUrl}/classify`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Error desconocido");
    throw new Error(`La clasificacion fallo: ${text}`);
  }

  return res.json();
}
