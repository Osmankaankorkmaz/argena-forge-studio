import * as vscode from "vscode";
import { ExtensionState } from "../types";
import { defaultState } from "./defaults";

const KEY = "argenaForgeBasic.state";
let contextRef: vscode.ExtensionContext | null = null;

function cloneDefault(): ExtensionState {
  return JSON.parse(JSON.stringify(defaultState)) as ExtensionState;
}

export function bindStore(context: vscode.ExtensionContext): void {
  contextRef = context;
}

export function getStore(): ExtensionState {
  if (!contextRef) return cloneDefault();
  return contextRef.globalState.get<ExtensionState>(KEY, cloneDefault());
}

export async function setStore(partial: Partial<ExtensionState>): Promise<void> {
  if (!contextRef) return;
  const current = getStore();
  const next: ExtensionState = {
    ...current,
    ...partial
  };
  await contextRef.globalState.update(KEY, next);
}

export async function resetStore(): Promise<void> {
  if (!contextRef) return;
  await contextRef.globalState.update(KEY, cloneDefault());
}

export async function updateOptions(
  updater: (options: ExtensionState["options"]) => ExtensionState["options"]
): Promise<void> {
  const current = getStore();
  await setStore({
    options: updater(current.options)
  });
}