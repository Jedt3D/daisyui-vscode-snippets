"use strict";

const vscode = require("vscode");
const snippets = require("./snippets/snippets.json");
const {
  getSelectionUpgrades,
  switchThemeInHtmlTag,
} = require("./src/html-upgrade-utils.js");

const FAVORITES_KEY = "daisyuiSnippets.favorites";
const RECENTS_KEY = "daisyuiSnippets.recents";
const MAX_RECENTS = 10;

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
  "!d-dark",
  "!d-corporate",
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

let extensionContext;
let snippetPreviewPanel;
let presetPreviewPanel;

const supportedThemes = ["light", "dark", "corporate", "emerald", "lofi", "synthwave"];

function activate(context) {
  extensionContext = context;

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
        showSnippetPreview(selected);
      }
    }),
    vscode.commands.registerCommand("daisyuiSnippets.insertRecentSnippet", async () => {
      const selected = await pickSnippet(undefined, "recent");
      if (selected) {
        await insertSnippetIntoActiveEditor(selected);
      }
    }),
    vscode.commands.registerCommand("daisyuiSnippets.insertFavoriteSnippet", async () => {
      const selected = await pickSnippet(undefined, "favorite");
      if (selected) {
        await insertSnippetIntoActiveEditor(selected);
      }
    }),
    vscode.commands.registerCommand("daisyuiSnippets.toggleFavoriteSnippet", async () => {
      const selected = await pickSnippet();
      if (selected) {
        await toggleFavorite(selected.primaryPrefix);
      }
    }),
    vscode.commands.registerCommand("daisyuiSnippets.insertPreset", async () => {
      const preset = await pickPreset();
      if (!preset) {
        return;
      }
      await insertPresetIntoActiveEditor(preset);
    }),
    vscode.commands.registerCommand("daisyuiSnippets.previewPreset", async () => {
      const preset = await pickPreset();
      if (preset) {
        showPresetPreview(preset);
      }
    }),
    vscode.commands.registerCommand("daisyuiSnippets.switchTheme", async () => {
      await switchThemeInDocument();
    }),
    vscode.commands.registerCommand("daisyuiSnippets.insertSectionPattern", async () => {
      const pattern = await pickSectionPattern();
      if (pattern) {
        await insertSectionPatternIntoEditor(pattern);
      }
    }),
    vscode.commands.registerCommand("daisyuiSnippets.upgradeSelection", async () => {
      await upgradeSelectedHtml();
    }),
    vscode.commands.registerCommand("daisyuiSnippets._trackRecentInternal", async (prefix) => {
      await trackRecent(prefix);
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

function getFavorites() {
  return extensionContext.globalState.get(FAVORITES_KEY, []);
}

function buildDocumentShell({ theme, title, bodyClass = "min-h-screen bg-base-200", bodyContent }) {
  return String.raw`<!doctype html>
<html lang="en" data-theme="${theme}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <link href="https://cdn.jsdelivr.net/npm/daisyui@5" rel="stylesheet" type="text/css" />
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
</head>
<body class="${bodyClass}">
${bodyContent}
</body>
</html>
$0`;
}

const presets = [
  {
    key: "landing",
    label: "Landing Page",
    description: "Hero, feature cards, and CTA sections for a marketing page.",
    detail: "Best for product launches, portfolio fronts, and polished one-page demos.",
    body: buildDocumentShell({
      theme: "${1:light}",
      title: "${2:Launch faster with DaisyUI}",
      bodyContent: String.raw`  <header class="navbar mx-auto max-w-6xl px-6 py-4">
    <div class="flex-1">
      <a href="\${3:#}" class="btn btn-ghost text-xl">\${4:Acme UI}</a>
    </div>
    <div class="flex gap-2">
      <a href="\${5:#features}" class="btn btn-ghost">\${6:Features}</a>
      <a href="\${7:#pricing}" class="btn btn-ghost">\${8:Pricing}</a>
      <a href="\${9:#contact}" class="btn btn-primary">\${10:Get started}</a>
    </div>
  </header>
  <main class="mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-16 pt-8">
    <section class="hero rounded-box bg-base-100 shadow-xl">
      <div class="hero-content flex-col gap-10 py-12 lg:flex-row-reverse">
        <img src="\${11:https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80}" alt="\${12:Product preview}" class="max-w-sm rounded-2xl shadow-2xl" />
        <div>
          <span class="badge badge-primary badge-outline mb-4">\${13:Now shipping}</span>
          <h1 class="text-5xl font-bold text-balance">\${14:Design polished HTML experiences in minutes}</h1>
          <p class="py-6 text-lg text-base-content/75">\${15:Use DaisyUI components and Tailwind utilities to build a strong landing page without framework setup.}</p>
          <div class="flex flex-col gap-3 sm:flex-row">
            <button type="button" class="btn btn-primary btn-lg">\${16:Start free}</button>
            <button type="button" class="btn btn-outline btn-lg">\${17:View components}</button>
          </div>
        </div>
      </div>
    </section>
    <section id="features" class="grid gap-6 md:grid-cols-3">
      <article class="card bg-base-100 shadow-sm">
        <div class="card-body">
          <h2 class="card-title">\${18:Faster prototyping}</h2>
          <p>\${19:Start from thoughtful component defaults instead of blank HTML.}</p>
        </div>
      </article>
      <article class="card bg-base-100 shadow-sm">
        <div class="card-body">
          <h2 class="card-title">\${20:Better snippet UX}</h2>
          <p>\${21:Use ranked suggestions, previews, favorites, and recents to move quickly.}</p>
        </div>
      </article>
      <article class="card bg-base-100 shadow-sm">
        <div class="card-body">
          <h2 class="card-title">\${22:Easy theming}</h2>
          <p>\${23:Swap DaisyUI themes without rewriting your page structure.}</p>
        </div>
      </article>
    </section>
    <section id="pricing" class="rounded-box bg-primary p-10 text-primary-content shadow-xl">
      <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-sm uppercase tracking-[0.2em]">\${24:Ready to launch}</p>
          <h2 class="text-3xl font-bold">\${25:Ship your next page with less setup}</h2>
        </div>
        <button type="button" class="btn btn-neutral btn-lg">\${26:Claim your starter}</button>
      </div>
    </section>`,
    }),
  },
  {
    key: "dashboard",
    label: "Dashboard",
    description: "Sidebar, stats, table, and activity panel for internal tools.",
    detail: "Best for admin UIs, analytics panels, and product operations screens.",
    body: buildDocumentShell({
      theme: "${1:corporate}",
      title: "${2:Operations Dashboard}",
      bodyClass: "min-h-screen bg-base-200",
      bodyContent: String.raw`  <div class="drawer lg:drawer-open">
    <input id="dashboard-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col">
      <div class="navbar bg-base-100 shadow-sm lg:hidden">
        <div class="flex-none">
          <label for="dashboard-drawer" class="btn btn-square btn-ghost">
            <span class="text-xl">\${3:=}</span>
          </label>
        </div>
        <div class="flex-1 px-2 text-lg font-semibold">\${4:Dashboard}</div>
      </div>
      <main class="flex-1 p-6">
        <div class="mx-auto grid max-w-7xl gap-6">
          <section class="grid gap-4 md:grid-cols-3">
            <div class="stat rounded-box bg-base-100 shadow-sm">
              <div class="stat-title">\${5:Monthly revenue}</div>
              <div class="stat-value text-primary">\${6:$48.2K}</div>
              <div class="stat-desc">\${7:+14% from last month}</div>
            </div>
            <div class="stat rounded-box bg-base-100 shadow-sm">
              <div class="stat-title">\${8:Active users}</div>
              <div class="stat-value">\${9:8,420}</div>
              <div class="stat-desc">\${10:+320 this week}</div>
            </div>
            <div class="stat rounded-box bg-base-100 shadow-sm">
              <div class="stat-title">\${11:Open issues}</div>
              <div class="stat-value text-warning">\${12:17}</div>
              <div class="stat-desc">\${13:Needs follow-up today}</div>
            </div>
          </section>
          <section class="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div class="card bg-base-100 shadow-sm">
              <div class="card-body">
                <div class="flex items-center justify-between">
                  <h2 class="card-title">\${14:Team queue}</h2>
                  <button type="button" class="btn btn-sm btn-primary">\${15:Create task}</button>
                </div>
                <div class="overflow-x-auto">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>\${16:Task}</th>
                        <th>\${17:Owner}</th>
                        <th>\${18:Status}</th>
                        <th>\${19:Due}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>\${20:Refresh onboarding flow}</td>
                        <td>\${21:Mina}</td>
                        <td><span class="badge badge-info">\${22:In review}</span></td>
                        <td>\${23:Today}</td>
                      </tr>
                      <tr>
                        <td>\${24:Publish snippet update}</td>
                        <td>\${25:Jedt}</td>
                        <td><span class="badge badge-warning">\${26:QA}</span></td>
                        <td>\${27:Tomorrow}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="card bg-base-100 shadow-sm">
              <div class="card-body">
                <h2 class="card-title">\${28:Activity}</h2>
                <ul class="timeline timeline-vertical">
                  <li>
                    <div class="timeline-start">\${29:09:10}</div>
                    <div class="timeline-middle">•</div>
                    <div class="timeline-end timeline-box">\${30:Deploy finished successfully}</div>
                  </li>
                  <li>
                    <div class="timeline-start">\${31:10:45}</div>
                    <div class="timeline-middle">•</div>
                    <div class="timeline-end timeline-box">\${32:QA approved release candidate}</div>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
    <div class="drawer-side">
      <label for="dashboard-drawer" class="drawer-overlay"></label>
      <aside class="min-h-full w-72 bg-neutral text-neutral-content">
        <div class="p-6 text-2xl font-bold">\${33:Acme Ops}</div>
        <ul class="menu gap-2 px-4">
          <li><a class="active">\${34:Overview}</a></li>
          <li><a>\${35:Team}</a></li>
          <li><a>\${36:Releases}</a></li>
          <li><a>\${37:Settings}</a></li>
        </ul>
      </aside>
    </div>
  </div>`,
    }),
  },
  {
    key: "auth",
    label: "Auth Screen",
    description: "Centered sign-in page with trust copy and secondary links.",
    detail: "Best for login, onboarding, and account access screens.",
    body: buildDocumentShell({
      theme: "${1:light}",
      title: "${2:Sign in}",
      bodyContent: String.raw`  <main class="grid min-h-screen place-items-center px-6 py-16">
    <div class="grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr,0.9fr]">
      <section class="rounded-box bg-primary p-10 text-primary-content shadow-2xl">
        <span class="badge badge-neutral mb-4">\${3:Welcome back}</span>
        <h1 class="text-4xl font-bold text-balance">\${4:Access your product workspace securely}</h1>
        <p class="mt-4 text-primary-content/80">\${5:Sign in to manage releases, curate snippets, and keep your design system moving.}</p>
        <div class="mt-8 space-y-4">
          <div class="rounded-box bg-primary-content/10 p-4">\${6:Preview snippets before insert, then save your best patterns as favorites.}</div>
          <div class="rounded-box bg-primary-content/10 p-4">\${7:Jump back into your most recent UI flows without hunting for prefixes.}</div>
        </div>
      </section>
      <section class="card bg-base-100 shadow-xl">
        <div class="card-body gap-5">
          <h2 class="card-title text-3xl">\${8:Sign in}</h2>
          <label class="form-control">
            <span class="label-text">\${9:Email}</span>
            <input type="email" class="input input-bordered" placeholder="\${10:you@example.com}" />
          </label>
          <label class="form-control">
            <span class="label-text">\${11:Password}</span>
            <input type="password" class="input input-bordered" placeholder="\${12:••••••••}" />
          </label>
          <label class="label cursor-pointer justify-start gap-3">
            <input type="checkbox" class="checkbox checkbox-primary" checked="checked" />
            <span class="label-text">\${13:Keep me signed in}</span>
          </label>
          <button type="button" class="btn btn-primary btn-block">\${14:Continue}</button>
          <div class="divider">\${15:or}</div>
          <button type="button" class="btn btn-outline btn-block">\${16:Continue with GitHub}</button>
          <p class="text-center text-sm text-base-content/70">
            \${17:Need an account?}
            <a href="\${18:#}" class="link link-primary">\${19:Request access}</a>
          </p>
        </div>
      </section>
    </div>
  </main>`,
    }),
  },
];

const sectionPatterns = [
  {
    key: "hero-split",
    label: "Hero Split",
    description: "Two-column hero with image and CTA.",
    body: String.raw`<section class="hero rounded-box bg-base-100 shadow-xl">
  <div class="hero-content flex-col gap-10 py-12 lg:flex-row-reverse">
    <img src="\${1:https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80}" alt="\${2:Feature image}" class="max-w-sm rounded-2xl shadow-2xl" />
    <div>
      <span class="badge badge-primary badge-outline mb-4">\${3:Now shipping}</span>
      <h1 class="text-5xl font-bold text-balance">\${4:Design polished HTML experiences faster}</h1>
      <p class="py-6 text-lg text-base-content/75">\${5:Use DaisyUI components and Tailwind utilities to build a strong first impression.}</p>
      <div class="flex flex-col gap-3 sm:flex-row">
        <button type="button" class="btn btn-primary btn-lg">\${6:Get started}</button>
        <button type="button" class="btn btn-outline btn-lg">\${7:View examples}</button>
      </div>
    </div>
  </div>
</section>
$0`,
  },
  {
    key: "card-grid",
    label: "Card Grid",
    description: "Three-card feature section for product or marketing pages.",
    body: String.raw`<section class="grid gap-6 md:grid-cols-3">
  <article class="card bg-base-100 shadow-sm">
    <div class="card-body">
      <h2 class="card-title">\${1:Faster setup}</h2>
      <p>\${2:Start with strong defaults instead of rebuilding common UI patterns.}</p>
    </div>
  </article>
  <article class="card bg-base-100 shadow-sm">
    <div class="card-body">
      <h2 class="card-title">\${3:Better iteration}</h2>
      <p>\${4:Preview, favorite, and revisit the snippets you actually use most.}</p>
    </div>
  </article>
  <article class="card bg-base-100 shadow-sm">
    <div class="card-body">
      <h2 class="card-title">\${5:Cleaner delivery}</h2>
      <p>\${6:Compose polished sections without leaving plain HTML workflows.}</p>
    </div>
  </article>
</section>
$0`,
  },
  {
    key: "stats-row",
    label: "Stats Row",
    description: "Three-stat overview for dashboards and KPI headers.",
    body: String.raw`<section class="grid gap-4 md:grid-cols-3">
  <div class="stat rounded-box bg-base-100 shadow-sm">
    <div class="stat-title">\${1:Monthly revenue}</div>
    <div class="stat-value text-primary">\${2:$48.2K}</div>
    <div class="stat-desc">\${3:+14% from last month}</div>
  </div>
  <div class="stat rounded-box bg-base-100 shadow-sm">
    <div class="stat-title">\${4:Active users}</div>
    <div class="stat-value">\${5:8,420}</div>
    <div class="stat-desc">\${6:+320 this week}</div>
  </div>
  <div class="stat rounded-box bg-base-100 shadow-sm">
    <div class="stat-title">\${7:Open issues}</div>
    <div class="stat-value text-warning">\${8:17}</div>
    <div class="stat-desc">\${9:Needs follow-up today}</div>
  </div>
</section>
$0`,
  },
  {
    key: "cta-banner",
    label: "CTA Banner",
    description: "Bold call-to-action strip for the end of a page.",
    body: String.raw`<section class="rounded-box bg-primary p-10 text-primary-content shadow-xl">
  <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
    <div>
      <p class="text-sm uppercase tracking-[0.2em]">\${1:Ready to launch}</p>
      <h2 class="text-3xl font-bold">\${2:Ship your next page with less setup}</h2>
    </div>
    <button type="button" class="btn btn-neutral btn-lg">\${3:Claim your starter}</button>
  </div>
</section>
$0`,
  },
];

function getRecents() {
  return extensionContext.globalState.get(RECENTS_KEY, []);
}

function isFavorite(prefix) {
  return getFavorites().includes(prefix);
}

async function toggleFavorite(prefix) {
  const favorites = new Set(getFavorites());
  let message;

  if (favorites.has(prefix)) {
    favorites.delete(prefix);
    message = `Removed ${prefix} from favorites`;
  } else {
    favorites.add(prefix);
    message = `Added ${prefix} to favorites`;
  }

  await extensionContext.globalState.update(FAVORITES_KEY, [...favorites]);
  vscode.window.showInformationMessage(message);

  if (snippetPreviewPanel) {
    const entry = snippetEntries.find((item) => item.primaryPrefix === prefix);
    if (entry) {
      snippetPreviewPanel.webview.html = getPreviewHtml(snippetPreviewPanel.webview, entry);
    }
  }
}

async function trackRecent(prefix) {
  const next = [prefix, ...getRecents().filter((item) => item !== prefix)].slice(0, MAX_RECENTS);
  await extensionContext.globalState.update(RECENTS_KEY, next);
}

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
      `Favorite: ${isFavorite(entry.primaryPrefix) ? "Yes" : "No"}`,
      "",
      "```html",
      ...entry.body.split("\n"),
      "```",
    ].join("\n"),
  );
  item.filterText = [entry.primaryPrefix, ...entry.prefixes, entry.component, entry.variant, entry.category].join(" ");
  item.sortText = `${favoriteRank(entry)}-${recentRank(entry)}-${tierRank(entry.tier)}-${entry.component}-${entry.variant}-${entry.primaryPrefix}`;
  item.preselect = isFavorite(entry.primaryPrefix) || entry.tier === "Starter";
  item.range = range;
  item.keepWhitespace = true;
  item.insertTextRules = vscode.CompletionItemInsertTextRule.InsertAsSnippet;
  item.label = {
    label: favoriteBadge(entry) + entry.primaryPrefix,
    detail: entry.aliases.length ? ` (${entry.aliases.join(", ")})` : "",
    description: `${entry.component} • ${entry.variant}`,
  };
  item.command = {
    command: "daisyuiSnippets._trackRecentInternal",
    title: "Track recent snippet",
    arguments: [entry.primaryPrefix],
  };
  return item;
}

function favoriteBadge(entry) {
  return isFavorite(entry.primaryPrefix) ? "★ " : "";
}

function favoriteRank(entry) {
  return isFavorite(entry.primaryPrefix) ? "0" : "1";
}

function recentRank(entry) {
  const index = getRecents().indexOf(entry.primaryPrefix);
  return index === -1 ? "99" : String(index).padStart(2, "0");
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

async function pickSnippet(category, scope = "all") {
  const favorites = new Set(getFavorites());
  const recents = getRecents();

  let entries = snippetEntries.filter((entry) => !category || entry.category === category);
  if (scope === "favorite") {
    entries = entries.filter((entry) => favorites.has(entry.primaryPrefix));
  }
  if (scope === "recent") {
    entries = recents
      .map((prefix) => snippetEntries.find((entry) => entry.primaryPrefix === prefix))
      .filter((entry) => entry && (!category || entry.category === category));
  }

  if (entries.length === 0) {
    const emptyLabel =
      scope === "favorite"
        ? "No favorite snippets yet. Use DaisyUI: Toggle Favorite Snippet first."
        : "No recent snippets yet. Insert or preview a few snippets first.";
    vscode.window.showInformationMessage(emptyLabel);
    return undefined;
  }

  entries = entries.sort((left, right) => {
    const favoriteCompare = favoriteRank(left).localeCompare(favoriteRank(right));
    if (favoriteCompare !== 0 && scope === "all") {
      return favoriteCompare;
    }
    const recentCompare = recentRank(left).localeCompare(recentRank(right));
    if (recentCompare !== 0 && scope !== "favorite") {
      return recentCompare;
    }
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
      label: `${favoriteBadge(entry)}${entry.label}`,
      description: `${entry.tier} • ${entry.category} • ${entry.prefixes.join(", ")}`,
      detail: entry.description,
      entry,
    })),
    {
      title: getSnippetPickerTitle(category, scope),
      matchOnDescription: true,
      matchOnDetail: true,
      placeHolder: getSnippetPickerPlaceholder(category, scope),
    },
  );

  return selected ? selected.entry : undefined;
}

function getSnippetPickerTitle(category, scope) {
  if (scope === "favorite") {
    return category ? `Favorite DaisyUI Snippets: ${category}` : "Favorite DaisyUI Snippets";
  }
  if (scope === "recent") {
    return category ? `Recent DaisyUI Snippets: ${category}` : "Recent DaisyUI Snippets";
  }
  return category ? `Choose DaisyUI Snippet: ${category}` : "Choose DaisyUI Snippet";
}

function getSnippetPickerPlaceholder(category, scope) {
  if (scope === "favorite") {
    return category ? `Choose a favorite ${category.toLowerCase()} snippet` : "Search your favorite snippets";
  }
  if (scope === "recent") {
    return category ? `Choose a recent ${category.toLowerCase()} snippet` : "Search your recent snippets";
  }
  return category ? `Choose a ${category.toLowerCase()} snippet` : "Search by component, variant, prefix, or description";
}

async function pickPreset() {
  const selected = await vscode.window.showQuickPick(
    presets.map((preset) => ({
      label: preset.label,
      description: preset.description,
      detail: preset.detail,
      preset,
    })),
    {
      title: "Insert DaisyUI Preset",
      matchOnDescription: true,
      matchOnDetail: true,
      placeHolder: "Choose a page preset",
    },
  );

  return selected ? selected.preset : undefined;
}

async function pickSectionPattern() {
  const selected = await vscode.window.showQuickPick(
    sectionPatterns.map((pattern) => ({
      label: pattern.label,
      description: pattern.description,
      pattern,
    })),
    {
      title: "Insert DaisyUI Section Pattern",
      matchOnDescription: true,
      placeHolder: "Choose a section pattern",
    },
  );

  return selected ? selected.pattern : undefined;
}

async function insertSnippetIntoActiveEditor(entry) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage("Open an HTML file before inserting a DaisyUI snippet.");
    return;
  }

  await editor.insertSnippet(new vscode.SnippetString(entry.body));
  await trackRecent(entry.primaryPrefix);
}

async function insertPresetIntoActiveEditor(preset) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage("Open an HTML file before inserting a DaisyUI preset.");
    return;
  }

  await editor.insertSnippet(new vscode.SnippetString(preset.body));
}

async function insertSectionPatternIntoEditor(pattern) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage("Open an HTML file before inserting a section pattern.");
    return;
  }

  const targetRange = editor.selection && !editor.selection.isEmpty ? editor.selection : undefined;
  await editor.insertSnippet(new vscode.SnippetString(pattern.body), targetRange);
}

async function switchThemeInDocument() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage("Open an HTML file before switching DaisyUI themes.");
    return;
  }

  const selectedTheme = await vscode.window.showQuickPick(
    supportedThemes.map((theme) => ({ label: theme })),
    {
      title: "Switch DaisyUI Theme",
      placeHolder: "Choose a theme for the current document",
    },
  );

  if (!selectedTheme) {
    return;
  }

  const themeUpdate = switchThemeInHtmlTag(editor.document.getText(), selectedTheme.label);

  if (!themeUpdate) {
    vscode.window.showWarningMessage("Could not find an <html> tag in the active document.");
    return;
  }

  const range = new vscode.Range(
    editor.document.positionAt(themeUpdate.startOffset),
    editor.document.positionAt(themeUpdate.endOffset),
  );

  await editor.edit((editBuilder) => {
    editBuilder.replace(range, themeUpdate.nextTag);
  });

  vscode.window.showInformationMessage(`Switched document theme to ${selectedTheme.label}.`);
}

async function upgradeSelectedHtml() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage("Open an HTML file before upgrading selected markup.");
    return;
  }

  if (editor.selection.isEmpty) {
    vscode.window.showWarningMessage("Select some HTML first, then run DaisyUI: Upgrade Selected HTML.");
    return;
  }

  const selectedText = editor.document.getText(editor.selection);
  const upgrades = getSelectionUpgrades(selectedText);

  if (upgrades.length === 0) {
    vscode.window.showInformationMessage("No DaisyUI upgrade suggestions matched the current selection.");
    return;
  }

  const choice = await vscode.window.showQuickPick(
    upgrades.map((upgrade) => ({
      label: upgrade.label,
      description: upgrade.description,
      detail: upgrade.detail,
      upgrade,
    })),
    {
      title: "Upgrade Selected HTML",
      matchOnDescription: true,
      matchOnDetail: true,
      placeHolder: "Choose a DaisyUI upgrade to apply to the selection",
    },
  );

  if (!choice) {
    return;
  }

  const nextText = choice.upgrade.apply(selectedText);
  await editor.edit((editBuilder) => {
    editBuilder.replace(editor.selection, nextText);
  });

  vscode.window.showInformationMessage(`Applied: ${choice.upgrade.label}`);
}

function showSnippetPreview(entry) {
  if (!snippetPreviewPanel) {
    snippetPreviewPanel = vscode.window.createWebviewPanel(
      "daisyuiSnippetPreview",
      `Preview ${entry.primaryPrefix}`,
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      },
    );

    snippetPreviewPanel.onDidDispose(() => {
      snippetPreviewPanel = undefined;
    });

    snippetPreviewPanel.webview.onDidReceiveMessage(async (message) => {
      if (message.type === "insert") {
        const selected = snippetEntries.find((item) => item.primaryPrefix === message.prefix);
        if (selected) {
          await insertSnippetIntoActiveEditor(selected);
          vscode.window.showInformationMessage(`Inserted ${selected.primaryPrefix}`);
        }
      }

      if (message.type === "copyPrefix") {
        await vscode.env.clipboard.writeText(message.prefix);
        vscode.window.showInformationMessage(`Copied ${message.prefix}`);
      }

      if (message.type === "toggleFavorite") {
        await toggleFavorite(message.prefix);
      }
    });
  }

  snippetPreviewPanel.title = `Preview ${entry.primaryPrefix}`;
  snippetPreviewPanel.webview.html = getPreviewHtml(snippetPreviewPanel.webview, entry);
  snippetPreviewPanel.reveal(vscode.ViewColumn.Beside);
  trackRecent(entry.primaryPrefix);
}

function showPresetPreview(preset) {
  if (!presetPreviewPanel) {
    presetPreviewPanel = vscode.window.createWebviewPanel(
      "daisyuiPresetPreview",
      `Preset ${preset.label}`,
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      },
    );

    presetPreviewPanel.onDidDispose(() => {
      presetPreviewPanel = undefined;
    });

    presetPreviewPanel.webview.onDidReceiveMessage(async (message) => {
      if (message.type === "insertPreset") {
        const selected = presets.find((item) => item.key === message.key);
        if (selected) {
          await insertPresetIntoActiveEditor(selected);
          vscode.window.showInformationMessage(`Inserted ${selected.label} preset`);
        }
      }
    });
  }

  presetPreviewPanel.title = `Preset ${preset.label}`;
  presetPreviewPanel.webview.html = getPresetPreviewHtml(presetPreviewPanel.webview, preset);
  presetPreviewPanel.reveal(vscode.ViewColumn.Beside);
}

function getPreviewHtml(webview, entry) {
  const renderedSnippet = snippetToRenderableHtml(entry.body);
  const escapedCode = escapeHtml(entry.body);
  const nonce = String(Date.now());
  const favoriteLabel = isFavorite(entry.primaryPrefix) ? "Remove favorite" : "Save favorite";

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
      body { margin: 0; font-family: ui-sans-serif, system-ui, sans-serif; background: #f7f3eb; color: #2f241f; }
      .shell { display: grid; grid-template-columns: minmax(320px, 1fr) 420px; min-height: 100vh; }
      .preview-pane { padding: 24px; background: linear-gradient(180deg, #f8f5ee 0%, #efe7d7 100%); }
      .preview-card, .code-card { background: rgba(255,255,255,0.72); border: 1px solid rgba(111, 89, 67, 0.14); border-radius: 20px; box-shadow: 0 16px 40px rgba(92, 74, 56, 0.12); }
      .preview-card { padding: 18px; }
      .meta { display: flex; gap: 8px; flex-wrap: wrap; margin: 0 0 16px; }
      .chip { border-radius: 999px; background: #fff2bf; border: 1px solid #f2c45f; padding: 6px 10px; font-size: 12px; font-weight: 700; }
      .preview-frame { border-radius: 18px; padding: 24px; min-height: 320px; background: linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,248,237,0.92)); }
      .side-pane { padding: 24px 24px 24px 0; }
      .side-stack { display: grid; gap: 16px; height: 100%; }
      .code-card { padding: 20px; overflow: auto; }
      pre { margin: 0; white-space: pre-wrap; word-break: break-word; font-size: 13px; line-height: 1.55; color: #3e312b; }
      .actions { display: flex; gap: 12px; flex-wrap: wrap; }
      button { border: 0; border-radius: 12px; padding: 12px 16px; font-size: 14px; font-weight: 700; cursor: pointer; }
      .primary { background: #7db55b; color: #10210a; }
      .secondary { background: #efe5d6; color: #5e4a3b; }
      h1 { margin: 0 0 8px; font-size: 28px; }
      p { margin: 0 0 12px; color: #5e4a3b; }
    </style>
  </head>
  <body>
    <div class="shell">
      <section class="preview-pane">
        <div class="meta">
          <span class="chip">${escapeHtml(entry.tier)}</span>
          <span class="chip">${escapeHtml(entry.category)}</span>
          <span class="chip">${escapeHtml(entry.primaryPrefix)}</span>
          <span class="chip">${isFavorite(entry.primaryPrefix) ? "Favorite" : "Not favorite"}</span>
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
              <button class="secondary" id="favorite-button">${favoriteLabel}</button>
            </div>
          </div>
        </div>
      </aside>
    </div>
    <script nonce="${nonce}">
      const vscode = acquireVsCodeApi();
      const prefix = ${JSON.stringify(entry.primaryPrefix)};
      document.getElementById("insert-button").addEventListener("click", () => {
        vscode.postMessage({ type: "insert", prefix });
      });
      document.getElementById("copy-button").addEventListener("click", () => {
        vscode.postMessage({ type: "copyPrefix", prefix });
      });
      document.getElementById("favorite-button").addEventListener("click", () => {
        vscode.postMessage({ type: "toggleFavorite", prefix });
      });
    </script>
  </body>
</html>`;
}

function getPresetPreviewHtml(webview, preset) {
  const renderedSnippet = snippetToRenderableHtml(preset.body);
  const escapedCode = escapeHtml(preset.body);
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
      body { margin: 0; font-family: ui-sans-serif, system-ui, sans-serif; background: #f7f3eb; color: #2f241f; }
      .shell { display: grid; grid-template-columns: minmax(320px, 1fr) 420px; min-height: 100vh; }
      .preview-pane { padding: 24px; background: linear-gradient(180deg, #f8f5ee 0%, #efe7d7 100%); overflow: auto; }
      .preview-card, .code-card { background: rgba(255,255,255,0.72); border: 1px solid rgba(111, 89, 67, 0.14); border-radius: 20px; box-shadow: 0 16px 40px rgba(92, 74, 56, 0.12); }
      .preview-card { padding: 18px; }
      .meta { display: flex; gap: 8px; flex-wrap: wrap; margin: 0 0 16px; }
      .chip { border-radius: 999px; background: #fff2bf; border: 1px solid #f2c45f; padding: 6px 10px; font-size: 12px; font-weight: 700; }
      .preview-frame { border-radius: 18px; padding: 24px; min-height: 320px; background: linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,248,237,0.92)); }
      .side-pane { padding: 24px 24px 24px 0; }
      .side-stack { display: grid; gap: 16px; height: 100%; }
      .code-card { padding: 20px; overflow: auto; }
      pre { margin: 0; white-space: pre-wrap; word-break: break-word; font-size: 13px; line-height: 1.55; color: #3e312b; }
      .actions { display: flex; gap: 12px; flex-wrap: wrap; }
      button { border: 0; border-radius: 12px; padding: 12px 16px; font-size: 14px; font-weight: 700; cursor: pointer; }
      .primary { background: #7db55b; color: #10210a; }
      h1 { margin: 0 0 8px; font-size: 28px; }
      p { margin: 0 0 12px; color: #5e4a3b; }
    </style>
  </head>
  <body>
    <div class="shell">
      <section class="preview-pane">
        <div class="meta">
          <span class="chip">Preset</span>
          <span class="chip">${escapeHtml(preset.label)}</span>
        </div>
        <div class="preview-card">
          <h1>${escapeHtml(preset.label)}</h1>
          <p>${escapeHtml(preset.description)}</p>
          <div class="preview-frame">
            ${renderedSnippet}
          </div>
        </div>
      </section>
      <aside class="side-pane">
        <div class="side-stack">
          <div class="code-card">
            <p><strong>Preset details</strong></p>
            <p>${escapeHtml(preset.detail)}</p>
            <pre><code>${escapedCode}</code></pre>
          </div>
          <div class="code-card">
            <p><strong>Actions</strong></p>
            <div class="actions">
              <button class="primary" id="insert-button">Insert preset</button>
            </div>
          </div>
        </div>
      </aside>
    </div>
    <script nonce="${nonce}">
      const vscode = acquireVsCodeApi();
      const key = ${JSON.stringify(preset.key)};
      document.getElementById("insert-button").addEventListener("click", () => {
        vscode.postMessage({ type: "insertPreset", key });
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
