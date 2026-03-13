export type ArgenaLanguage = "tr" | "en";
export type ArgenaThemeMode = "system" | "dark" | "light";

export type ProjectType =
  | "agency"
  | "saas"
  | "portfolio"
  | "blog"
  | "dashboard"
  | "startup"
  | "app";

export type ShadowLevel = "soft" | "medium" | "strong";
export type FontFamilyPreset = "inter" | "poppins" | "system";

export interface ThemeTokens {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  mutedText: string;
  radius: number;
  shadow: ShadowLevel;
  fontFamily: FontFamilyPreset;
}

export interface PlannedOperation {
  id: string;
  type: "create" | "update";
  targetPath: string;
  content: string;
  reason: string;
}

export interface WebsitePlan {
  title: string;
  summary: string;
  warnings: string[];
  operations: PlannedOperation[];
}

export interface GeneratorOptions {
  language: ArgenaLanguage;
  themeMode: ArgenaThemeMode;
  projectType: ProjectType;
  themeTokens: ThemeTokens;
  includeAnimations: boolean;
  includeSections: string[];
  model: string;
}

export interface ExtensionState {
  prompt: string;
  plan: WebsitePlan | null;
  options: GeneratorOptions;
  previewHtml: string;
  previewCss: string;
  previewJs: string;
  isGenerating: boolean;
}

export type SidebarMessage =
  | { type: "generate"; prompt: string }
  | { type: "apply" }
  | { type: "openPreview" }
  | { type: "resetState" }
  | { type: "setLanguage"; value: ArgenaLanguage }
  | { type: "setThemeMode"; value: ArgenaThemeMode }
  | { type: "setProjectType"; value: ProjectType }
  | { type: "setModel"; value: string }
  | { type: "setPrimary"; value: string }
  | { type: "setSecondary"; value: string }
  | { type: "setBackground"; value: string }
  | { type: "setSurface"; value: string }
  | { type: "setText"; value: string }
  | { type: "setMutedText"; value: string }
  | { type: "setRadius"; value: number }
  | { type: "setFontFamily"; value: FontFamilyPreset }
  | { type: "setShadow"; value: ShadowLevel }
  | { type: "setAnimations"; value: boolean }
  | { type: "toggleSection"; value: string };