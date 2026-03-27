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

const snippetEntries = Object.entries(snippets).map(([label, definition]) => {
  const [component, variant = "Default"] = label.split(": ");
  const prefixes = Array.isArray(definition.prefix) ? definition.prefix : [definition.prefix];
  return {
    label,
    component,
    variant,
    prefixes,
    description: definition.description,
    body: Array.isArray(definition.body) ? definition.body.join("\n") : String(definition.body),
    category: findCategory(component),
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

async function pickAndInsertSnippet(category) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage("Open an HTML file before inserting a DaisyUI snippet.");
    return;
  }

  const entries = snippetEntries
    .filter((entry) => !category || entry.category === category)
    .sort((left, right) => {
      const categoryCompare = left.category.localeCompare(right.category);
      if (categoryCompare !== 0) {
        return categoryCompare;
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
      description: `${entry.category} • ${entry.prefixes.join(", ")}`,
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
