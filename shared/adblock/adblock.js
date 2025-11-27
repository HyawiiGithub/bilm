(async () => {
  console.log('[Universal Adblock] Running (parent-level defenses)...');

  // Quick, safe parent-level removal of elements that look like ads/overlays.
  // NOTE: we intentionally avoid touching the #videoPlayer iframe (in viewers) to not break playback.

  const adNameRE = /(^|\b)(ad|ads|advert|advertisement|sponsor|sponsored|popup|overlay|promo)(\b|$)/i;

  function looksLikeAd(el) {
    if (!el || !(el instanceof Element)) return false;
    // Skip the main player iframe or anything inside #playerContainer (we don't want to break playback)
    if (el.id === 'videoPlayer' || el.closest && el.closest('#playerContainer')) return false;

    const id = (el.id || '') + '';
    const cls = (el.className || '') + '';
    const title = (el.title || '') + '';
    const alt = (el.alt || '') + '';
    const aria = (el.getAttribute && (el.getAttribute('aria-label') || el.getAttribute('role')) || '') + '';

    return [id, cls, title, alt, aria].some(v => adNameRE.test(v));
  }

  function removeAdLike(el) {
    try {
      if (!el || !(el instanceof Element)) return false;
      if (looksLikeAd(el)) {
        console.info('[Universal Adblock] Removed parent ad element:', el);
        el.remove();
        return true;
      }

      // Also check if the element's src/href points to known ad domains (lightweight check)
      const src = el.src || el.href || el.getAttribute && el.getAttribute('data-src') || '';
      if (src && /doubleclick|googlesyndication|adservice|adserver|adsystem|adsafe|adrotate|track/gi.test(src)) {
        if (el.id === 'videoPlayer' || el.closest && el.closest('#playerContainer')) return false;
        console.info('[Universal Adblock] Removed by src match:', el, src);
        el.remove();
        return true;
      }
    } catch (e) {
      // ignore errors — don't block page
    }
    return false;
  }

  function blockAds() {
    // Be conservative: check a limited set of nodes in the parent document
    const candidates = document.querySelectorAll('div,ins,iframe,script,link,aside,section,header,footer,img,video');
    candidates.forEach(removeAdLike);
  }

  blockAds();

  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      m.addedNodes.forEach(node => {
        if (!(node instanceof Element)) return;
        removeAdLike(node);
        try {
          node.querySelectorAll && node.querySelectorAll('*').forEach(removeAdLike);
        } catch (e) {}
      });
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });

  // Optionally: attempt a lightweight uAssets import to extend host checks (keeps requests short/fast)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch('https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/filters.txt', { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      const txt = await res.text();
      const entries = txt.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('!') && !l.startsWith('@@'));
      // Limit to a small working set to avoid huge regex costs on page load
      const hosts = entries
        .filter(l => l.startsWith('||'))
        .slice(0, 200)
        .map(l => l.replace(/^\|\|/, '').split('^')[0])
        .filter(Boolean);

      const hostRegex = hosts.map(h => new RegExp(h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));

      function removeBySrc() {
        document.querySelectorAll('iframe,script,link,img,video,embed,object').forEach(el => {
          if (!el || !(el instanceof Element)) return;
          if (el.id === 'videoPlayer' || el.closest && el.closest('#playerContainer')) return; // keep real player
          const src = el.src || el.href || el.getAttribute && el.getAttribute('data-src') || '';
          if (src && hostRegex.some(rx => rx.test(src))) {
            console.info('[Universal Adblock] Removed (uAssets):', el, src);
            el.remove();
          }
        });
      }

      removeBySrc();
      new MutationObserver(removeBySrc).observe(document.documentElement, { childList: true, subtree: true });
    }
  } catch (e) {
    // fetch failed or timed out; that's OK — we still block obvious parent overlays
  }

})();
