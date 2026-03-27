# Changelog

All notable changes to the `daisyui-vscode-snippets` extension are documented in this file.

## [1.0.1] - 2026-03-27

- added fixture-based upgrade regression tests for buttons, form controls, card wrapping, and theme switching
- extracted snippet ranking and picker-order logic into reusable state utilities with automated coverage
- strengthened the release gate with a packaged `.vsix` smoke check for required runtime files

## [1.0.0] - 2026-03-27

- stabilized the extension around a clear HTML-first DaisyUI workflow: insert, preview, refine, and upgrade
- extracted HTML upgrade logic into a reusable helper module and added automated coverage for core transforms
- tightened the local release gate so packaging now runs after generated snippet validation and helper tests

## [0.9.0] - 2026-03-27

- added `DaisyUI: Upgrade Selected HTML` to inspect highlighted markup and apply DaisyUI-friendly upgrades in place
- added safe upgrade actions for buttons, inputs, textareas, selects, tables, and generic content blocks
- pushed the extension from insertion/refinement into the first real “edit existing HTML” workflow

## [0.8.0] - 2026-03-27

- added `DaisyUI: Preview Preset` for rendered page-preset review before insertion
- added `DaisyUI: Switch Theme in Document` to retheme the active HTML document quickly
- added `DaisyUI: Insert Section Pattern` for hero, card grid, stats row, and CTA section transformations

## [0.7.0] - 2026-03-27

- added theme-aware starter variants including `!d-dark` and `!d-corporate`
- added `DaisyUI: Insert Preset` with curated landing page, dashboard, and auth screen scaffolds
- expanded the extension from component insertion into multi-section page composition from a single command

## [0.6.0] - 2026-03-27

- added recent snippet memory so frequently used items resurface faster across sessions
- added favorite snippets with command-palette support and preview-panel toggling
- upgraded completions and picker flows to rank favorites and recents ahead of the broader catalog

## [0.5.0] - 2026-03-27

- added `DaisyUI: Preview Snippet`, a webview-based preview panel that renders the selected snippet before insertion
- added insert and copy-prefix actions directly inside the preview panel
- extended the extension from ranked completions into a more product-like preview and insertion workflow

## [0.4.0] - 2026-03-27

- replaced passive static snippet suggestions with an HTML completion provider backed by the generated snippet catalog
- added richer completion labels, snippet previews, and starter/common/advanced ranking in the suggestion list
- kept command-palette insertion while improving in-editor discoverability and reducing noisy duplicate suggestions

## [0.3.0] - 2026-03-27

- added `DaisyUI: Insert Snippet`, a command palette flow for searching and inserting snippets by name, prefix, or description
- added `DaisyUI: Browse Snippets by Category` for quicker discovery across layout, forms, feedback, navigation, data, and action components
- promoted discoverability from static snippets to a lightweight command-driven extension experience

## [0.2.4] - 2026-03-27

- refreshed the Marketplace asset pack with a colored-pencil version of the mascot icon
- added a branded banner, updated screenshots, and a short demo GIF
- added a reproducible asset generator for future Marketplace visual updates

## [0.2.3] - 2026-03-27

- changed the Marketplace display name to `DaisyUI HTML Snippets` to avoid a naming conflict during publish

## [0.2.2] - 2026-03-27

- added a tag-driven GitHub release workflow that packages and uploads the `.vsix`
- added explicit pre-publish and Marketplace publish commands
- tightened the release runbook for tags, GitHub releases, and Marketplace publishing

## [0.2.1] - 2026-03-27

- added GitHub Actions CI to generate, validate, and package the extension on each push and pull request
- added `.npmignore` to keep npm tarballs focused on release-facing files
- added `release:check` as the full local release gate

## [0.2.0] - 2026-03-27

- promoted a second wave of common components into curated multi-variant snippets
- added stronger variants for accordion, avatar, checkbox, footer, hero, menu, select, tabs, toast, and toggle
- improved library-wide UX consistency while keeping the snippet set intentionally curated

## [0.1.1] - 2026-03-27

- added the `!d` starter snippet for a full HTML document with DaisyUI and Tailwind browser CDN tags

## [0.1.0] - 2026-03-27

- rebuilt the snippet library from a generated source catalog
- replaced fragile pasted examples with curated, valid HTML snippet templates
- standardized prefixes and added aliases for high-use components
- added placeholders and final cursor stops across the shipped library
- modernized package metadata, build scripts, validation, and release workflow
- refreshed project documentation and contributor guidance

## [0.0.3] - 2025-08-30

- excluded `node_modules` from the packaged extension
- updated the version to `0.0.3`

## [0.0.1]

- initial Marketplace release
