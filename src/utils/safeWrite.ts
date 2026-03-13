import * as fs from "fs";
import * as path from "path";

export function isPathInsideWorkspace(root: string, targetPath: string): boolean {
  const resolvedRoot = path.resolve(root);
  const resolvedTarget = path.resolve(targetPath);

  return (
    resolvedTarget === resolvedRoot ||
    resolvedTarget.startsWith(resolvedRoot + path.sep)
  );
}

export function safeWriteFile(root: string, relativePath: string, content: string): void {
  const fullPath = path.resolve(root, relativePath);

  if (!isPathInsideWorkspace(root, fullPath)) {
    throw new Error(`Invalid target path: ${relativePath}`);
  }

  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, "utf8");
}