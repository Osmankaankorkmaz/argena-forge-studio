import { ExtensionState } from "../../types";
import { buildThemeCssVars, getFontStack, getShadowVar } from "../../utils/cssVars";

export function getPreviewHtml(state: ExtensionState): string {
  const vars = buildThemeCssVars(state.options.themeTokens);
  const fontStack = getFontStack(state.options.themeTokens.fontFamily);
  const shadow = getShadowVar(state.options.themeTokens.shadow);

  const loadingView = `
  <div style="
    min-height:100vh;
    display:flex;
    align-items:center;
    justify-content:center;
    background:var(--color-bg);
    color:var(--color-text);
    font-family:${fontStack};
    padding:24px;
  ">
    <div style="
      width:min(360px,100%);
      background:var(--color-surface);
      border:1px solid rgba(255,255,255,0.08);
      border-radius:24px;
      padding:24px;
      text-align:center;
      box-shadow:${shadow};
    ">
      <div style="
        width:46px;
        height:46px;
        margin:0 auto 14px;
        border-radius:999px;
        border:3px solid rgba(255,255,255,0.12);
        border-top-color:var(--color-primary);
        animation:spin .9s linear infinite;
      "></div>
      <h2 style="margin:0 0 8px;">AI hazırlıyor...</h2>
      <p style="margin:0;color:var(--color-muted);line-height:1.6;">
        Tasarım ve kodlar oluşturuluyor.
      </p>
    </div>
  </div>
  `;

  const fallback = `
  <div style="padding:32px;color:#e5eefc;font-family:${fontStack};background:#0f172a;min-height:100vh">
    <h2 style="margin-top:0">Argena Preview</h2>
    <p>Henüz AI çıktısı yok. Soldan prompt yazıp plan oluştur.</p>
  </div>
  `;

  return `<!DOCTYPE html>
<html lang="${state.options.language}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    ${vars}
    :root {
      --font-stack: ${fontStack};
      --preview-shadow: ${shadow};
    }
    html, body {
      margin: 0;
      padding: 0;
      background: var(--color-bg);
      color: var(--color-text);
      font-family: var(--font-stack);
    }
    body {
      min-height: 100vh;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    ${state.previewCss || ""}
  </style>
</head>
<body>
  ${state.isGenerating ? loadingView : state.previewHtml || fallback}
  <script>
    ${state.isGenerating ? "" : state.previewJs || ""}
  </script>
</body>
</html>`;
}