// runner.js
import { getPrompt } from "./decoder.js";

const args = process.argv.slice(2);
const key = args[0];

if (!key) {
  console.log("Usage: node runner.js <blockName>");
  process.exit(1);
}

const prompt = getPrompt(key);

if (!prompt) {
  console.log(`プロンプト '${key}' は存在しません`);
  process.exit(1);
}

console.log(`=== PROMPT:${key} ===\n`);
console.log(prompt);
