# DaisyUI Snippets for VS Code

Curated DaisyUI HTML snippets for Visual Studio Code with predictable prefixes, valid markup, and editable placeholders.

## What Changed in `0.2.2`

- Added a tag-driven GitHub release workflow that packages and attaches the `.vsix` artifact automatically.
- Added explicit Marketplace publishing commands and a local pre-publish gate.
- Tightened the release runbook so GitHub release and Marketplace publish steps are repeatable.

## What Changed in `0.2.1`

- Added GitHub Actions CI to generate, validate, and package the extension on every push and pull request.
- Added `.npmignore` so npm tarballs stay focused on release-facing files instead of repo internals.
- Added a `release:check` script for the full local release gate.

## What Changed in `0.2.0`

- Promoted a second wave of common components into curated multi-variant snippets.
- Added stronger variants for accordion, avatar, checkbox, footer, hero, menu, select, tabs, toast, and toggle.
- Improved library-wide UX consistency without reintroducing noisy snippet sprawl.

## What Changed in `0.1.1`

- Added `!d`, an HTML starter snippet that includes the current DaisyUI and Tailwind browser CDN setup.

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
- `!d`
- `d-alert-info`
- `d-accordion-plus`
- `d-avatar-group`
- `d-badge-outline`
- `d-button` or `d-btn`
- `d-card-image`
- `d-checkbox-primary`
- `d-dropdown-end`
- `d-footer-centered`
- `d-hero-split`
- `d-input`
- `d-menu-horizontal`
- `d-modal`
- `d-navbar`
- `d-select-ghost`
- `d-table-zebra`
- `d-tabs-lifted`
- `d-textarea`
- `d-toast-success`
- `d-toggle-primary`

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
npm run release:check
npm run publish:precheck
```

## Release Checklist

Use this flow before a Marketplace publish or release tag:

1. Run `npm run release:check`.
2. Install `bin/daisyui-vscode-snippets.vsix` locally with:
   `code --install-extension bin/daisyui-vscode-snippets.vsix --force`
3. Confirm the installed version matches `package.json`.
4. Smoke-test key prefixes in an HTML file:
   - `!d`
   - `d-alert`
   - `d-btn`
   - `d-card-image`
   - `d-dropdown`
   - `d-modal`
   - `d-navbar`
   - `d-table-zebra`
5. Update the changelog and release notes.
6. Tag from `main` after the PR is merged.

## Publishing

Local Marketplace publish flow:

```bash
npm run publish:precheck
npx @vscode/vsce login sjedt
npm run publish:vsce
```

GitHub release flow:

1. Merge the release branch into `main`.
2. Create and push a tag such as `v0.2.2`.
3. Let the `Release` GitHub Actions workflow build and attach `bin/daisyui-vscode-snippets.vsix`.

Example:

```bash
git checkout main
git pull --ff-only
git tag v0.2.2
git push origin v0.2.2
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
The release operations playbook lives in [`RELEASING.md`](./RELEASING.md).

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
