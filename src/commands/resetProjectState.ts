import * as vscode from "vscode";
import { resetStore } from "../state/store";
import { ArgenaPreviewPanel } from "../webview/preview/provider";

export async function resetProjectStateCommand(): Promise<void> {
  await resetStore();
  ArgenaPreviewPanel.refresh();
  vscode.window.showInformationMessage("Argena state sıfırlandı.");
}