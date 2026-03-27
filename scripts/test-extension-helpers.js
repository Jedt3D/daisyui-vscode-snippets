"use strict";

const assert = require("node:assert/strict");
const {
  applyClassUpgrade,
  getSelectionUpgrades,
  switchThemeInHtmlTag,
  wrapInCard,
} = require("../src/html-upgrade-utils.js");

function run() {
  const buttonHtml = '<button type="button">Save</button>';
  assert.equal(
    applyClassUpgrade(buttonHtml, "button", ["btn"]),
    '<button type="button" class="btn">Save</button>',
  );

  const existingClasses = '<input class="w-full" type="email" />';
  assert.equal(
    applyClassUpgrade(existingClasses, "input", ["input", "input-bordered"]),
    '<input class="w-full input input-bordered" type="email" />',
  );

  const wrapped = wrapInCard("<section>\n  <p>Hello</p>\n</section>");
  assert.ok(wrapped.includes('<article class="card bg-base-100 shadow-sm">'));
  assert.ok(wrapped.includes('    <section>'));

  const upgrades = getSelectionUpgrades('<button>Save</button><input type="text" />');
  assert.deepEqual(
    upgrades.map((item) => item.key),
    ["button", "input"],
  );

  const themed = switchThemeInHtmlTag('<html lang="en" data-theme="light">', "dark");
  assert.equal(themed.nextTag, '<html lang="en" data-theme="dark">');

  const themedMissing = switchThemeInHtmlTag('<html lang="en">', "corporate");
  assert.equal(themedMissing.nextTag, '<html data-theme="corporate" lang="en">');

  console.log("Helper tests passed.");
}

run();
