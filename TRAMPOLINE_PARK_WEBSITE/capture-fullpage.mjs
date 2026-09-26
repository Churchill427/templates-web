import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const __dirname = path.resolve();
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/contact.html';
  const filePath = path.join(__dirname, reqPath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

const PORT = 3008;
await new Promise(r => server.listen(PORT, r));

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const debugPort = 9230;
const userDataDir = path.join(__dirname, '.edge-fullpage-profile');

const edge = spawn(edgePath, [
  '--headless=new',
  `--remote-debugging-port=${debugPort}`,
  `--user-data-dir=${userDataDir}`,
  '--disable-gpu',
  '--no-sandbox',
  'about:blank'
]);

for (let i = 0; i < 30; i++) {
  await new Promise(r => setTimeout(r, 200));
  try {
    const res = await fetch(`http://127.0.0.1:${debugPort}/json/version`);
    if ((await res.json()).webSocketDebuggerUrl) break;
  } catch (e) {}
}

const newTabRes = await fetch(`http://127.0.0.1:${debugPort}/json/new?about:blank`, { method: 'PUT' });
const ws = new WebSocket((await newTabRes.json()).webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);

let id = 1;
const callbacks = new Map();
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.id && callbacks.has(data.id)) {
    const cb = callbacks.get(data.id);
    callbacks.delete(data.id);
    cb(data.result);
  }
};

function send(method, params = {}) {
  const msgId = id++;
  return new Promise(resolve => {
    callbacks.set(msgId, resolve);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });
}

await send('Page.enable');
await send('Runtime.enable');

async function captureNavbar(width, filename) {
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height: 400,
    deviceScaleFactor: 1,
    mobile: width < 800
  });
  await send('Page.navigate', { url: `http://localhost:${PORT}/pricing.html` });
  await new Promise(r => setTimeout(r, 600));

  const screenshot = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false
  });
  const buffer = Buffer.from(screenshot.data, 'base64');
  fs.writeFileSync(path.join(__dirname, filename), buffer);
  console.log(`Saved navbar screenshot: ${filename} (${width}x400)`);
}

await captureNavbar(1200, 'navbar-desktop.png');
await captureNavbar(768, 'navbar-tablet.png');
await captureNavbar(360, 'navbar-mobile.png');

ws.close();
edge.kill();
server.close();
try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) {}
