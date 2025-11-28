#!/usr/bin/env node
// dev-server.js
// Small static file server that serves the repo both at / and also emulates /cinenova/ base path.

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = process.argv[2] ? parseInt(process.argv[2], 10) : 8080;
const root = process.cwd();
const prefix = '/cinenova'; // emulate production base

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json'
};

function send404(res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end('404 — Not found');
}

function sendFile(res, filePath, stat) {
  const ext = path.extname(filePath).toLowerCase();
  const ct = contentTypes[ext] || 'application/octet-stream';
  res.statusCode = 200;
  res.setHeader('Content-Type', ct);
  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
}

const server = http.createServer((req, res) => {
  try {
    const parsed = url.parse(req.url || '/');
    let pathname = decodeURIComponent(parsed.pathname || '/');

    // If request starts with the production prefix, strip it so we can serve files
    let emulatePrefix = false;
    if (pathname.startsWith(prefix + '/')) {
      emulatePrefix = true;
      pathname = pathname.slice(prefix.length);
      if (!pathname) pathname = '/';
    }

    // Map root to index.html
    let filePath = path.join(root, pathname);
    // If path is a directory, append index.html
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    // If the file doesn't exist and this is a prefix-emulated request, try prefix-root mapping
    if (!fs.existsSync(filePath)) {
      // If request was to /cinenova/ and asked for /home/ etc, that should map to ./home/
      // Already handled above because we sliced prefix. If still missing, try fallback: serve index.html (single page apps)
      const fallback = path.join(root, pathname, 'index.html');
      if (fs.existsSync(fallback)) {
        sendFile(res, fallback, fs.statSync(fallback));
        return;
      }
      // For requests like /cinenova/ make sure /index.html is served
      if (pathname === '/' && fs.existsSync(path.join(root, 'index.html'))) {
        filePath = path.join(root, 'index.html');
      } else {
        return send404(res);
      }
    }

    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      sendFile(res, filePath, stat);
    } else {
      send404(res);
    }
  } catch (err) {
    console.error('Server error for', req.url, err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end('500 - Internal Server Error');
  }
});

server.listen(port, () => {
  console.log(`Dev server running at http://127.0.0.1:${port}/`);
  console.log(`Also emulating production base: http://127.0.0.1:${port}${prefix}/`);
});
