"use strict";

const vscode = require("vscode");
const snippets = require("./snippets/snippets.json");

const componentCategories = {
  Layout: ["Accordion", "Card", "Carousel", "Collapse", "Divider", "Drawer", "Footer", "Hero", "Join", "Stack"],
  Navigation: ["Breadcrumbs", "Dock", "Menu", "Navbar", "Pagination", "Steps", "Tabs", "Tree"],
  Forms: ["Checkbox", "Fieldset", "File Input", "Input", "Label", "Radio", "Range", "Rating", "Select", "Textarea", "Toggle", "Validator"],
  Feedback: ["Alert", "Loading", "Progress", "Radial Progress", "Skeleton", "Toast", "Tooltip"],
  Data: ["Avatar", "Badge", "Chat", "Countdown", "Diff", "Indicator", "Kbd", "List", "Stat", "Status", "Table", "Timeline"],
  Actions: ["Button", "Dropdown", "Mask", "Modal", "Swap", "Theme Controller"],
};

const starterPrefixes = new Set([
  "!d",
  "d-alert",
  "d-btn",
  "d-card",
  "d-dropdown",
  "d-input",
  "d-modal",
  "d-navbar",
  "d-table",
  "d-textarea",
]);

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("daisyuiSnippets.insertSnippet", async () => {
      const selected = await pickSnippet();
      if (selected) {
        await insertSnippetIntoActiveEditor(selected);
      }
    }),
    vscode.commands.registerCommand("daisyuiSnippets.insertSnippetByCategory", async () => {
      const category = await pickCategory();
      if (!category) {
        return;
      }
      const selected = await pickSnippet(category);
      if (selected) {
        await insertSnippetIntoActiveEditor(selected);
      }
    }),
    vscode.commands.registerCommand("daisyuiSnippets.previewSnippet", async () => {
      const selected = await pickSnippet();
      if (selected) {
        showSnippetPreview(context, selected);
      }
    }),
    vscode.languages.registerCompletionItemProvider(
      [{ language: "html", scheme: "file" }, { language: "html", scheme: "untitled" }],
      {
        provideCompletionItems(document, position) {
          const linePrefix = document.lineAt(position).text.slice(0, position.character);
          const tokenMatch = linePrefix.match(/[!A-Za-z0-9-]+$/);
          const token = tokenMatch ? tokenMatch[0] : "";
          const shouldSuggest = token === "d" || token.startsWith("d-") || token.startsWith("!");

          if (!shouldSuggest) {
            return undefined;
          }

          const range = tokenMatch
            ? new vscode.Range(position.line, position.character - token.length, position.line, position.character)
            : undefined;

          return snippetEntries.map((entry) => createCompletionItem(entry, range));
        },
      },
      "d",
      "!",
    ),
  );
}

function deactivate() {}

function findCategory(component) {
  for (const [category, components] of Object.entries(componentCategories)) {
    if (components.includes(component)) {
      return category;
    }
  }
  return "Other";
}

function inferTier(entry) {
  if (entry.prefixes.some((prefix) => starterPrefixes.has(prefix))) {
    return "Starter";
  }
  if (entry.variant === "Default") {
    return "Common";
  }
  return "Advanced";
}

const snippetEntries = Object.entries(snippets).map(([label, definition]) => {
  const [component, variant = "Default"] = label.split(": ");
  const prefixes = Array.isArray(definition.prefix) ? definition.prefix : [definition.prefix];
  const body = Array.isArray(definition.body) ? definition.body.join("\n") : String(definition.body);
  const category = findCategory(component);
  const tier = inferTier({ prefixes, variant });

  return {
    label,
    component,
    variant,
    prefixes,
    primaryPrefix: prefixes[0],
    aliases: prefixes.slice(1),
    description: definition.description,
    body,
    category,
    tier,
  };
});

function createCompletionItem(entry, range) {
  const item = new vscode.CompletionItem(entry.primaryPrefix, vscode.CompletionItemKind.Snippet);
  item.insertText = new vscode.SnippetString(entry.body);
  item.detail = `${entry.tier} • ${entry.category} • ${entry.label}`;
  item.documentation = new vscode.MarkdownString(
    [
      `**${entry.label}**`,
      "",
      `${entry.description}`,
      "",
      `Prefixes: \`${entry.prefixes.join("`, `")}\``,
      "",
      "```html",
      ...entry.body.split("\n"),
      "```",
    ].join("\n"),
  );
  item.filterText = [entry.primaryPrefix, ...entry.prefixes, entry.component, entry.variant, entry.category].join(" ");
  item.sortText = `${tierRank(entry.tier)}-${entry.component}-${entry.variant}-${entry.primaryPrefix}`;
  item.preselect = entry.tier === "Starter";
  item.range = range;
  item.keepWhitespace = true;
  item.insertTextRules = vscode.CompletionItemInsertTextRule.InsertAsSnippet;
  item.label = {
    label: entry.primaryPrefix,
    detail: entry.aliases.length ? ` (${entry.aliases.join(", ")})` : "",
    description: `${entry.component} • ${entry.variant}`,
  };
  return item;
}

function tierRank(tier) {
  switch (tier) {
    case "Starter":
      return "1";
    case "Common":
      return "2";
    default:
      return "3";
  }
}

async function pickCategory() {
  const categories = [...new Set(snippetEntries.map((entry) => entry.category))].sort();
  const selected = await vscode.window.showQuickPick(
    categories.map((category) => ({
      label: category,
      description: `${snippetEntries.filter((entry) => entry.category === category).length} snippets`,
    })),
    {
      title: "Browse DaisyUI Snippets by Category",
      placeHolder: "Choose a category",
    },
  );

  return selected ? selected.label : undefined;
}

async function pickSnippet(category) {
  const entries = snippetEntries
    .filter((entry) => !category || entry.category === category)
    .sort((left, right) => {
      const tierCompare = tierRank(left.tier).localeCompare(tierRank(right.tier));
      if (tierCompare !== 0) {
        return tierCompare;
      }
      const componentCompare = left.component.localeCompare(right.component);
      if (componentCompare !== 0) {
        return componentCompare;
      }
      return left.variant.localeCompare(right.variant);
    });

  const selected = await vscode.window.showQuickPick(
    entries.map((entry) => ({
      label: entry.label,
      description: `${entry.tier} • ${entry.category} • ${entry.prefixes.join(", ")}`,
      detail: entry.description,
      entry,
    })),
    {
      title: category ? `Choose DaisyUI Snippet: ${category}` : "Choose DaisyUI Snippet",
      matchOnDescription: true,
      matchOnDetail: true,
      placeHolder: category
        ? `Choose a ${category.toLowerCase()} snippet`
        : "Search by component, variant, prefix, or description",
    },
  );

  return selected ? selected.entry : undefined;
}

async function insertSnippetIntoActiveEditor(entry) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage("Open an HTML file before inserting a DaisyUI snippet.");
    return;
  }

  await editor.insertSnippet(new vscode.SnippetString(entry.body));
}

function showSnippetPreview(context, entry) {
  const panel = vscode.window.createWebviewPanel(
    "daisyuiSnippetPreview",
    `Preview ${entry.primaryPrefix}`,
    vscode.ViewColumn.Beside,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
    },
  );

  panel.webview.html = getPreviewHtml(panel.webview, entry);

  panel.webview.onDidReceiveMessage(
    async (message) => {
      if (message.type === "insert") {
        await insertSnippetIntoActiveEditor(entry);
        vscode.window.showInformationMessage(`Inserted ${entry.primaryPrefix}`);
      }

      if (message.type === "copyPrefix") {
        await vscode.env.clipboard.writeText(entry.primaryPrefix);
        vscode.window.showInformationMessage(`Copied ${entry.primaryPrefix}`);
      }
    },
    undefined,
    context.subscriptions,
  );
}

function getPreviewHtml(webview, entry) {
  const renderedSnippet = snippetToRenderableHtml(entry.body);
  const escapedCode = escapeHtml(entry.body);
  const nonce = String(Date.now());

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'none'; img-src ${webview.cspSource} https: data:; style-src ${webview.cspSource} 'unsafe-inline' https://cdn.jsdelivr.net; script-src 'unsafe-inline' https://cdn.jsdelivr.net 'nonce-${nonce}';"
    />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script nonce="${nonce}" src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <style>
      body {
        margin: 0;
        font-family: ui-sans-serif, system-ui, sans-serif;
        background: #f7f3eb;
        color: #2f241f;
      }

      .shell {
        display: grid;
        grid-template-columns: minmax(320px, 1fr) 420px;
        min-height: 100vh;
      }

      .preview-pane {
        padding: 24px;
        background: linear-gradient(180deg, #f8f5ee 0%, #efe7d7 100%);
      }

      .preview-card,
      .code-card {
        background: rgba(255, 255, 255, 0.72);
        border: 1px solid rgba(111, 89, 67, 0.14);
        border-radius: 20px;
        box-shadow: 0 16px 40px rgba(92, 74, 56, 0.12);
      }

      .preview-card {
        padding: 18px;
      }

      .meta {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin: 0 0 16px;
      }

      .chip {
        border-radius: 999px;
        background: #fff2bf;
        border: 1px solid #f2c45f;
        padding: 6px 10px;
        font-size: 12px;
        font-weight: 700;
      }

      .preview-frame {
        border-radius: 18px;
        padding: 24px;
        min-height: 320px;
        background: linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,248,237,0.92));
      }

      .side-pane {
        padding: 24px 24px 24px 0;
      }

      .side-stack {
        display: grid;
        gap: 16px;
        height: 100%;
      }

      .code-card {
        padding: 20px;
        overflow: auto;
      }

      pre {
        margin: 0;
        white-space: pre-wrap;
        word-break: break-word;
        font-size: 13px;
        line-height: 1.55;
        color: #3e312b;
      }

      .actions {
        display: flex;
        gap: 12px;
      }

      button {
        border: 0;
        border-radius: 12px;
        padding: 12px 16px;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
      }

      .primary {
        background: #7db55b;
        color: #10210a;
      }

      .secondary {
        background: #efe5d6;
        color: #5e4a3b;
      }

      h1 {
        margin: 0 0 8px;
        font-size: 28px;
      }

      p {
        margin: 0 0 12px;
        color: #5e4a3b;
      }
    </style>
  </head>
  <body>
    <div class="shell">
      <section class="preview-pane">
        <div class="meta">
          <span class="chip">${escapeHtml(entry.tier)}</span>
          <span class="chip">${escapeHtml(entry.category)}</span>
          <span class="chip">${escapeHtml(entry.primaryPrefix)}</span>
        </div>
        <div class="preview-card">
          <h1>${escapeHtml(entry.label)}</h1>
          <p>${escapeHtml(entry.description)}</p>
          <div class="preview-frame">
            ${renderedSnippet}
          </div>
        </div>
      </section>
      <aside class="side-pane">
        <div class="side-stack">
          <div class="code-card">
            <p><strong>Prefixes</strong></p>
            <p>${escapeHtml(entry.prefixes.join(", "))}</p>
            <pre><code>${escapedCode}</code></pre>
          </div>
          <div class="code-card">
            <p><strong>Actions</strong></p>
            <div class="actions">
              <button class="primary" id="insert-button">Insert into editor</button>
              <button class="secondary" id="copy-button">Copy prefix</button>
            </div>
          </div>
        </div>
      </aside>
    </div>
    <script nonce="${nonce}">
      const vscode = acquireVsCodeApi();
      document.getElementById("insert-button").addEventListener("click", () => {
        vscode.postMessage({ type: "insert" });
      });
      document.getElementById("copy-button").addEventListener("click", () => {
        vscode.postMessage({ type: "copyPrefix" });
      });
    </script>
  </body>
</html>`;
}

function snippetToRenderableHtml(snippetBody) {
  return snippetBody
    .replace(/\$\{(\d+):([^}]+)\}/g, "$2")
    .replace(/\$\{(\d+)\}/g, "")
    .replace(/\$0/g, "");
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

module.exports = {
  activate,
  deactivate,
};
