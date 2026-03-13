import * as vscode from "vscode";
import { getStore } from "../../state/store";
import { getPreviewHtml } from "./html";

export class ArgenaPreviewPanel {
  public static currentPanel: ArgenaPreviewPanel | undefined;
  private readonly panel: vscode.WebviewPanel;

  private constructor(panel: vscode.WebviewPanel) {
    this.panel = panel;
  }

  static createOrShow(): ArgenaPreviewPanel {
    if (ArgenaPreviewPanel.currentPanel) {
      ArgenaPreviewPanel.currentPanel.panel.reveal(vscode.ViewColumn.Beside);
      ArgenaPreviewPanel.currentPanel.render();
      return ArgenaPreviewPanel.currentPanel;
    }

    const panel = vscode.window.createWebviewPanel(
      "argenaPreview",
      "Argena Preview",
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );

    const instance = new ArgenaPreviewPanel(panel);
    ArgenaPreviewPanel.currentPanel = instance;

    panel.onDidDispose(() => {
      if (ArgenaPreviewPanel.currentPanel === instance) {
        ArgenaPreviewPanel.currentPanel = undefined;
      }
    });

    instance.render();
    return instance;
  }

  render(): void {
    this.panel.webview.html = getPreviewHtml(getStore());
  }

  static refresh(): void {
    ArgenaPreviewPanel.currentPanel?.render();
  }
}