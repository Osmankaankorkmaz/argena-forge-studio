import { ThemeTokens } from "../types";

export function buildThemeCssVars(tokens: ThemeTokens): string {
  return `
:root {
  --color-primary: ${tokens.primary};
  --color-secondary: ${tokens.secondary};
  --color-bg: ${tokens.background};
  --color-surface: ${tokens.surface};
  --color-text: ${tokens.text};
  --color-muted: ${tokens.mutedText};
  --radius-lg: ${tokens.radius}px;
  --shadow-soft: 0 10px 30px rgba(0,0,0,0.15);
  --shadow-medium: 0 16px 45px rgba(0,0,0,0.24);
  --shadow-strong: 0 22px 60px rgba(0,0,0,0.32);
}
`.trim();
}

export function getFontStack(fontFamily: ThemeTokens["fontFamily"]): string {
  switch (fontFamily) {
    case "poppins":
      return `'Poppins', ui-sans-serif, system-ui, sans-serif`;
    case "system":
      return `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
    case "inter":
    default:
      return `'Inter', ui-sans-serif, system-ui, sans-serif`;
  }
}

export function getShadowVar(shadow: ThemeTokens["shadow"]): string {
  switch (shadow) {
    case "soft":
      return "var(--shadow-soft)";
    case "strong":
      return "var(--shadow-strong)";
    case "medium":
    default:
      return "var(--shadow-medium)";
  }
}