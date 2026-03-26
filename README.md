# DaisyUI Snippets for VS Code

Curated DaisyUI HTML snippets for Visual Studio Code with predictable prefixes, valid markup, and editable placeholders.

## What Changed in `0.1.0`

- Rebuilt the library around a generated snippet catalog.
- Replaced brittle documentation-paste snippets with valid HTML templates.
- Standardized the prefix system with faster, more predictable names.
- Added placeholders and final cursor stops across the full shipped library.
- Narrowed the product promise to HTML users only for a cleaner v1 surface.

## Snippet UX

The extension now ships with:

- A golden set of hand-tuned snippets for the most-used components such as alerts, badges, buttons, cards, dropdowns, inputs, modals, navbars, tables, and textareas.
- One curated default snippet for every remaining DaisyUI component family so coverage stays broad without shipping hundreds of noisy variants.
- Predictable prefixes such as `d-alert`, `d-card`, `d-dropdown`, `d-navbar`, `d-table`, and `d-textarea`.
- Helpful aliases where they are natural, such as `d-btn` for the button snippet.

Every snippet is designed for plain HTML workflows:

- valid markup
- practical DaisyUI classes
- editable placeholders
- a useful final cursor position

## Example Prefixes

- `d-alert`
- `d-alert-info`
- `d-badge-outline`
- `d-button` or `d-btn`
- `d-card-image`
- `d-dropdown-end`
- `d-input`
- `d-modal`
- `d-navbar`
- `d-table-zebra`
- `d-textarea`

## Installation

Install from the VS Code Marketplace:

- [DaisyUI Snippets on the VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=sjedt.daisyui-vscode-snippets)

Or install the packaged release artifact:

1. Download `bin/daisyui-vscode-snippets.vsix` from the matching release commit or release page.
2. Open the Command Palette in VS Code.
3. Run `Extensions: Install from VSIX...`
4. Select the `.vsix` file.

## Development Workflow

The extension is now driven by a generated source catalog.

Source of truth:

- [`src/snippet-catalog.mjs`](./src/snippet-catalog.mjs)

Generated output:

- [`snippets/snippets.json`](./snippets/snippets.json)

Core commands:

```bash
npm install
npm run generate
npm run validate
npm run package:vsix
```

## Git and Release Cycle

Recommended workflow for each improvement cycle:

1. Create a feature branch from `main`, for example `codex/phase-1-foundation`.
2. Make small, focused commits with conventional commit prefixes.
3. Open a PR with:
   - objective
   - what changed
   - how to test
   - release impact
4. Squash merge into `main`.
5. For strong user-facing milestones:
   - bump the version
   - update Markdown docs
   - build `bin/daisyui-vscode-snippets.vsix`
   - tag the release

The full roadmap lives in [`improvement_plan.md`](./improvement_plan.md).

## Scope

This extension intentionally focuses on:

- HTML users
- DaisyUI component scaffolding
- curated static snippets

It does not currently target:

- JavaScript framework-specific markup
- MCP integration
- LSP-based diagnostics

## License

Released under the Apache License, Version 2.0.
