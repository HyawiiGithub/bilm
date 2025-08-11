(async () => {
  console.log('[Universal Adblock] Running...');

  // Fetch and parse ad filters (you can replace this with a more comprehensive list)
  const res = await fetch('https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/filters.txt');
  const txt = await res.text();
  const filters = txt
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('!') && !line.startsWith('@@'));

  // Convert filters into regex patterns
  const patterns = filters.map(line => {
    try {
      const regex = line
        .replace(/[\.\?\+\[\]\(\)\{\}\\]/g, '\\$&') // Escape regex chars
        .replace(/\*/g, '.*') // Convert wildcards
        .replace(/\^/g, '\\b'); // Anchor to word boundary
      return new RegExp(regex, 'i'); // Case-insensitive
    } catch {
      return null;
    }
  }).filter(Boolean);

  // Remove matching elements (ads, trackers, etc.)
  function blockAds() {
    const elements = document.querySelectorAll('iframe, script, img, link, div, video, audio, embed, object');
    elements.forEach(el => {
      const src = el.src || el.href || el.getAttribute('data-src') || '';
      if (patterns.some(rx => rx.test(src))) {
        console.warn('[Universal Adblock] Removed:', el);
        el.remove();
      }
    });
  }

  // Run immediately and watch for new elements
  blockAds();
  new MutationObserver(blockAds).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
