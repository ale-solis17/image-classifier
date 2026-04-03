"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, SendHorizontal, Sprout, ShieldAlert } from "lucide-react";
import { askBacteriaChat } from "@/src/lib/api/chat";
import type { ChatMessage } from "@/src/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type BacteriaChatProps = {
  bacteriaLabel: string;
};

const SUGGESTED_QUESTIONS = [
  "¿Qué es esta bacteria?",
  "¿Qué sintomas o efectos puede causar?",
  "¿Cómo se puede prevenir o controlar?",
];

function formatScopeLabel(scope: string | null) {
  if (!scope) return null;
  if (scope === "bacteria-agricultura") {
    return "contexto agricola sobre bacterias";
  }

  return scope.replace(/-/g, " ");
}

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);

  return parts.filter(Boolean).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4"
        >
          {linkMatch[1]}
        </a>
      );
    }

    return <Fragment key={index}>{part}</Fragment>;
  });
}

function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const blocks: Array<{ type: string; lines: string[] }> = [];

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const isBullet = /^[-*]\s+/.test(line);
    const isNumbered = /^\d+\.\s+/.test(line);

    if (!line.trim()) {
      blocks.push({ type: "space", lines: [] });
      continue;
    }

    if (isBullet) {
      const last = blocks[blocks.length - 1];
      if (last?.type === "ul") {
        last.lines.push(line.replace(/^[-*]\s+/, ""));
      } else {
        blocks.push({
          type: "ul",
          lines: [line.replace(/^[-*]\s+/, "")],
        });
      }
      continue;
    }

    if (isNumbered) {
      const last = blocks[blocks.length - 1];
      if (last?.type === "ol") {
        last.lines.push(line.replace(/^\d+\.\s+/, ""));
      } else {
        blocks.push({
          type: "ol",
          lines: [line.replace(/^\d+\.\s+/, "")],
        });
      }
      continue;
    }

    blocks.push({ type: "p", lines: [line] });
  }

  return blocks.map((block, index) => {
    if (block.type === "space") {
      return <div key={index} className="h-1" />;
    }

    if (block.type === "ul") {
      return (
        <ul key={index} className="list-disc space-y-1 pl-5">
          {block.lines.map((line, itemIndex) => (
            <li key={itemIndex}>{renderInlineMarkdown(line)}</li>
          ))}
        </ul>
      );
    }

    if (block.type === "ol") {
      return (
        <ol key={index} className="list-decimal space-y-1 pl-5">
          {block.lines.map((line, itemIndex) => (
            <li key={itemIndex}>{renderInlineMarkdown(line)}</li>
          ))}
        </ol>
      );
    }

    const line = block.lines[0];
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const contentNode = renderInlineMarkdown(headingMatch[2]);

      if (level === 1) {
        return (
          <h1 key={index} className="text-base font-semibold">
            {contentNode}
          </h1>
        );
      }

      if (level === 2) {
        return (
          <h2 key={index} className="text-sm font-semibold">
            {contentNode}
          </h2>
        );
      }

      return (
        <h3 key={index} className="text-sm font-medium">
          {contentNode}
        </h3>
      );
    }

    if (line.startsWith("> ")) {
      return (
        <blockquote
          key={index}
          className="border-l-2 border-border pl-3 text-muted-foreground"
        >
          {renderInlineMarkdown(line.slice(2))}
        </blockquote>
      );
    }

    return (
      <p key={index} className="whitespace-pre-wrap">
        {renderInlineMarkdown(line)}
      </p>
    );
  });
}

export function BacteriaChat({ bacteriaLabel }: BacteriaChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [lastScope, setLastScope] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMessages([]);
    setInput("");
    setLastScope(null);
  }, [bacteriaLabel]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, isSending]);

  const hasMessages = messages.length > 0;
  const scopeLabel = useMemo(() => formatScopeLabel(lastScope), [lastScope]);

  const helperText = useMemo(
    () =>
      `Haz preguntas sobre ${bacteriaLabel}. El historial completo se enviara en cada turno.`,
    [bacteriaLabel]
  );

  const sendMessage = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isSending) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];

    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    try {
      const response = await askBacteriaChat({
        bacteria_label: bacteriaLabel,
        messages: nextMessages,
      });

      setLastScope(response.scope);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: response.answer,
        },
      ]);

      if (response.refused) {
        toast.warning(
          "El backend limito la respuesta para mantenerla dentro de su alcance permitido."
        );
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo enviar el mensaje"
      );
      setMessages(messages);
      setInput(trimmed);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="border-primary/20 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sprout className="h-4 w-4 text-primary" />
              Chat sobre la Bacteria
            </CardTitle>
            <CardDescription>{helperText}</CardDescription>
          </div>
          <div className="rounded-full border bg-accent/50 px-3 py-1 text-xs font-medium text-accent-foreground">
            {bacteriaLabel}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="rounded-xl border bg-muted/20">
          <ScrollArea className="h-[320px]">
            <div className="flex flex-col gap-3 p-4">
              {!hasMessages && (
                <div className="rounded-lg border border-dashed bg-background/70 p-4 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">
                    Puedes preguntarme sobre:
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {SUGGESTED_QUESTIONS.map((question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() => void sendMessage(question)}
                        className="rounded-full border bg-background px-3 py-1.5 text-left text-xs transition-colors hover:bg-accent"
                        disabled={isSending}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                    message.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-background"
                  )}
                >
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide opacity-70">
                    {message.role === "user" ? "Tu" : "Asistente"}
                  </p>
                  <div className="space-y-2">
                    {message.role === "assistant"
                      ? renderMarkdown(message.content)
                      : <p className="whitespace-pre-wrap">{message.content}</p>}
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="max-w-[85%] rounded-2xl bg-background px-4 py-3 text-sm shadow-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generando respuesta...
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          </ScrollArea>
        </div>

        <div className="rounded-xl border bg-background p-3">
          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldAlert className="h-3.5 w-3.5" />
            Alcance: las respuestas se limitaran segun el contexto definido por el backend.
            {scopeLabel ? ` (${scopeLabel})` : ""}
          </div>
          <div className="flex flex-col gap-3">
            <Textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Escribe tu pregunta sobre esta bacteria..."
              className="min-h-[96px] resize-none"
              disabled={isSending}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void sendMessage(input);
                }
              }}
            />
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                Enter envia. Shift + Enter agrega una nueva linea.
              </p>
              <Button
                onClick={() => void sendMessage(input)}
                disabled={!input.trim() || isSending}
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <SendHorizontal className="h-4 w-4" />
                )}
                Enviar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
