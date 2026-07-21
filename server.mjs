import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "dist");
const PORT = Number(process.env.PORT) || 8080;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
  ".map": "application/json",
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || "application/octet-stream";
  fs.createReadStream(filePath)
    .on("error", () => send(res, 404, "Not found"))
    .once("open", function streamOpen() {
      res.writeHead(200, { "Content-Type": type });
      this.pipe(res);
    });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const pathname = decodeURIComponent(url.pathname);

  if (pathname === "/health" || pathname === "/ready") {
    send(res, 200, "ok", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  const candidate = path.normalize(path.join(DIST, pathname === "/" ? "index.html" : pathname));
  if (!candidate.startsWith(DIST)) {
    send(res, 403, "Forbidden");
    return;
  }

  fs.stat(candidate, (err, stat) => {
    if (!err && stat.isFile()) {
      serveFile(res, candidate);
      return;
    }
    // SPA fallback
    serveFile(res, path.join(DIST, "index.html"));
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`fortnite-gift-cards listening on ${PORT}`);
});
