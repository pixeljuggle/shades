# Privacy Policy — Shades

_Last updated: March 2026_

---

## Overview

Shades is a browser extension that applies visual colour themes (dark mode, sepia, night, and custom tints) to websites to reduce eye strain. This policy explains what data the extension does and does not collect.

**The short version: Shades collects no personal data, records no browsing activity, and makes no network requests. Everything stays on your device.**

---

## Data Collection

Shades does **not** collect, store, transmit, or share any of the following:

- Personal information (name, email address, IP address, etc.)
- Browsing history or the URLs you visit
- Page content or any information displayed on pages you view
- Keystrokes, form inputs, or any interaction data
- Device identifiers or fingerprinting information

---

## Data the Extension Stores Locally

Shades saves one thing to Chrome's built-in sync storage (`chrome.storage.sync`):

| Data | Purpose |
|---|---|
| Your chosen theme (e.g. "Dark", "Sepia") | So your preference is remembered across sessions |
| Your custom tint colour (a hex colour value) | So your custom theme is restored when you reopen the browser |

This data:
- **Never leaves your device** in a way accessible to the extension's developer or any third party
- Is synced by Chrome across your own devices if you have Chrome Sync enabled — this is controlled entirely by Google's own infrastructure and settings, not by Shades
- Can be cleared at any time by removing the extension

---

## How the Extension Works

When you select a theme, Shades:

1. Saves your preference to `chrome.storage.sync` (local to your browser)
2. Injects a CSS `filter` rule onto the current page (e.g. `invert`, `sepia`, `brightness`) — this is a purely visual change
3. For the Custom theme, adds a transparent `<div>` overlay on top of the page using a multiply blend mode to apply the tint colour

No page content is read. No data is sent to any server. The extension has no backend, no analytics, and no tracking of any kind.

---

## Third Parties

Shades does **not**:

- Share any data with third parties
- Use any analytics or crash-reporting services
- Load any external scripts, fonts, or resources at runtime
- Make any network requests whatsoever

All code is bundled locally inside the extension package at install time.

---

## Permissions Explained

| Permission | Why it's needed |
|---|---|
| `storage` | To save your theme preference locally so it persists between sessions |
| `scripting` | To inject the CSS stylesheet that applies visual filters to pages |
| `host_permissions: <all_urls>` | So themes can be applied to any website you choose to use them on — the extension does not read or extract content from those pages |

---

## Children's Privacy

Shades does not collect any data from anyone, including children under the age of 13.

---

## Changes to This Policy

If this policy is ever updated, the "Last updated" date at the top of this document will be revised. Given that this extension collects no data, substantive changes to this policy are unlikely.

---

## Contact

If you have any questions about this privacy policy or how Shades works, please open an issue on the project's GitHub repository or contact the developer via the Chrome Web Store listing page.
