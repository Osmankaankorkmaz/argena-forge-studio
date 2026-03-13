import { ExtensionState } from "../types";

export const defaultState: ExtensionState = {
  prompt: "",
  plan: null,
  previewHtml: "",
  previewCss: "",
  previewJs: "",
  isGenerating: false,
  options: {
    language: "tr",
    themeMode: "system",
    projectType: "agency",
    includeAnimations: true,
    includeSections: ["hero", "features", "about", "cta", "footer"],
    model: "gpt-5-nano",
    themeTokens: {
      primary: "#2563eb",
      secondary: "#7c3aed",
      background: "#0f172a",
      surface: "#111827",
      text: "#e5eefc",
      mutedText: "#94a3b8",
      radius: 18,
      shadow: "medium",
      fontFamily: "inter"
    }
  }
};