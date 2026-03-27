"use strict";

function isFavorite(prefix, favorites = []) {
  return favorites.includes(prefix);
}

function favoriteBadge(entry, favorites = []) {
  return isFavorite(entry.primaryPrefix, favorites) ? "★ " : "";
}

function favoriteRank(entry, favorites = []) {
  return isFavorite(entry.primaryPrefix, favorites) ? "0" : "1";
}

function recentRank(entry, recents = []) {
  const index = recents.indexOf(entry.primaryPrefix);
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

function sortSnippetEntries(entries, options = {}) {
  const { favorites = [], recents = [], scope = "all" } = options;
  return [...entries].sort((left, right) => {
    const favoriteCompare = favoriteRank(left, favorites).localeCompare(favoriteRank(right, favorites));
    if (favoriteCompare !== 0 && scope === "all") {
      return favoriteCompare;
    }

    const recentCompare = recentRank(left, recents).localeCompare(recentRank(right, recents));
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
}

function buildSnippetQuickPickItems(entries, options = {}) {
  const { favorites = [] } = options;
  return entries.map((entry) => ({
    label: `${favoriteBadge(entry, favorites)}${entry.label}`,
    description: `${entry.tier} • ${entry.category} • ${entry.prefixes.join(", ")}`,
    detail: entry.description,
    entry,
  }));
}

function buildCompletionSortText(entry, options = {}) {
  const { favorites = [], recents = [] } = options;
  return `${favoriteRank(entry, favorites)}-${recentRank(entry, recents)}-${tierRank(entry.tier)}-${entry.component}-${entry.variant}-${entry.primaryPrefix}`;
}

module.exports = {
  buildCompletionSortText,
  buildSnippetQuickPickItems,
  favoriteBadge,
  favoriteRank,
  isFavorite,
  recentRank,
  sortSnippetEntries,
  tierRank,
};
