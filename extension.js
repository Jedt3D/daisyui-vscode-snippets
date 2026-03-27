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

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("daisyuiSnippets.insertSnippet", async () => {
      await pickAndInsertSnippet();
    }),
    vscode.commands.registerCommand("daisyuiSnippets.insertSnippetByCategory", async () => {
      await pickCategoryAndInsertSnippet();
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

async function pickAndInsertSnippet(category) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage("Open an HTML file before inserting a DaisyUI snippet.");
    return;
  }

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
      title: category ? `Insert DaisyUI Snippet: ${category}` : "Insert DaisyUI Snippet",
      matchOnDescription: true,
      matchOnDetail: true,
      placeHolder: category
        ? `Choose a ${category.toLowerCase()} snippet`
        : "Search by component, variant, prefix, or description",
    },
  );

  if (!selected) {
    return;
  }

  await editor.insertSnippet(new vscode.SnippetString(selected.entry.body));
}

async function pickCategoryAndInsertSnippet() {
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

  if (!selected) {
    return;
  }

  await pickAndInsertSnippet(selected.label);
}

module.exports = {
  activate,
  deactivate,
};
