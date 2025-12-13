//run--> cd server && npm start

// server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import { getPrompt } from "./vault/decoder.js";
import { runGemini } from "./gemini/runGemini.js";
import { buildPrompt } from "./prompt/buildPrompt.js";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/run", async (req, res) => {
  try {
    const { src, instructions, fewshot } = req.body;

    const task = getPrompt("mdFormatter");

    const prompt = buildPrompt({
      src,
      instructions,
      fewshot,
      task,
    });

    const result = await runGemini(prompt);

    res.json({ result });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Generation failed" });
  }
});

app.listen(3000, () => {
  console.log("API running on http://localhost:3000");
});