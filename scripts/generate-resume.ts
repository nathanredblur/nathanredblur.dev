import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderToFile } from "@react-pdf/renderer";
import React from "react";
import { AtsFriendly } from "@/resume/templates/AtsFriendly";
import { Classic } from "@/resume/templates/Classic";
import { Modern } from "@/resume/templates/Modern";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const outDir = path.join(repoRoot, "public", "resume");

const templates = [
  {
    name: "Jonathan_Rico_CV_Classic.pdf",
    element: React.createElement(Classic),
  },
  { name: "Jonathan_Rico_CV_Modern.pdf", element: React.createElement(Modern) },
  {
    name: "Jonathan_Rico_CV_ATS.pdf",
    element: React.createElement(AtsFriendly),
  },
] as const;

const run = async () => {
  await fs.mkdir(outDir, { recursive: true });

  for (const t of templates) {
    const outPath = path.join(outDir, t.name);
    console.log(`Rendering ${t.name}...`);
    await renderToFile(t.element, outPath);
    const stat = await fs.stat(outPath);
    console.log(`  → ${outPath} (${(stat.size / 1024).toFixed(1)} KB)`);
  }

  console.log(`Done. Wrote ${templates.length} PDFs to ${outDir}`);
};

run().catch((err) => {
  console.error("Resume generation failed:", err);
  process.exit(1);
});
