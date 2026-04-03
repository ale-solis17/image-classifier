import type { BacteriaChatResponse, ChatMessage } from "@/src/lib/types";

type BacteriaChatRequest = {
  bacteria_label: string;
  messages: ChatMessage[];
};

export async function askBacteriaChat(
  payload: BacteriaChatRequest
): Promise<BacteriaChatResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("Falta configurar NEXT_PUBLIC_API_URL");
  }

  const res = await fetch(`${apiUrl}/chat/bacteria`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Error desconocido");
    throw new Error(`El chat fallo: ${text}`);
  }

  return res.json();
}
