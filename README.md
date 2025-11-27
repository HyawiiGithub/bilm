CineNova — quick dev notes

This project (now branded as "CineNova") has a small 'anti-click ad' feature implemented in the viewer pages.

What changed
- Viewer iframes now include a sandbox attribute to block popups/top-level navigation.
- A default-on click shield prevents accidental clicks inside the player. Users can toggle it.
- `shared/adblock/adblock.js` was updated to remove obvious parent-page ad overlays while avoiding removing the main player iframe.

Testing
- Open `test/ad-demo.html` locally and compare the sandbox vs unsandboxed frame behaviour.

See `docs/remove-ads.md` for more details.
