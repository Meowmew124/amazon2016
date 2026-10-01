# Notes for Claude

- Project: userscript (`amazon2016.user.js`) that restyles today's amazon.com to look like 2016.
- Planned scope order: header/nav/search + product pages (v0.1 done) → search results → cart → Your Account.
- Testing on live amazon.com with Playwright works in the cloud env once Chromium trusts the environment CAs:
  import every `O = Anthropic` cert from `/root/.ccr/ca-bundle.crt` into `sql:/root/.pki/nssdb` with `certutil -A -t "C,,"`.
  Use a persistent browser profile and click through Amazon's "Continue shopping" check. Direct `/s?k=` search URLs
  get blocked; reach pages by clicking links from the homepage instead. web.archive.org resets connections from here.
- Amazon's real markup changes often; prefer IDs (`#nav-belt`, `#nav-main`, `#nav-tools`, `#productTitle`, …) and keep DOM edits idempotent (the script re-runs on every mutation).
- User may add 2016 Wayback screenshots in `refs/` — check there first for reference.
