# Development Quickstart

## Repo Layout

- `src/snippet-catalog.mjs`: snippet source of truth
- `scripts/generate-snippets.mjs`: builds the generated snippet file
- `scripts/validate-snippets.mjs`: validates the catalog and generated output
- `snippets/snippets.json`: generated VS Code snippet payload
- `extension.js`: command-palette entry point for searchable insertion and category browsing

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
