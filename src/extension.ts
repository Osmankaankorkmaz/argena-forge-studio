import * as vscode from "vscode";
import { bindStore, updateOptions } from "./state/store";
import { ArgenaSidebarProvider } from "./webview/sidebar/provider";
import {
  getLanguageSetting,
  getThemeModeSetting
} from "./config/settings";
import { openPreviewCommand } from "./commands/openPreview";
import { resetProjectStateCommand } from "./commands/resetProjectState";
import { applyPlannedChangesCommand } from "./commands/applyPlannedChanges";
import { generateFromPromptCommand } from "./commands/generateFromPrompt";

export function activate(context: vscode.ExtensionContext): void {
  bindStore(context);

  void updateOptions((options) => ({
    ...options,
    language: getLanguageSetting(),
    themeMode: getThemeModeSetting()
  }));

  const sidebarProvider = new ArgenaSidebarProvider();

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      ArgenaSidebarProvider.viewType,
      sidebarProvider
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("argenaBasic.openPreview", openPreviewCommand)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("argenaBasic.resetState", resetProjectStateCommand)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "argenaBasic.applyPlannedChanges",
      applyPlannedChangesCommand
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("argenaBasic.generateFromPrompt", async () => {
      const prompt = await vscode.window.showInputBox({
        placeHolder: "Örn: premium bir SaaS landing page oluştur"
      });

      if (!prompt?.trim()) return;
      await generateFromPromptCommand(prompt);
    })
  );
}

export function deactivate(): void {}