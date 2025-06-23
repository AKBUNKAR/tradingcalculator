const $ = (id) => document.getElementById(id);

const inputs = {
  strick: $("strick"),
  entry: $("entryPrice"),
  sl: $("slPoints"),
  target: $("targetPoints"),
  tsl: $("tslPoints"),
  tslTrigger: $("tslTrigger")
};

const outputs = {
  slPrice: $("slPrice"),
  targetPrice: $("targetPrice"),
  tslPrice: $("tslPrice"),
  tslTriggerPrice: $("tslTriggerPrice")
};

function calculate() {
  const entry = parseFloat(inputs.entry.value);

  outputs.slPrice.value = (!isNaN(entry) && !isNaN(inputs.sl.valueAsNumber))
    ? (entry - inputs.sl.valueAsNumber).toFixed(2)
    : "";

  outputs.targetPrice.value = (!isNaN(entry) && !isNaN(inputs.target.valueAsNumber))
    ? (entry + inputs.target.valueAsNumber).toFixed(2)
    : "";

  outputs.tslPrice.value = (!isNaN(entry) && !isNaN(inputs.tsl.valueAsNumber))
    ? (entry + inputs.tsl.valueAsNumber).toFixed(2)
    : "";

  outputs.tslTriggerPrice.value = (!isNaN(entry) && !isNaN(inputs.tslTrigger.valueAsNumber))
    ? (entry + inputs.tslTrigger.valueAsNumber).toFixed(2)
    : "";

  save();
}

function save() {
  const data = {};
  for (const key in inputs) {
    data[key] = inputs[key].value;
  }
  localStorage.setItem("calcData", JSON.stringify(data));
}

function load() {
  const data = JSON.parse(localStorage.getItem("calcData") || "{}");
  for (const key in inputs) {
    if (data[key]) inputs[key].value = data[key];
  }
  calculate();
}

function toggleMode() {
  const dark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", dark);
  $("mode-icon").classList.toggle("fa-sun", dark);
  $("mode-icon").classList.toggle("fa-moon", !dark);
}

function toggleSection(sectionId, iconId) {
  const section = $(sectionId);
  section.classList.toggle("hidden");
  const icon = $(iconId);
  icon.classList.toggle("fa-eye");
  icon.classList.toggle("fa-eye-slash");
  localStorage.setItem(sectionId + "_hidden", section.classList.contains("hidden"));
}

function applySavedModeAndSections() {
  if (localStorage.getItem("darkMode") === "true") toggleMode();
  if (localStorage.getItem("points-section_hidden") === "true") toggleSection("points-section", "toggle-icon");
  if (localStorage.getItem("tsl-section_hidden") === "true") toggleSection("tsl-section", "toggle-tsl-icon");
}

function animateCopy(btn) {
  btn.classList.add("clicked");
  setTimeout(() => btn.classList.remove("clicked"), 300);
}

function copyToClipboard(id, btnId) {
  const val = $(id).value;
  if (val) {
    navigator.clipboard.writeText(val);
    animateCopy($(btnId));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  load();
  applySavedModeAndSections();

  for (const key in inputs) {
    inputs[key].addEventListener("input", calculate);
  }

  $("toggle-mode").addEventListener("click", toggleMode);
  $("toggle-points").addEventListener("click", () => toggleSection("points-section", "toggle-icon"));
  $("toggle-tsl").addEventListener("click", () => toggleSection("tsl-section", "toggle-tsl-icon"));

  [
    ["strick", "copy-strick"],
    ["entryPrice", "copy-entryPrice"],
    ["slPrice", "copy-slPrice"],
    ["targetPrice", "copy-targetPrice"],
    ["tslPoints", "copy-tslPoints"],
    ["tslTrigger", "copy-tslTrigger"],
    ["tslPrice", "copy-tslPrice"],
    ["tslTriggerPrice", "copy-tslTriggerPrice"]
  ].forEach(([id, btnId]) => {
    $(btnId).addEventListener("click", () => copyToClipboard(id, btnId));
  });
});
