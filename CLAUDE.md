# Notes for Claude

- Project: userscript (`amazon2016.user.js`) that restyles today's amazon.com to look like 2016.
- Planned scope order: header/nav/search + product pages (done) → search results (v0.3 first pass done) → cart → Your Account.
- Testing on live amazon.com with Playwright works in the cloud env once Chromium trusts the environment CAs:
  import every `O = Anthropic` cert from `/root/.ccr/ca-bundle.crt` into `sql:/root/.pki/nssdb` with `certutil -A -t "C,,"`.
  Use a persistent browser profile and click through Amazon's "Continue shopping" check. Direct `/s?k=` search URLs
  get blocked; type into `#twotabsearchtextbox` on the homepage and click `#nav-search-submit-button` instead.
  Amazon Basics AA batteries (B00MNV8E0C) is a good product page with lots of reviews.
- Wayback: `archive.org/wayback/available?url=…` works for finding snapshot URLs, but the snapshots themselves live on
  web.archive.org, which the environment's network policy blocks. Don't route around the policy; ask the user to allow it.
- Amazon's real markup changes often; prefer IDs (`#nav-belt`, `#nav-main`, `#nav-tools`, `#productTitle`, …) and keep DOM edits idempotent (the script re-runs on every mutation).
- `refs/amazon_home_2017-01-01.html` is a real Wayback capture of the homepage (2017-01-01 00:29 UTC, i.e. end of 2016).
  Its header markup confirms the nav layout (no "Deliver to" box in 2016). Its stylesheets/sprites point at
  images-na.ssl-images-amazon.com, which this environment blocks, so exact CSS values aren't available. Add more refs there.
