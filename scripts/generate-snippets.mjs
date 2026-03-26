import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { snippetCatalog } from "../src/snippet-catalog.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.resolve(__dirname, "../snippets");
const outputPath = path.join(outputDir, "snippets.json");

const snippets = Object.fromEntries(
  snippetCatalog.map((entry) => [
    `${entry.component}: ${entry.variant}`,
    {
      prefix: entry.prefixes.length === 1 ? entry.prefixes[0] : entry.prefixes,
      body: entry.body.map((line) => line.replace(/\\\$\{/g, "${")),
      description: `DaisyUI ${entry.component}: ${entry.description}`,
    },
  ]),
);

await mkdir(outputDir, { recursive: true });
await writeFile(outputPath, `${JSON.stringify(snippets, null, 2)}\n`);

console.log(`Generated ${Object.keys(snippets).length} snippets at ${outputPath}`);
