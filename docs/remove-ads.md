# Removing Click Ads — What I changed

This repo had click-ads that affected users when watching embedded videos (click-through overlays, popups, and top-level navigation). Because the video players are embedded in cross-origin iframes (vidsrc / vidplay) there are limits to what can be removed inside the iframe. Browsers prevent cross-origin pages from being modified by the parent site.

What I implemented to remove/mitigate ads at the site level:

1. Player sandboxing
   - Added a sandbox attribute to viewer iframes (movies and TV) to stop embedded frames from opening popups or navigating the top page. This prevents many types of click-to-redirect ads.
   - sandbox value used: `allow-scripts allow-same-origin allow-forms allow-pointer-lock` — notably *not* `allow-popups` or `allow-top-navigation` so popups and top-level redirects are blocked.

2. Click shield (default-on)
   - The viewers now present a transparent overlay (`#clickShield`) over the iframe that intercepts clicks by default. That prevents accidental clicks that would land on ad elements inside the iframe.
   - A small control (`Enable player`) lets users explicitly allow interaction when they want to click inside the player.

3. Parent-level ad defenses
   - `shared/adblock/adblock.js` was updated to perform safe, conservative removal of parent-page ad elements. It removes obvious ad/overlay elements by id/class/title that match common ad keywords and optionally uses a small uAssets host pattern subset.
   - It purposely avoids removing the real player iframe (`#videoPlayer` / contents of `#playerContainer`) to avoid breaking playback.

4. Tests / demo
   - `test/adframe.html` simulates a malicious ad iframe that tries to navigate the top page or open popups.
   - `test/ad-demo.html` includes two instances of `adframe.html` so you can compare sandboxed vs unsandboxed behaviour.

Limitations / important notes
- We cannot remove or change ad content inside cross-origin iframes from the parent page — browsers enforce cross-origin protections. The measures above mitigate the user impact (no accidental popups / top redirects and parent overlays removed), but they don't actually change content inside the third-party player providers.
- If you control the providers or host direct file streams (same-origin), you can apply more direct ad-removal there.

How to test locally
1. Serve the project (e.g., from the repo root) with any static server.
2. Open `test/ad-demo.html` in a browser and try the "Navigate top page" and "Open popup" buttons inside both frames. The sandboxed frame (left) should be blocked, the unsandboxed one (right) may navigate or open popups.

If you'd like, I can:
- Add an opt-in setting that remembers whether each user wants the shield enabled by default.
- Add server-side handling that replaces ad-heavy embed sources with safer providers you control.

---
If you'd like me to proceed with any of the above or further harden the player experience, tell me which direction to take next and I’ll implement it. 