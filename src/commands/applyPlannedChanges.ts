import * as vscode from "vscode";
import { getStore } from "../state/store";
import { getWorkspaceRoot } from "../utils/paths";
import { safeWriteFile } from "../utils/safeWrite";

export async function applyPlannedChangesCommand(): Promise<void> {
  const root = getWorkspaceRoot();

  if (!root) {
    vscode.window.showWarningMessage("Önce bir klasör açmalısın.");
    return;
  }

  const state = getStore();
  const plan = state.plan;

  if (!plan) {
    vscode.window.showWarningMessage("Önce plan oluştur.");
    return;
  }

  try {
    for (const op of plan.operations) {
      safeWriteFile(root, op.targetPath, op.content);
    }

    vscode.window.showInformationMessage("Dosyalar başarıyla yazıldı.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    vscode.window.showErrorMessage(`Dosyalar yazılamadı: ${message}`);
  }
}