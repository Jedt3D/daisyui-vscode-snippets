# Changelog

All notable changes to the `daisyui-vscode-snippets` extension are documented in this file.

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
