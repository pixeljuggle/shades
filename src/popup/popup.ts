import type { StoredSettings, ThemeName, CustomColors } from "../types/index";
import { DEFAULT_SETTINGS, buildFilter } from "../types/index";
import { icons } from "./icons";

// ---- Inject Lucide icons ----

for (const [theme, svg] of Object.entries(icons)) {
  const el = document.getElementById(`icon-${theme}`);
  if (el) el.innerHTML = svg;
}

// ---- DOM refs ----

const themeBtns   = document.querySelectorAll<HTMLButtonElement>(".theme-btn");
const customPanel = document.getElementById("customPanel") as HTMLElement;
const previewPage = document.getElementById("previewPage") as HTMLElement;
const resetBtn    = document.getElementById("resetBtn") as HTMLButtonElement;

const sliderBrightness = document.getElementById("sliderBrightness") as HTMLInputElement;
const sliderContrast   = document.getElementById("sliderContrast")   as HTMLInputElement;
const sliderSepia      = document.getElementById("sliderSepia")      as HTMLInputElement;
const sliderHueRotate  = document.getElementById("sliderHueRotate")  as HTMLInputElement;
const sliderInvert     = document.getElementById("sliderInvert")     as HTMLInputElement;
const sliderSaturate   = document.getElementById("sliderSaturate")   as HTMLInputElement;

const valBrightness = document.getElementById("valBrightness") as HTMLElement;
const valContrast   = document.getElementById("valContrast")   as HTMLElement;
const valSepia      = document.getElementById("valSepia")      as HTMLElement;
const valHueRotate  = document.getElementById("valHueRotate")  as HTMLElement;
const valInvert     = document.getElementById("valInvert")     as HTMLElement;
const valSaturate   = document.getElementById("valSaturate")   as HTMLElement;

// ---- State ----

let currentSettings: StoredSettings = { ...DEFAULT_SETTINGS };

// ---- Helpers ----

function setActive(theme: ThemeName): void {
  themeBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset["theme"] === theme);
  });
  customPanel.hidden = theme !== "custom";
}

function readSliders(): CustomColors {
  return {
    brightness: Number(sliderBrightness.value),
    contrast:   Number(sliderContrast.value),
    sepia:      Number(sliderSepia.value),
    hueRotate:  Number(sliderHueRotate.value),
    invert:     Number(sliderInvert.value),
    saturate:   Number(sliderSaturate.value),
  };
}

function setSliders(c: CustomColors): void {
  sliderBrightness.value = String(c.brightness);
  sliderContrast.value   = String(c.contrast);
  sliderSepia.value      = String(c.sepia);
  sliderHueRotate.value  = String(c.hueRotate);
  sliderInvert.value     = String(c.invert);
  sliderSaturate.value   = String(c.saturate);

  valBrightness.textContent = String(c.brightness);
  valContrast.textContent   = String(c.contrast);
  valSepia.textContent      = String(c.sepia);
  valHueRotate.textContent  = String(c.hueRotate);
  valInvert.textContent     = String(c.invert);
  valSaturate.textContent   = String(c.saturate);
}

function updatePreview(c: CustomColors): void {
  previewPage.style.filter = buildFilter(c);
}

function save(settings: Partial<StoredSettings>): void {
  currentSettings = { ...currentSettings, ...settings };
  chrome.storage.sync.set(currentSettings);
}

// Debounced version for high-frequency inputs (slider dragging).
// Merges pending settings so rapid calls collapse into a single write.
let saveTimer: ReturnType<typeof setTimeout> | null = null;
let pendingSave: Partial<StoredSettings> = {};

function saveDebounced(settings: Partial<StoredSettings>, delay = 400): void {
  pendingSave = { ...pendingSave, ...settings };
  if (saveTimer !== null) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    save(pendingSave);
    pendingSave = {};
    saveTimer = null;
  }, delay);
}

// ---- Init ----

chrome.storage.sync.get(DEFAULT_SETTINGS, (stored) => {
  currentSettings = {
    theme: (stored as StoredSettings).theme,
    // Spread over defaults handles old { bg: string } format gracefully
    customColors: {
      ...DEFAULT_SETTINGS.customColors,
      ...(stored as StoredSettings).customColors,
    },
  };
  setActive(currentSettings.theme);
  setSliders(currentSettings.customColors);
  updatePreview(currentSettings.customColors);
});

// ---- Events ----

themeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const theme = btn.dataset["theme"] as ThemeName;
    setActive(theme);
    save({ theme });
  });
});

// All sliders share the same handler pattern
const allSliders: Array<[HTMLInputElement, HTMLElement]> = [
  [sliderBrightness, valBrightness],
  [sliderContrast,   valContrast],
  [sliderSepia,      valSepia],
  [sliderHueRotate,  valHueRotate],
  [sliderInvert,     valInvert],
  [sliderSaturate,   valSaturate],
];

for (const [slider, valEl] of allSliders) {
  slider.addEventListener("input", () => {
    valEl.textContent = slider.value;
    const colors = readSliders();
    updatePreview(colors);                   // instant preview
    saveDebounced({ customColors: colors }); // 400ms debounced write
  });
}

// Reset — immediate save, no debounce
resetBtn.addEventListener("click", () => {
  const d = DEFAULT_SETTINGS.customColors;
  setSliders(d);
  updatePreview(d);
  save({ customColors: d });
});
