// ==UserScript==
// @name         Amazon 2016
// @namespace    https://github.com/meowmew124/amazon2016
// @version      0.3.1
// @description  Makes amazon.com look like it did in 2016: header, nav, search bar, search results and product pages.
// @match        https://www.amazon.com/*
// @match        https://amazon.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  // 2016 palette
  //   header      #232f3e (single color, no darker top belt yet)
  //   nav text    #ccc (line 1) / #fff bold (line 2)
  //   links       #0066c0, hover #c45500
  //   price       #B12704
  //   prime blue  #00a8e1

  const CSS = `
/* ---------- Global: 2016 typography, links, buttons ---------- */
body, body * { font-family: Arial, sans-serif !important; }
body { color: #111 !important; font-size: 13px; line-height: 19px; }

a, a:visited, .a-link-normal { color: #0066c0; }
a:hover, a:active, .a-link-normal:hover { color: #c45500; }

.a-button {
  border-radius: 3px !important;
  border: 1px solid !important;
  border-color: #adb1b8 #a2a6ac #8d9096 !important;
  background: linear-gradient(to bottom, #f7f8fa, #e7e9ec) !important;
  box-shadow: 0 1px 0 rgba(255,255,255,.6) inset !important;
}
.a-button:hover {
  border-color: #a2a6ac #979aa1 #82858a !important;
  background: linear-gradient(to bottom, #e7eaf0, #d9dce1) !important;
}
.a-button .a-button-inner { border-radius: 2px !important; background: transparent !important; box-shadow: none !important; }
.a-button .a-button-text, .a-button a.a-button-text { color: #111 !important; font-size: 13px !important; text-decoration: none !important; }

/* Yellow "Add to Cart" */
.a-button-primary,
#submit\\.add-to-cart, span.a-button:has(> .a-button-inner > #add-to-cart-button) {
  border-color: #a88734 #9c7e31 #846a29 !important;
  background: linear-gradient(to bottom, #f7dfa5, #f0c14b) !important;
}
.a-button-primary:hover,
#submit\\.add-to-cart:hover, span.a-button:has(> .a-button-inner > #add-to-cart-button):hover {
  border-color: #a88734 #9c7e31 #846a29 !important;
  background: linear-gradient(to bottom, #f5d78e, #eeb933) !important;
}

/* Orange "Buy Now" */
.a-button-oneclick,
#submit\\.buy-now, span.a-button:has(> .a-button-inner > #buy-now-button) {
  border-color: #ca7c1b #be751a #a56616 !important;
  background: linear-gradient(to bottom, #f6c88f, #ed9220) !important;
}
.a-button-oneclick:hover,
#submit\\.buy-now:hover, span.a-button:has(> .a-button-inner > #buy-now-button):hover {
  border-color: #ca7c1b #be751a #a56616 !important;
  background: linear-gradient(to bottom, #f4bb76, #e8830e) !important;
}

.a-box, .a-box .a-box-inner { border-radius: 4px !important; }
.a-input-text { border-radius: 3px !important; border-color: #a6a6a6 #949494 #888 !important; }
.a-color-price { color: #B12704 !important; }

/* ---------- Header ---------- */
#navbar, #nav-belt, #nav-main {
  background: #232f3e !important;
}
#nav-belt {
  display: flex !important;
  align-items: center !important;
  height: 60px !important;
}
#nav-main {
  display: flex !important;
  align-items: stretch !important;
  height: 39px !important;
  padding: 0 !important;
}
#nav-belt > .nav-left, #nav-main > .nav-left  { order: 1; flex: 0 0 auto; float: none !important; display: flex !important; align-items: center; }
#nav-belt > .nav-fill, #nav-main > .nav-fill  { order: 2; flex: 1 1 auto; min-width: 0; width: auto !important; }
#nav-belt > .nav-right, #nav-main > .nav-right { order: 3; flex: 0 0 auto; float: none !important; display: flex !important; align-items: stretch; }

/* Logo + "Try Prime" tagline */
#nav-logo { position: relative; padding-bottom: 8px !important; margin: 0 6px 0 2px !important; }
#nav-logo .nav-logo-locale, #nav-logo #logo-ext { display: none !important; }
#a16-logo-tagline {
  position: absolute; right: 4px; bottom: 0;
  font-size: 12px; line-height: 12px; color: #00a8e1 !important;
  text-decoration: none !important; white-space: nowrap;
}
#a16-logo-tagline:hover { text-decoration: underline !important; }

/* Search bar */
#nav-fill-search, #nav-search { margin: 0 20px 0 6px !important; }
#nav-search-bar-form, #nav-search .nav-searchbar {
  height: 35px !important;
  border-radius: 4px !important;
  box-shadow: none !important;
}
#nav-search-bar-form:focus-within { box-shadow: 0 0 3px 2px rgba(228,121,17,.5) !important; }
#nav-search-dropdown-card .nav-search-scope, .nav-search-scope {
  background: #f3f3f3 !important;
  color: #555 !important;
  border-right: 1px solid #cdcdcd !important;
  border-radius: 4px 0 0 4px !important;
}
.nav-search-scope:hover { background: #dadada !important; }
.nav-search-label { font-size: 12px !important; color: #555 !important; }
#twotabsearchtextbox { font-size: 15px !important; color: #111 !important; }
.nav-search-submit, .nav-search-submit .nav-search-submit-text {
  background-color: #febd69 !important;
  border-radius: 0 4px 4px 0 !important;
  height: 35px !important;
}
#nav-search-submit-button { background: transparent !important; height: 35px !important; }
#nav-search-submit-text-agent { display: none !important; }
.nav-search-submit:hover, .nav-search-submit:hover .nav-search-submit-text { background-color: #f3a847 !important; }

/* Promo on the right of the belt: Amazon's own banner if there is one, else ours */
#nav-belt #nav-swmslot { display: flex !important; align-items: center; width: 400px; height: 60px; padding-right: 10px; overflow: hidden; }
#nav-belt #nav-swmslot img { max-width: 400px; max-height: 39px; }
#a16-swm {
  display: flex; flex-direction: column; justify-content: center;
  width: 380px; height: 60px; padding-right: 14px;
  text-decoration: none !important;
}
#a16-swm .a16-swm-small { font-size: 12px; line-height: 14px; color: #00a8e1; font-weight: bold; }
#a16-swm .a16-swm-big   { font-size: 20px; line-height: 24px; color: #fff; font-weight: bold; }
#a16-swm .a16-swm-big b { color: #febd69; }
#a16-swm:hover .a16-swm-big { text-decoration: underline; }
@media (max-width: 1100px) { #a16-swm, #nav-belt #nav-swmslot { display: none !important; } }

/* Things 2016 didn't have */
#icp-nav-flyout, #nav-main #nav-tools > #icp-nav-flyout, #nav-global-location-slot, #nav-main #nav-swmslot { display: none !important; }
#nav-main #nav-tools .nav-flyout-button { display: none !important; }
#nav-main #nav-cart .nav-arrow { display: none !important; }

/* Second row: Departments, links, account/orders/prime/cart (no "Deliver to" in 2016) */
#nav-main .nav-left { padding-left: 4px; }
#nav-main .nav-line-1 {
  font-size: 12px !important; line-height: 14px !important; color: #ccc !important; font-weight: normal !important;
}
#nav-main .nav-line-2 {
  font-size: 13px !important; line-height: 15px !important; color: #fff !important; font-weight: bold !important;
}

#nav-hamburger-menu {
  display: flex !important; align-items: flex-end !important;
  height: 39px !important; padding: 0 9px 7px !important;
  color: #fff !important; font-weight: bold !important; font-size: 13px !important;
}
#nav-hamburger-menu .hm-icon { display: none !important; }
#nav-hamburger-menu .hm-icon-label { font-size: 13px !important; font-weight: bold !important; color: #fff !important; }

.a16-caret {
  display: inline-block; width: 0; height: 0; margin-left: 4px; vertical-align: middle;
  border: 4px solid transparent; border-top: 5px solid #a7acb2; border-bottom: 0;
}

#nav-xshop-container, #nav-xshop { height: 39px !important; display: flex !important; flex-direction: row !important; align-items: flex-end !important; justify-content: flex-start !important; overflow: hidden; }
#nav-xshop { margin: 0 !important; padding: 0 0 0 6px !important; list-style: none !important; }
#nav-xshop .nav-li, #nav-xshop .nav-div { display: flex; align-items: flex-end; }
#nav-xshop a.nav-a {
  font-size: 13px !important; color: #ccc !important; padding: 0 9px 8px !important;
  white-space: nowrap; text-decoration: none !important; border: 0 !important;
}
#nav-xshop a.nav-a:hover { color: #fff !important; }

#nav-main #nav-tools {
  display: flex !important; align-items: stretch !important;
  height: 39px !important; padding: 0 6px 0 0 !important; float: none !important;
}
#nav-main #nav-tools > .nav-div,
#nav-main #nav-tools > a.nav-a {
  display: flex !important; flex-direction: column !important; justify-content: flex-end !important;
  height: 39px !important; padding: 0 9px 6px !important; margin: 0 !important;
  box-sizing: border-box; text-decoration: none !important; float: none !important;
}
#nav-main #nav-link-accountList > a.nav-a { display: flex !important; flex-direction: column !important; justify-content: flex-end !important; height: 33px !important; padding: 0 !important; text-decoration: none !important; }
#nav-main #nav-tools .nav-line-1-container { height: auto !important; line-height: 14px !important; }
#nav-main #nav-orders .nav-line-1:empty { display: none !important; }
#nav-main #nav-cart { position: relative !important; }
#nav-main #nav-cart-count-container {
  position: absolute !important; left: 9px !important; bottom: 7px !important; top: auto !important;
  width: 38px !important; height: 26px !important; margin: 0 !important;
}
#nav-main #nav-cart .nav-cart-icon { position: absolute !important; left: 0 !important; top: 0 !important; }
#nav-main #nav-cart .nav-cart-count {
  position: absolute !important; left: 9px !important; top: -4px !important; width: 19px !important;
  text-align: center !important; font-size: 13px !important; line-height: 16px !important;
  color: #f08804 !important; font-weight: bold !important; margin: 0 !important;
}
#nav-main #nav-cart-text-container .nav-line-1 { display: none !important; }
#nav-main #nav-cart-text-container .nav-line-2 { padding-bottom: 1px; }

/* ---------- Product page ---------- */
#productTitle { font-size: 21px !important; line-height: 1.3 !important; font-weight: normal !important; color: #111 !important; }
#bylineInfo { font-size: 13px !important; }
#feature-bullets > h1, #feature-bullets > h2 { display: none !important; }
#feature-bullets li { font-size: 13px !important; line-height: 19px !important; }

/* Flat red price instead of the big superscript one */
#corePriceDisplay_desktop_feature_div .a-price,
#corePrice_feature_div .a-price,
#corePrice_desktop .a-price,
#apex_desktop .a-price,
#buybox .a-price {
  color: #B12704 !important;
}
#corePriceDisplay_desktop_feature_div .a-price :is(span:not(.a-offscreen), .a-price-symbol, .a-price-whole, .a-price-decimal, .a-price-fraction),
#corePrice_feature_div .a-price :is(span:not(.a-offscreen), .a-price-symbol, .a-price-whole, .a-price-decimal, .a-price-fraction),
#corePrice_desktop .a-price :is(span:not(.a-offscreen), .a-price-symbol, .a-price-whole, .a-price-decimal, .a-price-fraction),
#apex_desktop .a-price :is(span:not(.a-offscreen), .a-price-symbol, .a-price-whole, .a-price-decimal, .a-price-fraction),
#buybox .a-price :is(span:not(.a-offscreen), .a-price-symbol, .a-price-whole, .a-price-decimal, .a-price-fraction) {
  font-size: 17px !important; line-height: 21px !important;
  vertical-align: baseline !important; position: static !important; top: 0 !important;
  font-weight: normal !important; opacity: 1 !important;
}
#centerCol #corePriceDisplay_desktop_feature_div .priceToPay::before,
#centerCol #corePrice_feature_div .a-price:first-of-type::before {
  content: "Price: "; color: #555; font-size: 13px; margin-right: 4px; vertical-align: baseline;
}
#corePriceDisplay_desktop_feature_div .savingsPercentage { font-size: 13px !important; color: #B12704 !important; }

#buybox .a-box, #desktop_buybox .a-box { border-color: #ddd !important; }
/* ---------- Search results ---------- */
.a16-hidden { display: none !important; }
.s-desktop-toolbar { box-shadow: none !important; border-bottom: 1px solid #ddd !important; }
/* the "Results / Check each product page..." heading */
.s-main-slot > .s-result-item:has(.s-messaging-widget-results-header) { display: none !important; }

/* Plain white tiles: no card borders, no grey image backdrop */
[data-component-type="s-search-result"] .s-card-container,
[data-component-type="s-search-result"] .puis-card-container {
  border: 0 !important; border-radius: 0 !important; box-shadow: none !important; background: #fff !important;
}
[data-component-type="s-search-result"] .s-product-image-container,
[data-component-type="s-search-result"] .puis-status-badge-container { background: #fff !important; }
[data-component-type="s-search-result"] .s-image-overlay-grey::after,
[data-component-type="s-search-result"] .puis-image-overlay-grey::after { display: none !important; }

/* Blue title, with "by Brand" underneath */
[data-component-type="s-search-result"] .s-title-instructions-style a h2,
[data-component-type="s-search-result"] .s-title-instructions-style a h2 span {
  color: #0066c0 !important; font-size: 14px !important; line-height: 19px !important; font-weight: normal !important;
}
[data-component-type="s-search-result"] .s-title-instructions-style a:hover h2 span { color: #c45500 !important; text-decoration: underline; }
.a16-by, .a16-by h2, .a16-by span { font-size: 12px !important; line-height: 16px !important; color: #555 !important; font-weight: normal !important; }
.a16-by h2 > span::before { content: "by "; }

/* Stars ▾ 955,442 (no "4.7" in front) */
[data-component-type="s-search-result"] .a-row.a-size-small > span.a-size-small.a-color-base[aria-hidden="true"] { display: none !important; }
[data-component-type="s-search-result"] a[aria-label$=" ratings"] span,
[data-component-type="s-search-result"] a[aria-label$=" rating"] span { color: #0066c0 !important; font-size: 13px !important; }

/* Bold red price */
[data-component-type="s-search-result"] .a-price:not(.a-text-price) { color: #B12704 !important; }
[data-component-type="s-search-result"] .a-price:not(.a-text-price) :is(span:not(.a-offscreen), .a-price-symbol, .a-price-whole, .a-price-decimal, .a-price-fraction) {
  font-size: 15px !important; line-height: 19px !important; font-weight: bold !important;
  vertical-align: baseline !important; position: static !important; top: 0 !important; opacity: 1 !important;
}
[data-component-type="s-search-result"] .udm-delivery-block { font-size: 12px !important; line-height: 16px !important; }

/* Sustainability badges didn't exist in 2016 */
[data-component-type="s-search-result"] .s-pc-faceout-container,
#climatePledgeFriendlyATF_feature_div, #climatePledgeFriendly { display: none !important; }
`;

  function injectStyle() {
    const root = document.head || document.documentElement;
    if (!root || document.getElementById('a16-style')) return;
    const style = document.createElement('style');
    style.id = 'a16-style';
    style.textContent = CSS;
    root.appendChild(style);
  }

  const $ = (sel, root = document) => root.querySelector(sel);

  function el(tag, props = {}, children = []) {
    const node = document.createElement(tag);
    Object.assign(node, props);
    for (const child of children) node.append(child);
    return node;
  }

  function caret() {
    return el('span', { className: 'a16-caret' });
  }

  // Returns true the first time it's called for a given element + key.
  function once(node, key) {
    const attr = 'a16' + key;
    if (!node || node.dataset[attr]) return false;
    node.dataset[attr] = '1';
    return true;
  }

  function childByClass(parent, cls) {
    for (const child of parent.children) {
      if (child.classList.contains(cls)) return child;
    }
    const created = el('div', { className: cls });
    parent.appendChild(created);
    return created;
  }

  const XSHOP_LINKS = [
    ['Your Amazon.com', '/gp/yourstore/home'],
    ["Today's Deals", '/gp/goldbox'],
    ['Gift Cards & Registry', '/gift-cards'],
    ['Sell', '/sell'],
    ['Help', '/gp/help/customer/display.html'],
  ];

  function restyleHeader() {
    const belt = $('#nav-belt');
    const main = $('#nav-main');
    if (!belt || !main) return;

    const beltRight = childByClass(belt, 'nav-right');
    const mainRight = childByClass(main, 'nav-right');

    // "Try Prime" under the logo
    const logo = $('#nav-logo');
    if (logo && !$('#a16-logo-tagline')) {
      logo.appendChild(el('a', { id: 'a16-logo-tagline', className: 'nav-a', href: '/amazonprime', textContent: 'Try Prime' }));
    }

    // Account / orders / cart move down to the second row
    const tools = $('#nav-tools');
    if (tools && tools.parentElement !== mainRight) mainRight.appendChild(tools);

    // Promo where the account links used to be
    const swm = $('#nav-swmslot');
    if (swm && swm.parentElement !== beltRight) beltRight.appendChild(swm);
    if (!swm && !$('#a16-swm')) {
      beltRight.appendChild(el('a', { id: 'a16-swm', href: '/amazonprime' }, [
        el('span', { className: 'a16-swm-small', textContent: 'Amazon Prime' }),
        el('span', { className: 'a16-swm-big', innerHTML: '<b>FREE</b> Two-Day Shipping' }),
      ]));
    }

    // "All" hamburger becomes "Departments"
    const hm = $('#nav-hamburger-menu');
    if (hm && once(hm, 'Dept')) {
      let label = hm.querySelector('.hm-icon-label');
      if (!label) {
        label = el('span', { className: 'hm-icon-label' });
        hm.appendChild(label);
      }
      label.textContent = 'Departments';
      label.after(caret());
    }

    // 2016 link row
    const xshop = $('#nav-xshop');
    if (xshop && once(xshop, 'Links')) {
      xshop.textContent = '';
      for (const [text, href] of XSHOP_LINKS) {
        const link = el('a', { className: 'nav-a', href, textContent: text });
        xshop.appendChild(xshop.tagName === 'UL'
          ? el('li', { className: 'nav-li' }, [el('div', { className: 'nav-div' }, [link])])
          : link);
      }
    }

    // "Hello, sign in" -> "Hello. Sign in"
    const accountLine1 = $('#nav-link-accountList-nav-line-1');
    if (accountLine1 && /^\s*hello,\s*sign in\s*$/i.test(accountLine1.textContent)) {
      accountLine1.textContent = 'Hello. Sign in';
    }

    // "Account & Lists ▾" (Amazon now uses a separate flyout button for the arrow)
    const accountLine2 = $('#nav-link-accountList .nav-line-2');
    if (accountLine2 && once(accountLine2, 'Caret')) accountLine2.append(caret());

    // "Returns & Orders" -> "Orders"
    const orders = $('#nav-orders');
    if (orders && once(orders, 'Orders')) {
      const line1 = orders.querySelector('.nav-line-1');
      const line2 = orders.querySelector('.nav-line-2');
      if (line1) line1.textContent = '';
      if (line2) line2.textContent = 'Orders';
    }

    // "Try Prime" dropdown-style link before the cart
    const cart = $('#nav-cart');
    if (cart && cart.parentElement === tools && !$('#a16-nav-prime')) {
      cart.before(el('a', { id: 'a16-nav-prime', className: 'nav-a nav-a-2', href: '/amazonprime' }, [
        el('span', { className: 'nav-line-1' }),
        el('span', { className: 'nav-line-2' }, ['Try Prime', caret()]),
      ]));
    }
  }

  function restyleProductPage() {
    // "1,234 ratings" or "(1,234)" -> "1,234 customer reviews"
    const reviews = $('#acrCustomerReviewText');
    const match = reviews && reviews.textContent.match(/^\s*\(?\s*([\d,.]+)\s*(ratings?)?\s*\)?\s*$/i);
    if (match) {
      reviews.textContent = match[1] + (match[1] === '1' ? ' customer review' : ' customer reviews');
    }
  }

  function restyleSearchResults() {
    for (const item of document.querySelectorAll('[data-component-type="s-search-result"]')) {
      // Wait until the card has rendered, then do it once
      if (!item.querySelector('.s-title-instructions-style') || !once(item, 'Result')) continue;

      // Brand row above the title -> "by Brand" below it
      const titleBlock = item.querySelector('.s-title-instructions-style');
      const brandRow = titleBlock && titleBlock.querySelector(':scope > .a-row.a-color-secondary');
      const titleLink = titleBlock && titleBlock.querySelector(':scope > a');
      if (brandRow && titleLink) {
        brandRow.classList.add('a16-by');
        titleLink.after(brandRow);
      }

      // "(955.4K)" -> "955,442", using the exact count from the link's label
      const countLink = item.querySelector('a[aria-label$=" ratings"], a[aria-label$=" rating"]');
      const count = countLink && countLink.getAttribute('aria-label').match(/^([\d,]+) ratings?$/);
      const countText = countLink && countLink.querySelector('span');
      if (count && countText) countText.textContent = count[1];

      // "100K+ bought in past month" wasn't a thing
      for (const span of item.querySelectorAll('span.a-color-secondary')) {
        const row = span.closest('.a-row');
        if (row && /bought in past month/i.test(span.textContent)) row.classList.add('a16-hidden');
      }
    }
  }

  let queued = false;
  function run() {
    queued = false;
    injectStyle();
    try {
      restyleHeader();
      restyleProductPage();
      restyleSearchResults();
    } catch (err) {
      console.error('[amazon2016]', err);
    }
  }
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(run);
  }

  injectStyle();
  // Amazon fills parts of the header and page in after load, so re-apply on changes.
  // Every step above is a no-op once applied, so this settles after one pass.
  new MutationObserver(schedule).observe(document, { childList: true, subtree: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
