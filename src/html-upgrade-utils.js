"use strict";

function getSelectionUpgrades(selectedText) {
  const upgrades = [];
  const text = selectedText.trim();

  if (/<button\b/i.test(text)) {
    upgrades.push({
      key: "button",
      label: "Convert buttons to DaisyUI buttons",
      description: "Adds `btn` classes to selected `<button>` elements.",
      detail: "Useful when you already have plain buttons and want DaisyUI styling fast.",
      apply: (value) => applyClassUpgrade(value, "button", ["btn"]),
    });
  }

  if (/<input\b/i.test(text)) {
    upgrades.push({
      key: "input",
      label: "Convert inputs to DaisyUI inputs",
      description: "Adds `input input-bordered` classes to selected `<input>` elements.",
      detail: "Good for plain forms that need immediate DaisyUI styling.",
      apply: (value) => applyClassUpgrade(value, "input", ["input", "input-bordered"]),
    });
  }

  if (/<textarea\b/i.test(text)) {
    upgrades.push({
      key: "textarea",
      label: "Convert textareas to DaisyUI textareas",
      description: "Adds `textarea textarea-bordered` classes to selected `<textarea>` elements.",
      detail: "Keeps your structure but upgrades the field styling.",
      apply: (value) => applyClassUpgrade(value, "textarea", ["textarea", "textarea-bordered"]),
    });
  }

  if (/<select\b/i.test(text)) {
    upgrades.push({
      key: "select",
      label: "Convert selects to DaisyUI selects",
      description: "Adds `select select-bordered` classes to selected `<select>` elements.",
      detail: "Useful for plain dropdowns that should match DaisyUI forms.",
      apply: (value) => applyClassUpgrade(value, "select", ["select", "select-bordered"]),
    });
  }

  if (/<table\b/i.test(text)) {
    upgrades.push({
      key: "table",
      label: "Convert table to DaisyUI table",
      description: "Adds the `table` class to selected `<table>` elements.",
      detail: "A simple upgrade for dashboard and admin table markup.",
      apply: (value) => applyClassUpgrade(value, "table", ["table"]),
    });
  }

  if (/<(?:div|section|article|main)\b/i.test(text)) {
    upgrades.push({
      key: "card",
      label: "Wrap selection in a DaisyUI card",
      description: "Places the selected markup inside a `card` with a `card-body` container.",
      detail: "Useful when you have raw content blocks that need a stronger surface.",
      apply: (value) => wrapInCard(value),
    });
  }

  return upgrades;
}

function applyClassUpgrade(markup, tagName, requiredClasses) {
  const tagPattern = new RegExp(`<${tagName}\\b([^>]*)>`, "gi");
  return markup.replace(tagPattern, (match, attrs = "") => {
    const classMatch = attrs.match(/\bclass\s*=\s*(["'])(.*?)\1/i);
    if (classMatch) {
      const quote = classMatch[1];
      const existing = classMatch[2].split(/\s+/).filter(Boolean);
      const merged = [...new Set([...existing, ...requiredClasses])].join(" ");
      return match.replace(classMatch[0], `class=${quote}${merged}${quote}`);
    }

    const trimmedAttrs = attrs.trim();
    const nextAttrs = trimmedAttrs ? ` ${trimmedAttrs}` : "";
    return `<${tagName}${nextAttrs} class="${requiredClasses.join(" ")}">`;
  });
}

function wrapInCard(markup) {
  const trimmed = markup.trim();
  return [
    '<article class="card bg-base-100 shadow-sm">',
    '  <div class="card-body">',
    indentBlock(trimmed, 4),
    "  </div>",
    "</article>",
  ].join("\n");
}

function indentBlock(value, spaces) {
  const padding = " ".repeat(spaces);
  return value
    .split("\n")
    .map((line) => (line.trim().length ? `${padding}${line}` : line))
    .join("\n");
}

function switchThemeInHtmlTag(documentText, nextTheme) {
  const htmlTagMatch = documentText.match(/<html\b[^>]*>/i);
  if (!htmlTagMatch) {
    return null;
  }

  const currentTag = htmlTagMatch[0];
  let nextTag;
  if (/data-theme\s*=\s*["'][^"']+["']/i.test(currentTag)) {
    nextTag = currentTag.replace(/data-theme\s*=\s*["'][^"']+["']/i, `data-theme="${nextTheme}"`);
  } else {
    nextTag = currentTag.replace(/<html\b/i, `<html data-theme="${nextTheme}"`);
  }

  return {
    currentTag,
    nextTag,
    startOffset: htmlTagMatch.index || 0,
    endOffset: (htmlTagMatch.index || 0) + currentTag.length,
  };
}

module.exports = {
  applyClassUpgrade,
  getSelectionUpgrades,
  indentBlock,
  switchThemeInHtmlTag,
  wrapInCard,
};
