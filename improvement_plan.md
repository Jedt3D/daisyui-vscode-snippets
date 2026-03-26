# DaisyUI VS Code Snippets Improvement Plan

## Summary

This plan upgrades the extension from a broad but fragile snippet pack into a trustworthy, maintainable, release-ready VS Code product for HTML users. The work proceeds in phased cycles, starting with snippet correctness and UX quality, then moving into maintainability, release discipline, and optional smarter extension behavior later.

Key defaults:

- maintain snippet content via generated output from structured source data
- use `feature branch -> PR -> squash merge` for each cycle
- commit `.vsix` artifacts only for milestone or release commits

## Phase 0: Baseline and Product Rules

Goal: establish the operating rules before changing product behavior.

TODO:

- treat `main` as release-quality only
- keep the extension HTML-only for `0.x`
- define the product promise as valid HTML snippets, practical DaisyUI defaults, fast prefixes, and editable placeholders
- remove or rewrite documentation claims that are not implemented
- keep release quality gates explicit:
  - valid or intentionally minimal markup
  - placeholders and tab stops where editing is expected
  - docs that match the actual product
  - installable packaged extension

## Phase 1: Trust Reset and Golden Set

Goal: make the extension trustworthy by fixing the highest-value user experience first.

Golden set:

- button
- card
- alert
- badge
- navbar
- modal
- dropdown
- input
- textarea
- table

TODO:

- rewrite the golden set with valid HTML
- replace documentation-style pasted examples with editor-friendly snippets
- add placeholders and final cursor stops
- define a consistent prefix taxonomy
- standardize descriptions
- confirm snippets are practical for plain HTML work

## Phase 2: Structured Source and Generation Pipeline

Goal: stop treating `snippets.json` as hand-maintained source and make large-scale change safe.

TODO:

- keep structured snippet definitions in `src/snippet-catalog.mjs`
- generate `snippets/snippets.json` deterministically
- validate:
  - prefix uniqueness
  - non-empty descriptions
  - placeholder presence
  - basic HTML tag structure
- migrate the golden set first, then the rest of the library

## Phase 3: Library-Wide Migration and UX Consistency

Goal: apply the new standards across the shipped DaisyUI component library.

TODO:

- maintain one curated default snippet for every component family
- keep focused variants only for high-value components
- normalize naming, prefix style, descriptions, and placeholder behavior
- keep the library intentionally curated rather than mechanically scraped

## Phase 4: Release Hardening and Marketplace Polish

Goal: make the repo and release workflow feel professional.

TODO:

- modernize `package.json`
- move packaging tools into dev-tool usage
- keep `.vscodeignore` and package contents clean
- refresh README, CHANGELOG, WARP, and quickstart docs
- build and verify the `.vsix`

## Phase 5: Optional Smart Features

Goal: consider smarter behavior only after the snippet product is stable.

Possible later work:

- command-palette insertion helpers
- completion-provider enhancements
- better grouping or filtering of variants

Non-goals for now:

- MCP integration
- LSP diagnostics
- framework-specific markup support

## Git and Release Workflow

Branching:

- use one short-lived feature branch per milestone
- never develop directly on `main`
- keep branches scoped to one deliverable

Commit style:

- `feat:`
- `fix:`
- `chore:`
- `docs:`
- `refactor:`
- `test:`

PR checklist:

- objective
- what changed
- how to test
- release impact

Merge and release:

- squash merge to `main`
- bump version for strong user-facing phases
- update docs
- build `.vsix`
- commit the artifact for release commits only
- tag the release
