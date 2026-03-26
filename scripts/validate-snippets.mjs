import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { snippetCatalog } from "../src/snippet-catalog.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const snippetPath = path.resolve(__dirname, "../snippets/snippets.json");

const voidTags = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);

const normalize = (value) =>
  value
    .replace(/\$\{\d+:([^}]+)\}/g, "$1")
    .replace(/\$\d+/g, "")
    .replace(/\\\$/g, "$");

const validateHtmlStructure = (body, name) => {
  const stack = [];
  const source = normalize(body.join("\n"));
  const tags = source.match(/<\/?[a-zA-Z][^>]*>/g) ?? [];

  for (const token of tags) {
    if (token.startsWith("</")) {
      const tagName = token.slice(2, -1).trim().toLowerCase();
      const expected = stack.pop();
      if (expected !== tagName) {
        throw new Error(`${name}: mismatched closing tag </${tagName}>; expected </${expected ?? "none"}>.`);
      }
      continue;
    }

    if (token.startsWith("<!--") || token.endsWith("/>")) {
      continue;
    }

    const tagName = token
      .slice(1, -1)
      .trim()
      .split(/\s+/, 1)[0]
      .toLowerCase();

    if (!voidTags.has(tagName)) {
      stack.push(tagName);
    }
  }

  if (stack.length > 0) {
    throw new Error(`${name}: unclosed tags remain (${stack.join(", ")}).`);
  }
};

const seenPrefixes = new Map();

for (const entry of snippetCatalog) {
  if (!entry.description?.trim()) {
    throw new Error(`${entry.component}: ${entry.variant} is missing a description.`);
  }

  if (!entry.body.some((line) => line.includes("$0"))) {
    throw new Error(`${entry.component}: ${entry.variant} is missing a final cursor stop ($0).`);
  }

  if (!entry.body.join("\n").includes("${1:")) {
    throw new Error(`${entry.component}: ${entry.variant} is missing a primary placeholder.`);
  }

  for (const prefix of entry.prefixes) {
    if (seenPrefixes.has(prefix)) {
      throw new Error(`Duplicate prefix "${prefix}" used by ${seenPrefixes.get(prefix)} and ${entry.component}: ${entry.variant}.`);
    }
    seenPrefixes.set(prefix, `${entry.component}: ${entry.variant}`);
  }

  validateHtmlStructure(entry.body, `${entry.component}: ${entry.variant}`);
}

const generated = JSON.parse(await readFile(snippetPath, "utf8"));

if (Object.keys(generated).length !== snippetCatalog.length) {
  throw new Error(`Generated snippet count (${Object.keys(generated).length}) does not match catalog count (${snippetCatalog.length}).`);
}

console.log(`Validated ${snippetCatalog.length} snippets with ${seenPrefixes.size} unique prefixes.`);
