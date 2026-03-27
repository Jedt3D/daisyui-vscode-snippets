"use strict";

const assert = require("node:assert/strict");
const {
  buildCompletionSortText,
  buildSnippetQuickPickItems,
  favoriteBadge,
  recentRank,
  sortSnippetEntries,
  tierRank,
} = require("../src/extension-state-utils.js");

const entries = [
  {
    label: "Button: Default",
    component: "Button",
    variant: "Default",
    prefixes: ["d-btn"],
    primaryPrefix: "d-btn",
    description: "Primary button",
    category: "Actions",
    tier: "Starter",
  },
  {
    label: "Alert: Info",
    component: "Alert",
    variant: "Info",
    prefixes: ["d-alert-info"],
    primaryPrefix: "d-alert-info",
    description: "Info alert",
    category: "Feedback",
    tier: "Advanced",
  },
  {
    label: "Card: Default",
    component: "Card",
    variant: "Default",
    prefixes: ["d-card"],
    primaryPrefix: "d-card",
    description: "Default card",
    category: "Layout",
    tier: "Common",
  },
];

function run() {
  const favorites = ["d-card"];
  const recents = ["d-alert-info", "d-btn"];

  const sortedAll = sortSnippetEntries(entries, { favorites, recents, scope: "all" });
  assert.deepEqual(sortedAll.map((entry) => entry.primaryPrefix), ["d-card", "d-alert-info", "d-btn"]);

  const sortedFavorite = sortSnippetEntries(entries.filter((entry) => favorites.includes(entry.primaryPrefix)), {
    favorites,
    recents,
    scope: "favorite",
  });
  assert.deepEqual(sortedFavorite.map((entry) => entry.primaryPrefix), ["d-card"]);

  const quickPickItems = buildSnippetQuickPickItems(sortedAll, { favorites });
  assert.equal(quickPickItems[0].label, "★ Card: Default");
  assert.equal(quickPickItems[1].description, "Advanced • Feedback • d-alert-info");

  assert.equal(favoriteBadge(entries[0], favorites), "");
  assert.equal(favoriteBadge(entries[2], favorites), "★ ");
  assert.equal(recentRank(entries[1], recents), "00");
  assert.equal(tierRank("Starter"), "1");
  assert.equal(tierRank("Common"), "2");
  assert.equal(tierRank("Advanced"), "3");

  assert.equal(
    buildCompletionSortText(entries[2], { favorites, recents }),
    "0-99-2-Card-Default-d-card",
  );

  console.log("State utility tests passed.");
}

run();
