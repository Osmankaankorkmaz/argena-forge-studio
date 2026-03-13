import * as vscode from "vscode";
import {
  FontFamilyPreset,
  ProjectType,
  ShadowLevel,
  SidebarMessage
} from "../../types";
import { getStore, updateOptions } from "../../state/store";
import { generateFromPromptCommand } from "../../commands/generateFromPrompt";
import { applyPlannedChangesCommand } from "../../commands/applyPlannedChanges";
import { openPreviewCommand } from "../../commands/openPreview";
import { resetProjectStateCommand } from "../../commands/resetProjectState";
import { getSidebarHtml } from "./html";
import { ArgenaPreviewPanel } from "../preview/provider";
import {
  setLanguageSetting,
  setThemeModeSetting
} from "../../config/settings";

export class ArgenaSidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "argenaBasic.sidebar";
  private view?: vscode.WebviewView;

  resolveWebviewView(view: vscode.WebviewView): void {
    this.view = view;

    view.webview.options = {
      enableScripts: true
    };

    this.render();

    view.webview.onDidReceiveMessage(async (message: SidebarMessage) => {
      await this.handleMessage(message);
    });
  }

  private async handleMessage(message: SidebarMessage): Promise<void> {
    switch (message.type) {
      case "generate":
        await generateFromPromptCommand(message.prompt);
        break;

      case "apply":
        await applyPlannedChangesCommand();
        break;

      case "openPreview":
        await openPreviewCommand();
        break;

      case "resetState":
        await resetProjectStateCommand();
        break;

      case "setLanguage":
        await setLanguageSetting(message.value);
        await updateOptions((o) => ({ ...o, language: message.value }));
        break;

      case "setThemeMode":
        await setThemeModeSetting(message.value);
        await updateOptions((o) => ({ ...o, themeMode: message.value }));
        break;

      case "setProjectType":
        await updateOptions((o) => ({ ...o, projectType: message.value as ProjectType }));
        break;

      case "setModel":
        await updateOptions((o) => ({ ...o, model: message.value }));
        break;

      case "setPrimary":
        await updateOptions((o) => ({
          ...o,
          themeTokens: { ...o.themeTokens, primary: message.value }
        }));
        break;

      case "setSecondary":
        await updateOptions((o) => ({
          ...o,
          themeTokens: { ...o.themeTokens, secondary: message.value }
        }));
        break;

      case "setBackground":
        await updateOptions((o) => ({
          ...o,
          themeTokens: { ...o.themeTokens, background: message.value }
        }));
        break;

      case "setSurface":
        await updateOptions((o) => ({
          ...o,
          themeTokens: { ...o.themeTokens, surface: message.value }
        }));
        break;

      case "setText":
        await updateOptions((o) => ({
          ...o,
          themeTokens: { ...o.themeTokens, text: message.value }
        }));
        break;

      case "setMutedText":
        await updateOptions((o) => ({
          ...o,
          themeTokens: { ...o.themeTokens, mutedText: message.value }
        }));
        break;

      case "setRadius":
        await updateOptions((o) => ({
          ...o,
          themeTokens: { ...o.themeTokens, radius: Number(message.value) || 18 }
        }));
        break;

      case "setFontFamily":
        await updateOptions((o) => ({
          ...o,
          themeTokens: {
            ...o.themeTokens,
            fontFamily: message.value as FontFamilyPreset
          }
        }));
        break;

      case "setShadow":
        await updateOptions((o) => ({
          ...o,
          themeTokens: {
            ...o.themeTokens,
            shadow: message.value as ShadowLevel
          }
        }));
        break;

      case "setAnimations":
        await updateOptions((o) => ({ ...o, includeAnimations: message.value }));
        break;

      case "toggleSection":
        await updateOptions((o) => {
          const exists = o.includeSections.includes(message.value);
          return {
            ...o,
            includeSections: exists
              ? o.includeSections.filter((s) => s !== message.value)
              : [...o.includeSections, message.value]
          };
        });
        break;
    }

    this.render();
    ArgenaPreviewPanel.refresh();
  }

  render(): void {
    if (!this.view) return;
    this.view.webview.html = getSidebarHtml(getStore());
  }
}