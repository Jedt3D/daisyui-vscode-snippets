"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  applyClassUpgrade,
  getSelectionUpgrades,
  switchThemeInHtmlTag,
  wrapInCard,
} = require("../src/html-upgrade-utils.js");

const fixtureDir = path.join(__dirname, "..", "tests", "fixtures", "upgrades");

function readFixture(name) {
  return fs.readFileSync(path.join(fixtureDir, name), "utf8").trim();
}

function run() {
  assert.equal(
    applyClassUpgrade(readFixture("button.before.html"), "button", ["btn"]),
    readFixture("button.after.html"),
  );

  let formControls = readFixture("form-controls.before.html");
  formControls = applyClassUpgrade(formControls, "input", ["input", "input-bordered"]);
  formControls = applyClassUpgrade(formControls, "textarea", ["textarea", "textarea-bordered"]);
  formControls = applyClassUpgrade(formControls, "select", ["select", "select-bordered"]);
  assert.equal(formControls, readFixture("form-controls.after.html"));

  assert.equal(wrapInCard(readFixture("card-wrap.before.html")), readFixture("card-wrap.after.html"));

  const upgradeKeys = getSelectionUpgrades(readFixture("form-controls.before.html")).map((item) => item.key);
  assert.deepEqual(upgradeKeys, ["input", "textarea", "select"]);

  const replacedTheme = switchThemeInHtmlTag(readFixture("theme-replace.before.html"), "dark");
  assert.equal(replacedTheme.nextTag, readFixture("theme-replace.after.html"));

  const insertedTheme = switchThemeInHtmlTag(readFixture("theme-insert.before.html"), "corporate");
  assert.equal(insertedTheme.nextTag, readFixture("theme-insert.after.html"));

  console.log("Fixture upgrade tests passed.");
}

run();
