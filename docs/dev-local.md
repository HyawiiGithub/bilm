# Local dev server: emulate production /cinenova/ base

Sometimes the site behaves differently when hosted at a sub-path (e.g. GitHub Pages at `/cinenova/`). To reproduce production behavior locally and avoid 404s caused by base-path mismatches, use the included `dev-server.js` which serves files both at `/` and emulates the `/cinenova/` base.

Requirements
- Node.js installed (v14+ recommended). No external npm packages required.

Run locally
1. From the repo root run:

```pwsh
# start the dev server on default port 8080
node dev-server.js

# or pick another port
node dev-server.js 9090
```

2. Open in the browser:
- Root (dev): http://127.0.0.1:8080/
- Emulated production base: http://127.0.0.1:8080/cinenova/

What this solves
- Pages that expect `/cinenova/` for shared assets and link generation will resolve under the emulated base.
- You can test both the root (development) and sub-path (production) behavior side-by-side.

Notes
- This is intentionally lightweight and uses Node core modules. It is meant for quick local testing and not production.
- If you prefer an alternative (Express-based server, or serving via your existing tooling), I can create a script / npm task for that instead.
