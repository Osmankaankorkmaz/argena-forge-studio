import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { init } from "@heyputer/puter.js/src/init.cjs";
import { getWorkspaceRoot } from "../utils/paths";

function loadEnv(): { token: string; model: string } {
  const root = getWorkspaceRoot();

  const candidates = [
    root ? path.join(root, ".env") : "",
    path.join(process.cwd(), ".env")
  ].filter(Boolean);

  for (const file of candidates) {
    if (fs.existsSync(file)) {
      dotenv.config({ path: file });
      break;
    }
  }

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0IjoicyIsInYiOiIwLjAuMCIsInUiOiI2SzFNNHd5SFJldXFiQnNKUGh5L1RRPT0iLCJ1dSI6ImVIS1BLS1JoVHNPYUwyQ3hUdWt5VFE9PSIsImlhdCI6MTc3MTAwNTU3M30.wO0xiZoP759ZCkhrbqdPrll-Xwd1Z99NqOifsY0w7V8";

  const model =
    process.env.PUTER_MODEL?.trim() ||
    process.env.puterModel?.trim() ||
    "gpt-5-nano";

  if (!token) {
    throw new Error("PUTER_AUTH_TOKEN bulunamadı.");
  }

  return { token, model };
}

export async function createPuterClient() {
  const { token, model } = loadEnv();
  const puter = await init(token);
  return { puter, model };
}