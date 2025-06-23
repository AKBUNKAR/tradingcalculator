// Element references
const entryPriceInput = document.getElementById("entryPrice");
const slPointsInput = document.getElementById("slPoints");
const targetPointsInput = document.getElementById("targetPoints");
const tslPointsInput = document.getElementById("tslPoints");
const tslTriggerPointsInput = document.getElementById("tslTriggerPoints");
const strickInput = document.getElementById("strick");

const slPriceOutput = document.getElementById("slPrice");
const targetPriceOutput = document.getElementById("targetPrice");
const tslPriceOutput = document.getElementById("tslPrice");
const tslTriggerPriceOutput = document.getElementById("tslTriggerPrice");

const toggleModeButton = document.getElementById("toggle-mode");
const togglePointsButton = document.getElementById("toggle-points");
const pointsSection = document.getElementById("points-section");
const modeIcon = document.getElementById("mode-icon");
const toggleIcon = document.getElementById("toggle-icon");

// Calculate output fields
function calculate() {
  const entry = parseFloat(entryPriceInput.value);
  const sl = parseFloat(slPointsInput.value);
  const target = parseFloat(targetPointsInput.value);
  const tsl = parseFloat(tslPointsInput.value);
  const tslTrigger = parseFloat(tslTriggerPointsInput.value);

  if (!isNaN(entry)) {
    slPriceOutput.value = isNaN(sl) ? '' : (entry - sl).toFixed(2);
    targetPriceOutput.value = isNaN(target) ? '' : (entry + target).toFixed(2);
    tslPriceOutput.value = isNaN(tsl) ? '' : (entry + tsl).toFixed(2);
    tslTriggerPriceOutput.value = isNaN(tslTrigger) ? '' : (entry + tslTrigger).toFixed(2);
  }

  saveValues();
}

// Save values to storage
function saveValues() {
  chrome.storage.local.set({
    entryPrice: entryPriceInput.value,
    slPoints: slPointsInput.value,
    targetPoints: targetPointsInput.value,
    tslPoints: tslPointsInput.value,
    tslTriggerPoints: tslTriggerPointsInput.value,
    strick: strickInput.value
  });
}

// Load stored values
function loadValues() {
  chrome.storage.local.get([
    "entryPrice", "slPoints", "targetPoints",
    "tslPoints", "tslTriggerPoints", "strick"
  ], (result) => {
    if (result.entryPrice) entryPriceInput.value = result.entryPrice;
    if (result.slPoints) slPointsInput.value = result.slPoints;
    if (result.targetPoints) targetPointsInput.value = result.targetPoints;
    if (result.tslPoints) tslPointsInput.value = result.tslPoints;
    if (result.tslTriggerPoints) tslTriggerPointsInput.value = result.tslTriggerPoints;
    if (result.strick) strickInput.value = result.strick;

    calculate();
  });

  const isDark = localStorage.getItem("darkMode") === "true";
  document.body.classList.toggle("dark-mode", isDark);
  modeIcon.classList.toggle("fa-sun", isDark);
  modeIcon.classList.toggle("fa-moon", !isDark);

  const isPointsHidden = localStorage.getItem("pointsHidden") === "true";
  pointsSection.classList.toggle("hidden", isPointsHidden);
  toggleIcon.classList.toggle("fa-arrow-up", isPointsHidden);
  toggleIcon.classList.toggle("fa-arrow-down", !isPointsHidden);
}

// Input events
[
  entryPriceInput,
  slPointsInput,
  targetPointsInput,
  tslPointsInput,
  tslTriggerPointsInput,
  strickInput
].forEach(input => input.addEventListener("input", calculate));

// Dark mode toggle
toggleModeButton.addEventListener("click", () => {
  const isDarkMode = document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", isDarkMode);
  modeIcon.classList.toggle("fa-sun", isDarkMode);
  modeIcon.classList.toggle("fa-moon", !isDarkMode);
});

// Hide/show points section
togglePointsButton.addEventListener("click", () => {
  const isHidden = pointsSection.classList.contains("hidden");
  pointsSection.classList.toggle("hidden", !isHidden);
  toggleIcon.classList.toggle("fa-arrow-down", isHidden);
  toggleIcon.classList.toggle("fa-arrow-up", !isHidden);
  localStorage.setItem("pointsHidden", !isHidden);
});

// Copy with animation
function copyToClipboard(inputId) {
  const input = document.getElementById(inputId);
  const value = input.value;
  if (value) {
    navigator.clipboard.writeText(value).then(() => {
      const button = document.getElementById(`copy-${inputId}`);
      button.classList.add("clicked");
      setTimeout(() => {
        button.classList.remove("clicked");
      }, 300);
    }).catch(err => {
      console.error("Copy failed:", err);
    });
  }
}

// Add copy button listeners
[
  "strick",
  "entryPrice",
  "slPrice",
  "targetPrice",
  "tslPrice",
  "tslTriggerPrice"
].forEach(id => {
  const button = document.getElementById(`copy-${id}`);
  if (button) {
    button.addEventListener("click", () => copyToClipboard(id));
  }
});

// Ensure wrapper is vertically centered
function centerContent() {
  const wrapper = document.querySelector('.wrapper');
  if (wrapper) {
    const vh = window.innerHeight;
    wrapper.style.minHeight = vh + 'px';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.justifyContent = 'center';
    wrapper.style.alignItems = 'center';
    wrapper.style.padding = '16px';
  }
}

// Load on open
window.addEventListener("DOMContentLoaded", () => {
  loadValues();
  centerContent();
});
window.addEventListener("resize", centerContent);
