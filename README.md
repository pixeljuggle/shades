# Shades

A lightweight Chrome extension that applies comfortable reading themes — dark mode, sepia, night, and custom colour tints — to any website.

---

## Themes

| Theme | Effect |
|-------|--------|
| **Default** | No change — restores the page to its original appearance |
| **Dark** | Soft invert + hue rotation. Easy on the eyes in low light |
| **Sepia** | Warm sepia tone, similar to a Kindle's paper display |
| **Night** | Full invert + hue rotation for maximum contrast reduction |
| **Custom** | Pick any colour to wash over the page as a translucent tint |

---

## Privacy — no data is collected or transmitted

Shades does **not**:
- Read, collect, or transmit any page content, form data, or personal information
- make any network requests of its own
- track browsing history or visited URLs
- communicate with any external server

Shades **only**:
- Injects a small CSS stylesheet that applies a `filter` to the `<html>` element (dark / sepia / night modes)
- For the custom theme: appends a single `<div>` element with `pointer-events: none` and `mix-blend-mode: multiply` to tint the page — it cannot receive clicks or read content beneath it
- Saves your chosen theme and tint colour to Chrome's built-in `storage.sync` so your preference follows you across your own devices. This data never leaves Chrome's own sync infrastructure and is never sent to any third party

The extension requires the `storage` permission solely to remember your theme preference, and `scripting` / `host_permissions` solely to inject the CSS filter onto the page you are currently viewing.

---

## How it works

### Built-in themes (Dark, Sepia, Night)

A CSS rule is added to the page's `<html>` element via a data attribute:

```css
/* Dark */
html[data-gdm-theme="dark"]  { filter: invert(90%) hue-rotate(180deg); }

/* Night */
html[data-gdm-theme="night"] { filter: invert(100%) hue-rotate(180deg); }

/* Sepia */
html[data-gdm-theme="sepia"] { filter: sepia(45%) brightness(96%); }
```

Images and videos are counter-inverted so they keep their natural colours in dark and night modes.

### Custom tint

A transparent `<div>` is placed over the page:

```
position: fixed  •  inset: 0  •  pointer-events: none  •  mix-blend-mode: multiply
```

`pointer-events: none` means the overlay is completely invisible to mouse and keyboard interaction — it cannot intercept clicks, selections, or form input. `mix-blend-mode: multiply` blends the chosen colour with the page beneath it without obscuring any content.

---

## Development

**Prerequisites:** Node.js ≥ 18

```bash
# Install dependencies
npm install

# Build once
npm run build

# Watch mode (rebuilds on save)
npm run dev
```

The compiled extension is output to `dist/`. Load it in Chrome via `chrome://extensions` → **Load unpacked** → select the `dist` folder.

**Stack:** TypeScript · Vite · [@crxjs/vite-plugin](https://crxjs.dev/vite-plugin) · [Lucide](https://lucide.dev) icons

---

## Permissions explained

| Permission | Why it's needed |
|------------|-----------------|
| `storage` | Saves your theme preference locally via Chrome's sync storage |
| `scripting` | Allows the extension to inject the CSS filter into the active page |
| `host_permissions: <all_urls>` | Enables the theme to be applied to any website you choose to use it on |

No permission is used to read, copy, or transmit any content from any page.
