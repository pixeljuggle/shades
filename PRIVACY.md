# Shades — Chrome Web Store Privacy & Submission Notes

A reference document for completing the Privacy Practices tab and other requirements when publishing to the Chrome Web Store.

---

## Single Purpose Description

> **"Shades applies visual colour themes — including dark mode, sepia, night, and custom tints — to any website to reduce eye strain."**

Paste this into the **Single purpose description** field on the store listing page.

---

## Permission Justifications

### `host_permissions` — `<all_urls>`

> Shades needs access to all URLs so it can apply the user's chosen colour theme to whichever website they are currently visiting. Without broad host access the extension would only work on a hard-coded list of domains, defeating its purpose as a universal theming tool. The extension does not read, collect, or transmit any page content — it only injects a CSS `filter` rule or a transparent overlay `<div>` element onto the page.

### `scripting`

> The `scripting` permission is used solely to inject a small CSS stylesheet (`styles.css`) into pages. This stylesheet applies CSS filter rules (`invert`, `sepia`, `brightness`, `hue-rotate`) that change the visual appearance of the page. No page content is read, extracted, or sent anywhere.

### `storage`

> The `storage` permission is used to save the user's theme preference (Default, Dark, Sepia, Night, or Custom) and their chosen tint colour locally in Chrome's sync storage. This allows the preference to persist across browser sessions and sync across the user's own devices. No personal data, browsing history, or page content is stored.

### Remote Code

> Shades does **not** execute any remote code. All JavaScript and CSS is bundled locally inside the extension package at install time. The extension makes no network requests of any kind. There are no external scripts, CDN resources, analytics libraries, or tracking pixels.

---

## Data Usage Certification Checklist

When completing the Privacy Practices tab, use the following answers:

| Question | Answer |
|---|---|
| Does the extension collect any user data? | **No** |
| Does it use any data for purposes other than the extension's single purpose? | **No** |
| Does it sell user data to third parties? | **No** |
| Does it use or transfer data for creditworthiness or lending purposes? | **No** |
| Does it use or transfer data for advertising purposes? | **No** |

---

## Things You Must Do Manually

These cannot be completed from code — they require action on your Chrome Web Store developer account:

1. **Contact email** — Go to the **Account** tab in the developer dashboard and enter a valid contact email address.
2. **Email verification** — After entering your email, verify it using the link Chrome Web Store sends you.
3. **Screenshots / video** — Upload at least one screenshot (1280×800 or 640×400 px) showing the extension in use. Suggested shots:
   - Popup open with the Dark theme selected, applied to a website
   - Popup open with Sepia selected
   - Before/after comparison (Default vs Dark)
4. **Privacy Practices tab** — Paste the justifications above into the relevant fields and check the data usage certification checkbox.

---

## What the Extension Actually Does (Technical Summary)

For full transparency when reviewers inspect the code:

- **Content script (`content.ts`):** Reads the saved theme from `chrome.storage.sync` and either sets a `data-gdm-theme` attribute on `<html>` (for Dark/Sepia/Night) or appends a fixed-position, pointer-events-none `<div>` overlay with a `mix-blend-mode: multiply` tint colour (for Custom theme). It never reads, accesses, or transmits any page content.
- **Stylesheet (`styles.css`):** Applies CSS `filter` rules scoped to the `data-gdm-theme` attribute. No JavaScript logic.
- **Service worker (`service-worker.ts`):** Initialises default settings on install and updates the toolbar badge colour to reflect the active theme. Makes no network requests.
- **Popup (`popup.ts`):** Renders the theme picker UI. Writes the user's selection to `chrome.storage.sync`. No network requests.
- **Data flow:** All data stays on-device inside `chrome.storage.sync`. Nothing leaves the browser.
