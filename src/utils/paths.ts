import * as vscode from "vscode";

export function getWorkspaceRoot(): string | null {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders?.length) return null;
  return folders[0].uri.fsPath;
}