"use strict";

const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const path = require("node:path");

const vsixPath = path.join(__dirname, "..", "bin", "daisyui-vscode-snippets.vsix");
const listing = execFileSync("unzip", ["-l", vsixPath], { encoding: "utf8" });

const requiredEntries = [
  "extension/extension.js",
  "extension/snippets/snippets.json",
  "extension/src/html-upgrade-utils.js",
  "extension/src/extension-state-utils.js",
];

for (const requiredEntry of requiredEntries) {
  assert.ok(
    listing.includes(requiredEntry),
    `Packaged extension is missing required runtime file: ${requiredEntry}`,
  );
}

console.log("VSIX smoke check passed.");
