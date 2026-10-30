# Fixa PWA — Install & Offline Behaviour
Status: candidate / 2026-10-30
Scope: no database migration; existing authenticated repair workflow remains unchanged.

## Identity
- App title: Fixa — Repair Workspace.
- Install entry: `/app` (existing account or login flow).
- Brand colours: Fixa dark green, cream and olive period.
- Image assets: dynamic image responses at `/pwa-192.png`, `/pwa-512.png` and `/pwa-maskable-512.png` plus Next.js generated Apple touch icon. Wordmark is the approved text `fixa.`, with period on the baseline.
- Install manifest: `/manifest.webmanifest`, scope `/`, `standalone` display, secure HTTPS.

## Installation behaviour
- Root provider registers `/sw.js` over HTTPS; listens for `beforeinstallprompt` and `appinstalled`.
- A visible suggestion appears **only inside the authenticated /app overview**, on mobile (<=760px), when:
  - at least one real repair job exists;
  - two meaningfully separated dashboard visits were recorded (>=30 min apart, not repeated refreshes);
  - the second visit has been in view for 15 seconds;
  - the browser offers a real native install event, or supported iPhone Safari manual instructions;
  - the app isn't already running in standalone mode;
  - any previous 90-day dismissal has expired.
- No banners on landing pages, jobs, data entry, ticket links, sign-up, support, or discovery.
- Install opens the OS browser prompt **only after pressing Install**. A cancelled install or Not now snoozes the suggestion for 90 days. Installed apps hide the suggestion.
- iOS Safari does not support the browser install event. The same quiet control explains Share > Add to Home Screen only when the user asks.

## Private data and offline safety
- Service worker uses **network-first navigations** with a cached generic `/offline` page as a fallback only when the network request fails.
- The SW **does not cache authenticated pages, job records, customer data, devices, session cookies, forms, API responses or account pages**. It cannot promise offline repair management or queued writes.
- The cached public offline page provides a retry action. No background sync and no notifications.
- On upgrades, SW removes only caches prefixed `fixa-offline-` other than the active cache.
- `/sw.js` is served with revalidation headers; users do not need to reinstall for a normal code deploy.

## Browser & release checks
1. Validate manifest/icons at 192, 512, maskable 512 and Apple 180px on HTTPS.
2. Verify Android Chrome and Android Edge install native prompt on tap; no auto display.
3. Verify iPhone Safari Add to Home Screen guidance, including 320px viewport.
4. Verify installed standalone start URL resolves to authenticated workspace or login.
5. Verify 1st visit, repeated refresh, no-jobs state, inactive browser, 90-day dismissal and installed mode never show unwanted suggestion.
6. Open an authenticated repair in airplane mode: only the generic offline page appears. Reload on reconnect; confirm fresh data. No cached customer response may be accessible through CacheStorage.
7. Test logout, login, ticket and repair mutation flows with SW installed. Validate deployment rollback and cached offline-shell version updates.
8. Run lint, strict typecheck, unit tests and production build; visually inspect before merging.

Browser-native installation support varies. A compliant manifest/HTTPS can enable installation, but a browser-controlled prompt is not guaranteed on every device.
