# Merge Checklist for v0.2.2

## Before Merge

- [ ] branch is `codex/phase-7-release-handoff`
- [ ] working tree is clean
- [ ] `npm run publish:precheck` passed
- [ ] local install reports `sjedt.daisyui-vscode-snippets@0.2.2`
- [ ] PR body uses `release-notes/pr-v0.2.2.md`

## Merge

- [ ] open PR from `codex/phase-7-release-handoff` to `main`
- [ ] squash merge in GitHub
- [ ] pull latest `main` locally

## Tag and Release

- [ ] `git checkout main`
- [ ] `git pull --ff-only origin main`
- [ ] `git tag v0.2.2`
- [ ] `git push origin v0.2.2`
- [ ] confirm GitHub Actions created the release and attached the `.vsix`

## Marketplace Publish

- [ ] `npx @vscode/vsce login sjedt`
- [ ] `npm install`
- [ ] `npm run publish:precheck`
- [ ] `npm run publish:vsce`
- [ ] verify Marketplace shows `0.2.2`
