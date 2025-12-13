export function buildPrompt({ src, instructions, fewshot, task }) {
  return `
${task}

# Few-shot
${fewshot}

# ユーザー指示
${instructions}

# 入力テキスト
${src}
`.trim();
}
