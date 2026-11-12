#!/usr/bin/env node
// Serves the static export in out/ under /dx-design-system (the GitHub Pages path) for tests and local preview.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../out");
const base = "/dx-design-system";
const port = Number(process.env.PORT || 4173);
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".woff": "font/woff", ".txt": "text/plain", ".ico": "image/x-icon" };

http.createServer((req, res) => {
  let url = decodeURIComponent((req.url || "/").split("?")[0]);
  if (url === "/" || url === base) { res.writeHead(302, { Location: base + "/" }); return res.end(); }
  if (!url.startsWith(base + "/")) { res.writeHead(404); return res.end("Not found"); }
  let file = path.join(root, url.slice(base.length));
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) { res.writeHead(404, { "Content-Type": types[".html"] }); return fs.createReadStream(path.join(root, "404.html")).pipe(res); }
  res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
}).listen(port, () => console.log(`Serving out/ at http://localhost:${port}${base}/`));
