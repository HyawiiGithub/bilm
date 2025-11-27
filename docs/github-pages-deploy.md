# Deploying CineNova to GitHub Pages

This guide explains how to publish the site under the new brand path `/cinenova/` on GitHub Pages.

Important: a full URL change requires renaming the repository to `cinenova` (owner.github.io/cinenova) or configuring a custom domain. The codebase is prepared for `/cinenova/` as the deployment base.

Steps to publish under `/cinenova/` (recommended when rebranding):

1. Rename the repo on GitHub (Settings → Rename) to `cinenova`.
   - After renaming, GitHub Pages will serve the site at `https://<owner>.github.io/cinenova/` (public by default).

2. Configure Pages: in the repository 'Settings' → 'Pages':
   - Build and deployment → Source: select `main` branch and `/ (root)`.
   - Save and wait a minute for the site to be published.

3. Clear caches during testing:
   - Unregister any active service worker in the browser (DevTools → Application → Service Workers → Unregister).
   - Do a hard-refresh (Ctrl+F5) or open an incognito window to avoid stale files.

4. Confirm the site loads at `https://<owner>.github.io/cinenova/` and browse:
   - Home, Movies, TV and viewer pages should load and not 404.
   - The manifest should use `/cinenova/` base paths (the repo manifest was updated for this).

5. (Optional) If you prefer to keep the repository name as `bilm` and still publish at `/cinenova/`, use a GitHub App/CI step to publish the site to that path or use a custom domain / redirect rule. (Note: the codebase now assumes `/cinenova/` when deployed; compatibility fallbacks were removed.)

Notes and compatibility
- The JS now detects whether the site is under `/cinenova` or root and builds links accordingly.
- Icons and manifest start_url are set to `/cinenova/` as part of the rebrand; if you keep the repo name `bilm` and host under `/bilm/`, you may want to update `manifest.json` accordingly.

If you want, I can rename repo paths in the code to remove the compatibility fallbacks (force only /cinenova) and add a deployment guide tailored to your chosen hosting approach.
