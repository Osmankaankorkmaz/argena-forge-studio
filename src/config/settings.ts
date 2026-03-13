import * as vscode from "vscode";
import { ArgenaLanguage, ArgenaThemeMode } from "../types";

function config() {
  return vscode.workspace.getConfiguration("argenaBasic");
}

export function getLanguageSetting(): ArgenaLanguage {
  const value = config().get<string>("language", "tr");
  return value === "en" ? "en" : "tr";
}

export async function setLanguageSetting(value: ArgenaLanguage): Promise<void> {
  await config().update("language", value, vscode.ConfigurationTarget.Global);
}

export function getThemeModeSetting(): ArgenaThemeMode {
  const value = config().get<string>("theme", "system");
  return value === "dark" || value === "light" || value === "system"
    ? value
    : "system";
}

export async function setThemeModeSetting(value: ArgenaThemeMode): Promise<void> {
  await config().update("theme", value, vscode.ConfigurationTarget.Global);
}