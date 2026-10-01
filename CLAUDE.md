# Notes for Claude

- Project: userscript (`amazon2016.user.js`) that restyles today's amazon.com to look like 2016.
- Planned scope order: header/nav/search + product pages (v0.1 done) → search results → cart → Your Account.
- The cloud environment can't reach amazon.com or web.archive.org, so test against a mock page with Playwright.
  Amazon's real markup changes often; prefer IDs (`#nav-belt`, `#nav-main`, `#nav-tools`, `#productTitle`, …) and keep DOM edits idempotent (the script re-runs on every mutation).
- User may add 2016 Wayback screenshots in `refs/` — check there first for reference.
