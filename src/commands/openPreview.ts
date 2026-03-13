import { ArgenaPreviewPanel } from "../webview/preview/provider";

export async function openPreviewCommand(): Promise<void> {
  ArgenaPreviewPanel.createOrShow();
}