import { ExtensionState } from "../../types";

function esc(value: string): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function checked(list: string[], value: string): string {
  return list.includes(value) ? "checked" : "";
}

export function getSidebarHtml(state: ExtensionState): string {
  const { options } = state;
  const disabled = state.isGenerating ? "disabled" : "";

  return `<!DOCTYPE html>
<html lang="${options.language}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    :root {
      --bg: var(--vscode-editor-background, #0f172a);
      --panel: var(--vscode-sideBar-background, #111827);
      --text: var(--vscode-foreground, #e5eefc);
      --muted: var(--vscode-descriptionForeground, #94a3b8);
      --border: var(--vscode-panel-border, rgba(148,163,184,0.14));
      --accent: ${options.themeTokens.primary};
      --accent-2: ${options.themeTokens.secondary};
      --radius: 16px;
      --success: #22c55e;
      --overlay: rgba(15, 23, 42, 0.74);
    }

    * { box-sizing: border-box; }

    html, body {
      margin: 0;
      padding: 0;
      background: var(--bg);
      color: var(--text);
      font-family: Arial, sans-serif;
    }

    body {
      padding: 14px;
    }

    .app {
      display: grid;
      gap: 14px;
      position: relative;
    }

    .panel {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 14px;
    }

    .hero-panel {
      position: relative;
      overflow: hidden;
    }

    .hero-panel::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at top right, rgba(124, 58, 237, 0.22), transparent 35%),
        radial-gradient(circle at bottom left, rgba(37, 99, 235, 0.22), transparent 35%);
      pointer-events: none;
    }

    .hero-panel > * {
      position: relative;
      z-index: 1;
    }

    .title {
      font-size: 20px;
      font-weight: 800;
      margin-bottom: 8px;
    }

    .muted {
      color: var(--muted);
      font-size: 12px;
      line-height: 1.5;
    }

    .grid {
      display: grid;
      gap: 12px;
    }

    .grid2 {
      display: grid;
      gap: 12px;
      grid-template-columns: 1fr 1fr;
    }

    label {
      display: block;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 6px;
    }

    input, textarea, select, button {
      width: 100%;
      border-radius: 12px;
      border: 1px solid var(--border);
      background: transparent;
      color: var(--text);
      padding: 10px 12px;
      font-size: 13px;
      outline: none;
    }

    input:focus, textarea:focus, select:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.18);
    }

    textarea {
      min-height: 128px;
      resize: vertical;
      line-height: 1.5;
    }

    textarea::placeholder,
    input::placeholder {
      color: var(--muted);
    }

    input[type="color"] {
      padding: 4px;
      height: 42px;
      cursor: pointer;
      background: transparent;
    }

    input[type="checkbox"] {
      width: auto;
      margin-right: 8px;
      padding: 0;
      accent-color: var(--accent);
    }

    input[type="range"] {
      padding: 0;
      cursor: pointer;
      accent-color: var(--accent);
    }

    .actions, .actions3 {
      display: grid;
      gap: 10px;
    }

    .actions {
      grid-template-columns: 1fr 1fr;
    }

    .actions3 {
      grid-template-columns: 1fr 1fr 1fr;
    }

    button {
      cursor: pointer;
      font-weight: 700;
      transition: transform 0.15s ease, opacity 0.15s ease, border-color 0.15s ease;
    }

    button:hover:not(:disabled) {
      transform: translateY(-1px);
    }

    button:disabled,
    input:disabled,
    textarea:disabled,
    select:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .primary {
      background: linear-gradient(135deg, var(--accent), var(--accent-2));
      border: none;
      color: white;
    }

    .secondary-btn {
      background: rgba(255,255,255,0.02);
    }

    .ghost-btn {
      background: transparent;
    }

    .chip-list {
      display: grid;
      gap: 8px;
    }

    .check {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: var(--text);
      border: 1px solid var(--border);
      padding: 8px 10px;
      border-radius: 12px;
      background: rgba(255,255,255,0.02);
    }

    .small {
      font-size: 11px;
      color: var(--muted);
    }

    .status-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 4px;
      font-size: 11px;
      color: var(--muted);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: ${state.isGenerating ? "var(--accent)" : "var(--success)"};
      box-shadow: 0 0 0 6px ${
        state.isGenerating ? "rgba(37,99,235,0.14)" : "rgba(34,197,94,0.14)"
      };
    }

    .plan-card {
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 10px;
      margin-top: 10px;
      background: rgba(255,255,255,0.02);
    }

    .path {
      font-family: monospace;
      font-size: 12px;
      margin-bottom: 4px;
      word-break: break-word;
      color: #cbd5e1;
    }

    .empty-box {
      border: 1px dashed var(--border);
      border-radius: 12px;
      padding: 14px;
      text-align: center;
      color: var(--muted);
      font-size: 12px;
    }

    .hint {
      border: 1px solid rgba(59, 130, 246, 0.18);
      background: rgba(59, 130, 246, 0.08);
      border-radius: 12px;
      padding: 12px;
      font-size: 12px;
      color: #cbd5e1;
      line-height: 1.5;
    }

    .loading-overlay {
      position: fixed;
      inset: 0;
      background: var(--overlay);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999;
      padding: 20px;
    }

    .loading-card {
      width: min(340px, calc(100vw - 40px));
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 22px;
      text-align: center;
      box-shadow: 0 18px 50px rgba(0,0,0,0.28);
    }

    .spinner {
      width: 44px;
      height: 44px;
      border-radius: 999px;
      border: 3px solid rgba(255,255,255,0.14);
      border-top-color: var(--accent);
      margin: 0 auto 14px;
      animation: spin 0.9s linear infinite;
    }

    .loading-title {
      font-size: 15px;
      font-weight: 800;
      margin-bottom: 6px;
    }

    .loading-text {
      color: var(--muted);
      font-size: 12px;
      line-height: 1.6;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 700px) {
      .grid2, .actions, .actions3 {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="app">
    <section class="panel hero-panel">
      <div class="title">Argena Forge</div>
      <div class="muted">AI website builder + live preview + live theme controls</div>
      <div class="status-row">
        <span class="status-dot"></span>
        <span>${state.isGenerating ? "AI şu anda plan üretiyor..." : "Hazır"}</span>
      </div>
    </section>

    <section class="panel">
      <div class="hint">
        Renkleri ve temayı buradan değiştirince preview paneli eş zamanlı güncellenir.
        Yeni site üretmek için prompt yazıp Generate kullan.
      </div>
    </section>

    <section class="panel grid">
      <div>
        <label>Prompt</label>
        <textarea id="prompt" placeholder="Örn: premium bir SaaS landing page oluştur" ${disabled}>${esc(state.prompt)}</textarea>
      </div>

      <div class="grid2">
        <div>
          <label>Language</label>
          <select id="language" ${disabled}>
            <option value="tr" ${options.language === "tr" ? "selected" : ""}>Türkçe</option>
            <option value="en" ${options.language === "en" ? "selected" : ""}>English</option>
          </select>
        </div>
        <div>
          <label>Theme Mode</label>
          <select id="themeMode" ${disabled}>
            <option value="system" ${options.themeMode === "system" ? "selected" : ""}>System</option>
            <option value="dark" ${options.themeMode === "dark" ? "selected" : ""}>Dark</option>
            <option value="light" ${options.themeMode === "light" ? "selected" : ""}>Light</option>
          </select>
        </div>
      </div>

      <div class="grid2">
        <div>
          <label>Project Type</label>
          <select id="projectType" ${disabled}>
            <option value="agency" ${options.projectType === "agency" ? "selected" : ""}>Agency</option>
            <option value="saas" ${options.projectType === "saas" ? "selected" : ""}>SaaS</option>
            <option value="portfolio" ${options.projectType === "portfolio" ? "selected" : ""}>Portfolio</option>
            <option value="blog" ${options.projectType === "blog" ? "selected" : ""}>Blog</option>
            <option value="dashboard" ${options.projectType === "dashboard" ? "selected" : ""}>Dashboard</option>
            <option value="startup" ${options.projectType === "startup" ? "selected" : ""}>Startup</option>
            <option value="app" ${options.projectType === "app" ? "selected" : ""}>App Promo</option>
          </select>
        </div>
        <div>
          <label>Model</label>
          <input id="model" value="${esc(options.model)}" placeholder="gpt-5-nano" ${disabled} />
        </div>
      </div>

      <div class="grid2">
        <div>
          <label>Primary</label>
          <input type="color" id="primary" value="${esc(options.themeTokens.primary)}" ${disabled} />
        </div>
        <div>
          <label>Secondary</label>
          <input type="color" id="secondary" value="${esc(options.themeTokens.secondary)}" ${disabled} />
        </div>
      </div>

      <div class="grid2">
        <div>
          <label>Background</label>
          <input type="color" id="background" value="${esc(options.themeTokens.background)}" ${disabled} />
        </div>
        <div>
          <label>Surface</label>
          <input type="color" id="surface" value="${esc(options.themeTokens.surface)}" ${disabled} />
        </div>
      </div>

      <div class="grid2">
        <div>
          <label>Text</label>
          <input type="color" id="text" value="${esc(options.themeTokens.text)}" ${disabled} />
        </div>
        <div>
          <label>Muted Text</label>
          <input type="color" id="mutedText" value="${esc(options.themeTokens.mutedText)}" ${disabled} />
        </div>
      </div>

      <div class="grid2">
        <div>
          <label>Radius <span class="small" id="radiusValue">${options.themeTokens.radius}px</span></label>
          <input type="range" id="radius" min="4" max="36" value="${options.themeTokens.radius}" ${disabled} />
        </div>
        <div>
          <label>Font</label>
          <select id="fontFamily" ${disabled}>
            <option value="inter" ${options.themeTokens.fontFamily === "inter" ? "selected" : ""}>Inter</option>
            <option value="poppins" ${options.themeTokens.fontFamily === "poppins" ? "selected" : ""}>Poppins</option>
            <option value="system" ${options.themeTokens.fontFamily === "system" ? "selected" : ""}>System</option>
          </select>
        </div>
      </div>

      <div class="grid2">
        <div>
          <label>Shadow</label>
          <select id="shadow" ${disabled}>
            <option value="soft" ${options.themeTokens.shadow === "soft" ? "selected" : ""}>Soft</option>
            <option value="medium" ${options.themeTokens.shadow === "medium" ? "selected" : ""}>Medium</option>
            <option value="strong" ${options.themeTokens.shadow === "strong" ? "selected" : ""}>Strong</option>
          </select>
        </div>
        <div>
          <label>Animations</label>
          <select id="animations" ${disabled}>
            <option value="true" ${options.includeAnimations ? "selected" : ""}>Enabled</option>
            <option value="false" ${!options.includeAnimations ? "selected" : ""}>Disabled</option>
          </select>
        </div>
      </div>

      <div>
        <label>Sections</label>
        <div class="chip-list">
          ${["hero", "features", "about", "pricing", "testimonials", "cta", "footer"]
            .map(
              (section) => `
                <label class="check">
                  <input type="checkbox" data-section="${section}" ${checked(options.includeSections, section)} ${disabled} />
                  ${section}
                </label>
              `
            )
            .join("")}
        </div>
      </div>

      <div class="actions3">
        <button id="generateBtn" class="primary" ${disabled}>
          ${state.isGenerating ? "Generating..." : "Generate"}
        </button>
        <button id="previewBtn" class="secondary-btn" ${disabled}>Preview</button>
        <button id="applyBtn" class="secondary-btn" ${disabled}>Apply</button>
      </div>

      <div class="actions">
        <button id="resetBtn" class="ghost-btn" ${disabled}>Reset</button>
        <button id="refreshPreviewBtn" class="ghost-btn" ${disabled}>Refresh Preview</button>
      </div>
    </section>

    <section class="panel">
      <div class="title" style="font-size:16px;">Current Plan</div>
      ${
        state.plan
          ? `
            <div class="muted">${esc(state.plan.summary)}</div>
            ${state.plan.operations
              .map(
                (op) => `
                  <div class="plan-card">
                    <div class="path">${esc(op.targetPath)}</div>
                    <div class="small">${esc(op.reason)}</div>
                  </div>
                `
              )
              .join("")}
          `
          : `
            <div class="empty-box">
              Henüz plan yok. Prompt yazıp Generate ile ilk AI planını oluştur.
            </div>
          `
      }
    </section>
  </div>

  ${
    state.isGenerating
      ? `
      <div class="loading-overlay">
        <div class="loading-card">
          <div class="spinner"></div>
          <div class="loading-title">AI çalışıyor</div>
          <div class="loading-text">
            Website planı ve dosyalar hazırlanıyor. İşlem tamamlanınca ekran otomatik güncellenecek.
          </div>
        </div>
      </div>
    `
      : ""
  }

  <script>
    const vscode = acquireVsCodeApi();

    document.getElementById("generateBtn")?.addEventListener("click", () => {
      const promptEl = document.getElementById("prompt");
      const prompt = promptEl && "value" in promptEl ? promptEl.value : "";
      vscode.postMessage({ type: "generate", prompt });
    });

    document.getElementById("applyBtn")?.addEventListener("click", () => {
      vscode.postMessage({ type: "apply" });
    });

    document.getElementById("previewBtn")?.addEventListener("click", () => {
      vscode.postMessage({ type: "openPreview" });
    });

    document.getElementById("refreshPreviewBtn")?.addEventListener("click", () => {
      vscode.postMessage({ type: "openPreview" });
    });

    document.getElementById("resetBtn")?.addEventListener("click", () => {
      vscode.postMessage({ type: "resetState" });
    });

    document.getElementById("language")?.addEventListener("change", (e) => {
      const target = e.target;
      if (target && "value" in target) {
        vscode.postMessage({ type: "setLanguage", value: target.value });
      }
    });

    document.getElementById("themeMode")?.addEventListener("change", (e) => {
      const target = e.target;
      if (target && "value" in target) {
        vscode.postMessage({ type: "setThemeMode", value: target.value });
      }
    });

    document.getElementById("projectType")?.addEventListener("change", (e) => {
      const target = e.target;
      if (target && "value" in target) {
        vscode.postMessage({ type: "setProjectType", value: target.value });
      }
    });

    document.getElementById("model")?.addEventListener("change", (e) => {
      const target = e.target;
      if (target && "value" in target) {
        vscode.postMessage({ type: "setModel", value: target.value });
      }
    });

    document.getElementById("primary")?.addEventListener("input", (e) => {
      const target = e.target;
      if (target && "value" in target) {
        vscode.postMessage({ type: "setPrimary", value: target.value });
      }
    });

    document.getElementById("secondary")?.addEventListener("input", (e) => {
      const target = e.target;
      if (target && "value" in target) {
        vscode.postMessage({ type: "setSecondary", value: target.value });
      }
    });

    document.getElementById("background")?.addEventListener("input", (e) => {
      const target = e.target;
      if (target && "value" in target) {
        vscode.postMessage({ type: "setBackground", value: target.value });
      }
    });

    document.getElementById("surface")?.addEventListener("input", (e) => {
      const target = e.target;
      if (target && "value" in target) {
        vscode.postMessage({ type: "setSurface", value: target.value });
      }
    });

    document.getElementById("text")?.addEventListener("input", (e) => {
      const target = e.target;
      if (target && "value" in target) {
        vscode.postMessage({ type: "setText", value: target.value });
      }
    });

    document.getElementById("mutedText")?.addEventListener("input", (e) => {
      const target = e.target;
      if (target && "value" in target) {
        vscode.postMessage({ type: "setMutedText", value: target.value });
      }
    });

    document.getElementById("radius")?.addEventListener("input", (e) => {
      const target = e.target;
      const radiusValueEl = document.getElementById("radiusValue");

      if (target && "value" in target) {
        if (radiusValueEl) {
          radiusValueEl.textContent = target.value + "px";
        }
        vscode.postMessage({ type: "setRadius", value: Number(target.value) });
      }
    });

    document.getElementById("fontFamily")?.addEventListener("change", (e) => {
      const target = e.target;
      if (target && "value" in target) {
        vscode.postMessage({ type: "setFontFamily", value: target.value });
      }
    });

    document.getElementById("shadow")?.addEventListener("change", (e) => {
      const target = e.target;
      if (target && "value" in target) {
        vscode.postMessage({ type: "setShadow", value: target.value });
      }
    });

    document.getElementById("animations")?.addEventListener("change", (e) => {
      const target = e.target;
      if (target && "value" in target) {
        vscode.postMessage({
          type: "setAnimations",
          value: target.value === "true"
        });
      }
    });

    document.querySelectorAll("[data-section]").forEach((el) => {
      el.addEventListener("change", (e) => {
        const target = e.target;
        const section = target?.dataset?.section;
        if (section) {
          vscode.postMessage({ type: "toggleSection", value: section });
        }
      });
    });
  </script>
</body>
</html>`;
}