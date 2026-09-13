// Custom production server for cPanel's Node.js App Manager (Phusion Passenger).
// Runs the already-built .next output using the project's own node_modules,
// instead of the self-contained .next/standalone bundle (which would require
// re-transferring a duplicate node_modules — this app root already has one
// from `npm install --include=dev`).
//
// Usage: place this file at the project root (next to package.json) and set
// cPanel's "Application startup file" to its filename.
const { createServer } = require("http");
const next = require("next");

const port = process.env.PORT || 3000;
const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, () => {
    console.log(`> Ready on port ${port}`);
  });
});
