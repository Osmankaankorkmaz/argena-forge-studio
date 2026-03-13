import * as vscode from "vscode";
import { createPuterClient } from "../ai/puterClient";
import { buildSystemPrompt, buildUserPrompt } from "../ai/prompts";
import { findOperationContent, parseWebsitePlan } from "../ai/parse";
import { getStore, setStore } from "../state/store";
import { ArgenaPreviewPanel } from "../webview/preview/provider";

export async function generateFromPromptCommand(prompt?: string): Promise<void> {
  const state = getStore();
  const finalPrompt = (prompt ?? state.prompt).trim();

  if (!finalPrompt) {
    vscode.window.showWarningMessage("Prompt boş olamaz.");
    return;
  }

  await setStore({
    prompt: finalPrompt,
    isGenerating: true
  });
  ArgenaPreviewPanel.refresh();

  try {
    const latestState = getStore();
    const { puter, model } = await createPuterClient();

    const response = await puter.ai.chat(
      [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: buildUserPrompt(finalPrompt, latestState.options) }
      ],
      {
        model: latestState.options.model || model
      }
    );

    const plan = parseWebsitePlan(response);

    await setStore({
      prompt: finalPrompt,
      plan,
      previewHtml: findOperationContent(plan, "index.html"),
      previewCss: findOperationContent(plan, "style.css"),
      previewJs: findOperationContent(plan, "script.js"),
      isGenerating: false
    });

    ArgenaPreviewPanel.refresh();
    vscode.window.showInformationMessage("AI planı oluşturuldu.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    await setStore({
      isGenerating: false
    });

    ArgenaPreviewPanel.refresh();
    vscode.window.showErrorMessage(`Plan oluşturulamadı: ${message}`);
  }
}