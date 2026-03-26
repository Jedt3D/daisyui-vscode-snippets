# PR Title

Release 0.2.2: rebuild DaisyUI snippets and harden publishing workflow

# PR Body

## Summary

- Rebuilt the extension around a generated snippet catalog.
- Replaced broken example-copy snippets with valid HTML templates and placeholders.
- Added curated high-value variants and the `!d` HTML starter.
- Hardened packaging, CI, release automation, and Marketplace publish workflow.

## Release Impact

- `minor`

## What Changed

- introduced `src/snippet-catalog.mjs` as the source of truth
- generated `snippets/snippets.json` from the catalog
- added validation for prefix uniqueness, descriptions, placeholders, and HTML structure
- added curated snippets and variants for common DaisyUI component families
- added `!d` for an HTML starter with DaisyUI and Tailwind browser CDN tags
- added CI and tag-driven GitHub release workflows
- added release and publishing runbooks

## How To Test

- [ ] `npm install`
- [ ] `npm run publish:precheck`
- [ ] `code --install-extension bin/daisyui-vscode-snippets.vsix --force`
- [ ] verify VS Code reports `sjedt.daisyui-vscode-snippets@0.2.2`
- [ ] smoke-test:
  - [ ] `!d`
  - [ ] `d-alert`
  - [ ] `d-btn`
  - [ ] `d-card-image`
  - [ ] `d-dropdown`
  - [ ] `d-modal`
  - [ ] `d-navbar`
  - [ ] `d-table-zebra`
  - [ ] `d-tabs-lifted`

## Notes

- Scope remains HTML-only.
- MCP, LSP, and framework-specific snippets remain intentionally out of scope.
