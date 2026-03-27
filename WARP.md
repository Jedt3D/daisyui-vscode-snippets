# WARP.md

This file documents the working conventions for this repository.

## Product Summary

This repository contains a VS Code snippet extension for DaisyUI HTML component scaffolding.

The stabilized product promise is:

- insert
- preview
- refine
- upgrade

Current product goals:

- HTML-only scope
- curated snippet UX
- command-palette discovery
- richer in-editor completions
- preview before insert
- favorites and recents memory
- preset-based page composition
- post-insert refinement actions
- selected-html upgrade actions
- preview-first selected-html upgrades
- generated snippet output
- release-ready packaging and docs

## Architecture

- `src/snippet-catalog.mjs`
  - source of truth for the snippet library
  - stores curated snippet definitions with prefixes, descriptions, and snippet bodies
- `src/html-upgrade-utils.js`
  - reusable HTML transformation helpers for the upgrade workflow
- `src/extension-state-utils.js`
  - reusable state and ordering helpers for favorites, recents, pickers, and completion ranking
- `scripts/generate-snippets.mjs`
  - generates `snippets/snippets.json`
- `scripts/validate-snippets.mjs`
  - validates prefix uniqueness, descriptions, placeholders, and basic HTML structure
- `scripts/test-extension-helpers.js`
  - verifies the core HTML upgrade helpers
- `scripts/test-extension-state-utils.js`
  - verifies favorites, recents, picker ordering, and completion ranking logic
- `scripts/test-upgrade-fixtures.js`
  - runs fixture-based before/after checks for HTML upgrade flows
- `scripts/check-vsix-contents.js`
  - confirms the packaged extension includes required runtime files
- `snippets/snippets.json`
  - generated output consumed by the VS Code extension manifest
- `extension.js`
  - command-palette entry point, HTML completion provider, preview webview, and favorites/recents state
  - also powers the preview-first HTML upgrade review flow
- `package.json`
  - extension metadata plus build/package scripts

## Working Rules

- Do not edit `snippets/snippets.json` by hand.
- Update `src/snippet-catalog.mjs`, then regenerate and validate.
- Keep the extension HTML-only unless the product direction changes explicitly.
- Treat `main` as release-quality.
- Use feature branches and squash-merged PRs for milestone work.

## Core Commands

```bash
npm install
npm run generate
npm run validate
npm run test
npm run package:vsix
npm run test:smoke
npm run release:check
npm run publish:precheck
```

## Release Checklist

1. Run `npm run release:check`.
2. Verify the `.vsix` installs in VS Code.
3. Update `README.md`, `CHANGELOG.md`, and other relevant docs.
4. Commit the `.vsix` only for milestone or release commits.
5. Tag the release from `main`.

## Publishing Notes

- Use `npm run publish:precheck` before any Marketplace publish.
- Use `npm run publish:vsce` only after authenticating with `npx @vscode/vsce login sjedt`.
- Pushing a `v*` tag triggers the GitHub release workflow and uploads the `.vsix` artifact automatically.
