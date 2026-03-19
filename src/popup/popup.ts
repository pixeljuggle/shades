import type { StoredSettings, ThemeName, CustomColors, Preset } from "../types/index";
import { DEFAULT_SETTINGS } from "../types/index";
import { icons } from "./icons";

// ---- Built-in presets (not stored — always available) ----

const BUILT_IN_PRESETS: Preset[] = [
  {
    name: "Focus",
    colors: {
      brightness: 100,
      contrast: 110,
      sepia: 0,
      hueRotate: 0,
      invert: 0,
      saturate: 0,
      grayscale: 100,
    },
  },
  {
    name: "Night Shift",
    colors: {
      brightness: 85,
      contrast: 95,
      sepia: 30,
      hueRotate: 0,
      invert: 0,
      saturate: 80,
      grayscale: 0,
    },
  },
];

// ---- Inject Lucide icons ----

for (const [theme, svg] of Object.entries(icons)) {
  const el = document.getElementById(`icon-${theme}`);
  if (el) el.innerHTML = svg;
}

// ---- DOM refs ----

const themeBtns = document.querySelectorAll<HTMLButtonElement>(".theme-btn");
const customPanel = document.getElementById("customPanel") as HTMLElement;
const presetsRow = document.getElementById("presetsRow") as HTMLElement;
const presetNameInput = document.getElementById("presetNameInput") as HTMLInputElement;
const savePresetBtn = document.getElementById("savePresetBtn") as HTMLButtonElement;
const resetBtn = document.getElementById("resetBtn") as HTMLButtonElement;
const reinvertCheckbox = document.getElementById("reinvertMedia") as HTMLInputElement;
const transitionCheckbox = document.getElementById("smoothTransition") as HTMLInputElement;

const sliderBrightness = document.getElementById("sliderBrightness") as HTMLInputElement;
const sliderContrast = document.getElementById("sliderContrast") as HTMLInputElement;
const sliderSepia = document.getElementById("sliderSepia") as HTMLInputElement;
const sliderHueRotate = document.getElementById("sliderHueRotate") as HTMLInputElement;
const sliderInvert = document.getElementById("sliderInvert") as HTMLInputElement;
const sliderSaturate = document.getElementById("sliderSaturate") as HTMLInputElement;
const sliderGrayscale = document.getElementById("sliderGrayscale") as HTMLInputElement;

const valBrightness = document.getElementById("valBrightness") as HTMLElement;
const valContrast = document.getElementById("valContrast") as HTMLElement;
const valSepia = document.getElementById("valSepia") as HTMLElement;
const valHueRotate = document.getElementById("valHueRotate") as HTMLElement;
const valInvert = document.getElementById("valInvert") as HTMLElement;
const valSaturate = document.getElementById("valSaturate") as HTMLElement;
const valGrayscale = document.getElementById("valGrayscale") as HTMLElement;

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
    contrast: Number(sliderContrast.value),
    sepia: Number(sliderSepia.value),
    hueRotate: Number(sliderHueRotate.value),
    invert: Number(sliderInvert.value),
    saturate: Number(sliderSaturate.value),
    grayscale: Number(sliderGrayscale.value),
  };
}

function setSliders(c: CustomColors): void {
  sliderBrightness.value = String(c.brightness);
  sliderContrast.value = String(c.contrast);
  sliderSepia.value = String(c.sepia);
  sliderHueRotate.value = String(c.hueRotate);
  sliderInvert.value = String(c.invert);
  sliderSaturate.value = String(c.saturate);
  sliderGrayscale.value = String(c.grayscale);

  valBrightness.textContent = String(c.brightness);
  valContrast.textContent = String(c.contrast);
  valSepia.textContent = String(c.sepia);
  valHueRotate.textContent = String(c.hueRotate);
  valInvert.textContent = String(c.invert);
  valSaturate.textContent = String(c.saturate);
  valGrayscale.textContent = String(c.grayscale);
}

function renderPresets(userPresets: Preset[]): void {
  presetsRow.innerHTML = "";

  // Built-in chips
  for (const preset of BUILT_IN_PRESETS) {
    const chip = document.createElement("button");
    chip.className = "preset-chip preset-chip--builtin";
    chip.textContent = preset.name;
    chip.addEventListener("click", () => {
      setSliders(preset.colors);
      saveDebounced({ customColors: preset.colors });
    });
    presetsRow.appendChild(chip);
  }

  // User chips
  for (let i = 0; i < userPresets.length; i++) {
    const preset = userPresets[i];
    const chip = document.createElement("button");
    chip.className = "preset-chip preset-chip--user";

    const nameSpan = document.createElement("span");
    nameSpan.textContent = preset.name;

    const delBtn = document.createElement("span");
    delBtn.className = "preset-delete";
    delBtn.textContent = "×";
    delBtn.setAttribute("aria-label", `Delete ${preset.name}`);
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const updated = currentSettings.presets.filter((_, idx) => idx !== i);
      save({ presets: updated });
      renderPresets(updated);
    });

    chip.appendChild(nameSpan);
    chip.appendChild(delBtn);
    chip.addEventListener("click", () => {
      setSliders(preset.colors);
      saveDebounced({ customColors: preset.colors });
    });
    presetsRow.appendChild(chip);
  }
}

function save(settings: Partial<StoredSettings>): void {
  currentSettings = { ...currentSettings, ...settings };
  chrome.storage.sync.set(currentSettings);
}

// Debounced version for high-frequency inputs (slider dragging).
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
    customColors: { ...DEFAULT_SETTINGS.customColors, ...(stored as StoredSettings).customColors },
    presets: (stored as StoredSettings).presets ?? [],
    reinvertMedia: (stored as StoredSettings).reinvertMedia ?? false,
    smoothTransition: (stored as StoredSettings).smoothTransition ?? false,
  };
  setActive(currentSettings.theme);
  setSliders(currentSettings.customColors);
  renderPresets(currentSettings.presets);
  reinvertCheckbox.checked = currentSettings.reinvertMedia;
  transitionCheckbox.checked = currentSettings.smoothTransition;
});

// ---- Events ----

themeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const theme = btn.dataset["theme"] as ThemeName;
    setActive(theme);
    save({ theme });
  });
});

// All sliders share the same handler
const allSliders: Array<[HTMLInputElement, HTMLElement]> = [
  [sliderBrightness, valBrightness],
  [sliderContrast, valContrast],
  [sliderSepia, valSepia],
  [sliderHueRotate, valHueRotate],
  [sliderInvert, valInvert],
  [sliderSaturate, valSaturate],
  [sliderGrayscale, valGrayscale],
];

for (const [slider, valEl] of allSliders) {
  slider.addEventListener("input", () => {
    valEl.textContent = slider.value;
    saveDebounced({ customColors: readSliders() });
  });
}

// Reset — immediate, no debounce
resetBtn.addEventListener("click", () => {
  const d = DEFAULT_SETTINGS.customColors;
  setSliders(d);
  save({ customColors: d });
});

// Save preset
savePresetBtn.addEventListener("click", () => {
  const name = presetNameInput.value.trim();
  if (!name) return;
  const newPreset: Preset = { name, colors: readSliders() };
  const updated = [...currentSettings.presets, newPreset];
  save({ presets: updated });
  renderPresets(updated);
  presetNameInput.value = "";
});

// Allow Enter key in preset name field to trigger save
presetNameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") savePresetBtn.click();
});

// Toggles
reinvertCheckbox.addEventListener("change", () => {
  save({ reinvertMedia: reinvertCheckbox.checked });
});

transitionCheckbox.addEventListener("change", () => {
  save({ smoothTransition: transitionCheckbox.checked });
});
