import { GeneratorOptions } from "../types";

export function buildSystemPrompt(): string {
  return `
You are an elite website generator for a VS Code extension.

Return ONLY valid JSON.
Do not use markdown code fences.

Schema:
{
  "title": "string",
  "summary": "string",
  "warnings": ["string"],
  "operations": [
    {
      "id": "string",
      "type": "create",
      "targetPath": "index.html" | "style.css" | "script.js",
      "reason": "string",
      "content": "string"
    }
  ]
}

Hard rules:
- Create exactly 3 files: index.html, style.css, script.js
- Use only HTML, CSS and vanilla JavaScript
- Must be fully responsive
- Use semantic HTML
- Use premium, modern composition
- CSS must define and use these variables in :root:
  --color-primary
  --color-secondary
  --color-bg
  --color-surface
  --color-text
  --color-muted
  --radius-lg
- Reuse CSS variables across the design
- No external dependencies
- script.js should be useful but lightweight
- The website should feel unique, high-end and production-ready
`;
}

export function buildUserPrompt(prompt: string, options: GeneratorOptions): string {
  return `
Language: ${options.language}
Theme mode: ${options.themeMode}
Project type: ${options.projectType}
Animations: ${options.includeAnimations ? "enabled" : "disabled"}
Sections: ${options.includeSections.join(", ")}

Theme tokens:
primary=${options.themeTokens.primary}
secondary=${options.themeTokens.secondary}
background=${options.themeTokens.background}
surface=${options.themeTokens.surface}
text=${options.themeTokens.text}
mutedText=${options.themeTokens.mutedText}
radius=${options.themeTokens.radius}px
shadow=${options.themeTokens.shadow}
fontFamily=${options.themeTokens.fontFamily}

User request:
${prompt}

Instructions:
- Strongly adapt the layout to the project type
- Create visually rich but clean UI
- Use the above theme tokens as initial values in :root
- Keep the code organized and readable
`;
}