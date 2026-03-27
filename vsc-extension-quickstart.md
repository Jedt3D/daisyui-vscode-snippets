# Development Quickstart

## Repo Layout

- `src/snippet-catalog.mjs`: snippet source of truth
- `scripts/generate-snippets.mjs`: builds the generated snippet file
- `scripts/validate-snippets.mjs`: validates the catalog and generated output
- `snippets/snippets.json`: generated VS Code snippet payload
- `extension.js`: command-palette entry point for searchable insertion and category browsing
  - also provides ranked HTML completions for `d-` and `!`
  - also powers the preview webview workflow
  - also persists favorite and recent snippet memory in VS Code state
  - also provides preset page insertion for common full-page layouts
  - also provides theme switching and section-pattern refinement commands
  - also upgrades selected HTML into DaisyUI-friendly markup

## Local Workflow

1. Install dependencies:

```bash
npm install
```

2. Regenerate snippets after changing the catalog:

```bash
npm run generate
```

3. Validate the catalog and output:

```bash
npm run validate
```

4. Package the release artifact:

```bash
npm run package:vsix
```

## Manual Testing

1. Open the repo in VS Code.
2. Press `F5` to launch an Extension Development Host.
3. Create an HTML file.
4. Type prefixes such as `d-alert`, `d-card`, or `d-textarea`.
5. Confirm placeholders tab in a sensible order and the resulting HTML is valid.
6. Open the Command Palette and run `DaisyUI: Insert Snippet`.
7. Open the Command Palette and run `DaisyUI: Browse Snippets by Category`.
8. In an HTML file, type `d-` or `!` and confirm the richer completion entries appear with preview details.
9. Run `DaisyUI: Preview Snippet` and confirm the rendered panel can insert the selected snippet into the editor.
10. Mark a snippet as favorite, insert a few snippets, then verify `Insert Favorite Snippet` and `Insert Recent Snippet` show the expected memory.
11. Run `DaisyUI: Insert Preset` and confirm the landing, dashboard, and auth presets insert full-page scaffolds.
12. Run `DaisyUI: Preview Preset`, `DaisyUI: Switch Theme in Document`, and `DaisyUI: Insert Section Pattern` to validate the refinement workflow.
13. Select existing HTML and run `DaisyUI: Upgrade Selected HTML` to verify in-place upgrades apply cleanly.
