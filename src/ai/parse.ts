import { WebsitePlan } from "../types";

export function extractTextFromAiResponse(response: unknown): string {
  if (typeof response === "string") return response;

  if (response && typeof response === "object") {
    const obj = response as {
      message?: { content?: string };
      content?: string;
      text?: string;
    };

    if (typeof obj.message?.content === "string") return obj.message.content;
    if (typeof obj.content === "string") return obj.content;
    if (typeof obj.text === "string") return obj.text;
  }

  return JSON.stringify(response);
}

export function extractJsonBlock(text: string): string {
  const trimmed = text.trim();

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }

  const jsonFence = trimmed.match(/```json\s*([\s\S]*?)```/i);
  if (jsonFence?.[1]) {
    return jsonFence[1].trim();
  }

  const genericFence = trimmed.match(/```\s*([\s\S]*?)```/i);
  if (genericFence?.[1]) {
    return genericFence[1].trim();
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  throw new Error("AI cevabında JSON bulunamadı.");
}

function decodeEscapedContent(content: string): string {
  const trimmed = content.trim();

  if (!trimmed) return content;

  // Eğer içerik baştan sona JSON string gibiyse
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return content;
    }
  }

  // Eğer içinde escape karakterleri varsa düzelt
  if (
    content.includes("\\n") ||
    content.includes('\\"') ||
    content.includes("\\t") ||
    content.includes("\\r")
  ) {
    return content
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\r")
      .replace(/\\t/g, "\t")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\");
  }

  return content;
}

function normalizePlan(plan: WebsitePlan): WebsitePlan {
  return {
    ...plan,
    operations: plan.operations.map((op) => ({
      ...op,
      content: decodeEscapedContent(op.content)
    }))
  };
}

export function parseWebsitePlan(response: unknown): WebsitePlan {
  const text = extractTextFromAiResponse(response);
  const json = extractJsonBlock(text);
  const parsed = JSON.parse(json) as WebsitePlan;

  if (!Array.isArray(parsed.operations)) {
    throw new Error("Geçersiz plan formatı.");
  }

  const mustHave = ["index.html", "style.css", "script.js"];
  for (const file of mustHave) {
    if (!parsed.operations.some((op) => op.targetPath === file)) {
      throw new Error(`Eksik dosya: ${file}`);
    }
  }

  return normalizePlan(parsed);
}

export function findOperationContent(plan: WebsitePlan, targetPath: string): string {
  return plan.operations.find((op) => op.targetPath === targetPath)?.content ?? "";
}